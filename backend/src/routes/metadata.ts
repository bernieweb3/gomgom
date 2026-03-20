import { Hono } from 'hono'
import type { Env } from '../types'
import { DatabaseService } from '../services/database'
import { LEVEL_IMAGE_MAP, LEVEL_CONFIGS, NFT_CONFIG, calculateLoyaltyLevel, generateImageUrl, getLevelConfig } from '../config/nft-levels'

const app = new Hono<{ Bindings: Env }>()

function generateMockAttributes(tokenId: number) {
  const m = (tokenId % 5) + 1
  return {
    loyaltyPoints: m * 1000, flightsTaken: m * 2, totalSpending: m * 10000000,
    bankTier: ['Standard', 'Silver', 'Gold', 'Platinum', 'Diamond'][Math.min(m - 1, 4)],
    resortsVisited: m, milesEarned: m * 5000,
    statusTier: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'][Math.min(m - 1, 4)]
  }
}

function calculateProgressToNextLevel(attrs: any, currentLevel: number): number {
  if (currentLevel >= NFT_CONFIG.MAX_LEVEL) return 100
  const next = getLevelConfig(currentLevel + 1)
  if (!next) return 100
  const req = next.minRequirements.loyaltyPoints || 0
  if (req === 0) return 100
  return Math.min(100, Math.round((attrs.loyaltyPoints / req) * 100))
}

// GET /api/metadata/health/check
app.get('/health/check', (c) => c.json({
  status: 'healthy', service: 'metadata-api', timestamp: new Date().toISOString(),
  levels_configured: LEVEL_CONFIGS.length, max_level: NFT_CONFIG.MAX_LEVEL, gateway: NFT_CONFIG.PINATA_GATEWAY
}))

// GET /api/metadata/:tokenId
app.get('/:tokenId', async (c) => {
  const tokenId = parseInt(c.req.param('tokenId'))
  if (isNaN(tokenId) || tokenId < 0) return c.json({ error: 'Invalid token ID' }, 400)

  let nftData: any = null
  let loyaltyLevel = 0
  let userAttributes: any = {}

  try {
    const db = new DatabaseService(c.env.NEON_DB_URL)
    const query = `
      SELECT ln.token_id, ln.owner_wallet_address, ln.minted_at,
        na.loyalty_level, na.loyalty_points, na.flights_taken, na.bank_tier,
        na.resorts_visited, na.total_spending, na.miles_earned, na.status_tier, na.last_updated
      FROM loyalty_nfts ln
      LEFT JOIN nft_attributes na ON ln.token_id = na.nft_token_id
      WHERE ln.token_id = $1
    `
    const result = await db.executeQuery(query, [tokenId])
    if (result.rows.length > 0) {
      nftData = result.rows[0]
      userAttributes = {
        loyaltyPoints: nftData.loyalty_points || 0, flightsTaken: nftData.flights_taken || 0,
        totalSpending: parseFloat(nftData.total_spending) || 0, bankTier: nftData.bank_tier || 'Standard',
        resortsVisited: nftData.resorts_visited || 0, milesEarned: nftData.miles_earned || 0,
        statusTier: nftData.status_tier || 'Bronze'
      }
      loyaltyLevel = calculateLoyaltyLevel(userAttributes)
    } else {
      loyaltyLevel = tokenId % 8
      userAttributes = generateMockAttributes(tokenId)
    }
  } catch {
    loyaltyLevel = tokenId % 8
    userAttributes = generateMockAttributes(tokenId)
  }

  const levelConfig = getLevelConfig(loyaltyLevel)
  const imageCid = LEVEL_IMAGE_MAP[loyaltyLevel]
  const imageUrl = generateImageUrl(imageCid)

  const attributes = [
    { trait_type: 'Loyalty Level', value: loyaltyLevel },
    { trait_type: 'Level Name', value: levelConfig?.name || `Level ${loyaltyLevel}` },
    { trait_type: 'Loyalty Points', value: userAttributes.loyaltyPoints },
    { trait_type: 'Flights Taken', value: userAttributes.flightsTaken },
    { trait_type: 'Bank Tier', value: userAttributes.bankTier || 'Standard' },
    { trait_type: 'Status Tier', value: userAttributes.statusTier || 'Bronze' },
    { trait_type: 'Total Spending (VND)', value: userAttributes.totalSpending },
    { trait_type: 'Resorts Visited', value: userAttributes.resortsVisited },
    { trait_type: 'Miles Earned', value: userAttributes.milesEarned },
    { trait_type: 'Rarity', value: loyaltyLevel >= 5 ? 'Elite' : loyaltyLevel >= 3 ? 'Rare' : 'Common' },
    ...(nftData?.last_updated ? [{ trait_type: 'Last Updated', value: new Date(nftData.last_updated).toISOString() }] : []),
  ]

  const metadata = {
    name: `${NFT_CONFIG.DEFAULT_NAME_PREFIX} #${tokenId}`,
    description: levelConfig?.description || NFT_CONFIG.DEFAULT_DESCRIPTION,
    image: imageUrl, external_url: `https://gomgom.pages.dev/nft/${tokenId}`,
    attributes, animation_url: null, background_color: null,
    loyalty_ecosystem: {
      level: loyaltyLevel, level_name: levelConfig?.name || `Level ${loyaltyLevel}`,
      max_level: NFT_CONFIG.MAX_LEVEL,
      progress_to_next_level: calculateProgressToNextLevel(userAttributes, loyaltyLevel),
      eligible_perks: [],
      partner_benefits: {
        hdbank: userAttributes.bankTier,
        vietjet: `${userAttributes.flightsTaken} flights`,
        dragon_city: `${userAttributes.resortsVisited} visits`
      }
    }
  }

  return new Response(JSON.stringify(metadata), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    }
  })
})

export default app
