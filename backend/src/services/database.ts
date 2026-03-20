import { dbQuery } from '../database'

export interface User {
  wallet_address: string
  created_at: Date
  updated_at: Date
}

export interface Perk {
  perk_id: number
  perk_name: string
  description: string
  brand_id: number
  unlock_condition: any
  is_active: boolean
}

export interface NFTCompleteInfo {
  user_id: string
  wallet_address: string
  token_id: number
  loyalty_points: number
  tier_level: string
  total_transactions: number
  total_spent: number
  vietjet_flights: number
  hdbank_transactions: number
  dragon_city_visits: number
  staked_eth: number
}

export class DatabaseService {
  private dbUrl: string

  constructor(dbUrl: string) {
    this.dbUrl = dbUrl
  }

  async executeQuery(query: string, params?: unknown[]): Promise<{ rows: any[]; rowCount: number }> {
    return dbQuery(this.dbUrl, query, params)
  }

  async getNFTMetadata(tokenId: number): Promise<any | null> {
    const query = `
      SELECT
        ln.token_id, ln.owner_wallet_address, ln.minted_at,
        COALESCE(na.loyalty_level, 0) as loyalty_level,
        COALESCE(na.loyalty_points, 0) as loyalty_points,
        COALESCE(na.flights_taken, 0) as flights_taken,
        COALESCE(na.bank_tier, 'Standard') as bank_tier,
        COALESCE(na.resorts_visited, 0) as resorts_visited,
        COALESCE(na.total_spending, 0.00) as total_spending,
        COALESCE(na.miles_earned, 0) as miles_earned,
        COALESCE(na.status_tier, 'Bronze') as status_tier,
        COALESCE(na.last_updated, ln.minted_at) as last_updated
      FROM loyalty_nfts ln
      LEFT JOIN nft_attributes na ON ln.token_id = na.nft_token_id
      WHERE ln.token_id = $1
    `
    const result = await this.executeQuery(query, [tokenId])
    return result.rows.length > 0 ? result.rows[0] : null
  }

  async updateLoyaltyLevel(tokenId: number): Promise<number> {
    const result = await this.executeQuery('SELECT calculate_and_update_loyalty_level($1) as new_level', [tokenId])
    return result.rows[0]?.new_level || 0
  }

  async initUser(walletAddress: string): Promise<{ status: string; message: string; user?: User }> {
    if (!this.isValidWalletAddress(walletAddress)) throw new Error('Invalid wallet address format')
    const existing = await this.getUserByAddress(walletAddress)
    if (existing) return { status: 'success', message: 'User already exists', user: existing }
    const result = await this.executeQuery(
      `INSERT INTO users (wallet_address) VALUES ($1) ON CONFLICT (wallet_address) DO NOTHING RETURNING wallet_address, created_at, updated_at`,
      [walletAddress.toLowerCase()]
    )
    if (result.rows.length === 0) {
      const user = await this.getUserByAddress(walletAddress)
      return { status: 'success', message: 'User already exists', user: user! }
    }
    return { status: 'success', message: 'User initialized successfully', user: result.rows[0] }
  }

  async getUserByAddress(walletAddress: string): Promise<User | null> {
    const result = await this.executeQuery('SELECT * FROM users WHERE wallet_address = $1', [walletAddress.toLowerCase()])
    return result.rows.length > 0 ? result.rows[0] : null
  }

  async createNFTRecord(walletAddress: string, tokenId: number, _transactionHash: string, ipfsMetadata?: {
    name?: string; description?: string; imageHash?: string; metadataHash?: string; tokenUri?: string; attributes?: Array<{ trait_type: string; value: any }>
  }): Promise<void> {
    const tokenUri = ipfsMetadata?.tokenUri || ''
    await this.executeQuery(
      `INSERT INTO loyalty_nfts (token_id, owner_wallet_address, token_uri) VALUES ($1, $2, $3) ON CONFLICT (token_id) DO UPDATE SET token_uri = EXCLUDED.token_uri`,
      [tokenId, walletAddress.toLowerCase(), tokenUri]
    )
    await this.executeQuery(
      `INSERT INTO nft_attributes (nft_token_id, loyalty_level, loyalty_points, bank_tier, status_tier) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (nft_token_id) DO UPDATE SET loyalty_level = EXCLUDED.loyalty_level, loyalty_points = EXCLUDED.loyalty_points, bank_tier = EXCLUDED.bank_tier, status_tier = EXCLUDED.status_tier, last_updated = CURRENT_TIMESTAMP`,
      [tokenId, 1, 0, 'Standard', 'Bronze']
    )
  }

  async getNFTCompleteInfo(walletAddress: string): Promise<any | null> {
    const result = await this.executeQuery(`SELECT * FROM nft_complete_info WHERE owner_wallet_address = $1`, [walletAddress.toLowerCase()])
    return result.rows.length > 0 ? result.rows[0] : null
  }

  async processUserAction(walletAddress: string, actionType: string, details: any): Promise<{ status: string; message: string; pointsEarned?: number }> {
    const pointsEarned = this.calculatePoints(actionType, details)

    await this.executeQuery(
      `INSERT INTO user_actions (user_id, action_type, details, points_earned) VALUES ($1, $2, $3, $4)`,
      [walletAddress.toLowerCase(), actionType, JSON.stringify(details), pointsEarned]
    )

    // Update nft_attributes loyalty points and action-specific fields
    let updateQuery = `UPDATE nft_attributes SET loyalty_points = loyalty_points + $2, total_transactions = total_transactions + 1, updated_at = CURRENT_TIMESTAMP`
    const queryParams: unknown[] = [walletAddress.toLowerCase(), pointsEarned]

    switch (actionType) {
      case 'vietjet_flight_booking':
        updateQuery += ', vietjet_flights = vietjet_flights + 1'
        break
      case 'hdbank_transaction':
        updateQuery += `, hdbank_transactions = hdbank_transactions + 1, total_spent = total_spent + $${queryParams.length + 1}`
        queryParams.push(details.amount || 0)
        break
      case 'dragon_city_visit':
        updateQuery += ', dragon_city_visits = dragon_city_visits + 1'
        break
    }

    updateQuery += ' WHERE user_id = $1'
    await this.executeQuery(updateQuery, queryParams)

    // Update tier
    await this.executeQuery(
      `UPDATE nft_attributes SET tier_level = CASE WHEN loyalty_points >= 10000 THEN 'Diamond' WHEN loyalty_points >= 5000 THEN 'Platinum' WHEN loyalty_points >= 2000 THEN 'Gold' WHEN loyalty_points >= 500 THEN 'Silver' ELSE 'Bronze' END WHERE user_id = $1`,
      [walletAddress.toLowerCase()]
    )

    return { status: 'success', message: 'Action processed successfully', pointsEarned }
  }

  async getUserPerks(walletAddress: string): Promise<Array<Perk & { is_unlocked: boolean }>> {
    const perksResult = await this.executeQuery('SELECT * FROM perks WHERE is_active = true ORDER BY brand_id, perk_name')
    const userInfo = await this.getNFTCompleteInfo(walletAddress)
    return perksResult.rows.map((perk: Perk) => ({
      ...perk,
      is_unlocked: this.evaluatePerkUnlockCondition(perk, userInfo)
    }))
  }

  private isValidWalletAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  private calculatePoints(actionType: string, details: any): number {
    const pointsMap: { [key: string]: number } = {
      'vietjet_flight_booking': details.pointsEarned || 100,
      'hdbank_transaction': Math.floor((details.amount || 0) / 1000),
      'dragon_city_visit': details.pointsEarned || 50,
      'hd_saison_purchase': Math.floor((details.amount || 0) / 10000),
      'ha_long_star_booking': details.pointsEarned || 150,
    }
    return Math.max(pointsMap[actionType] || 0, 0)
  }

  private evaluatePerkUnlockCondition(perk: Perk, userInfo: NFTCompleteInfo | null): boolean {
    if (!userInfo || !perk.unlock_condition) return false
    const cond = perk.unlock_condition
    const tierLevels = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond']
    if (cond.min_loyalty_points && userInfo.loyalty_points < cond.min_loyalty_points) return false
    if (cond.min_tier_level && tierLevels.indexOf(userInfo.tier_level) < tierLevels.indexOf(cond.min_tier_level)) return false
    if (cond.min_staked_eth && userInfo.staked_eth < cond.min_staked_eth) return false
    if (cond.min_transactions && userInfo.total_transactions < cond.min_transactions) return false
    if (cond.min_brand_specific) {
      const brandChecks: { [k: string]: number } = { vietjet_flights: userInfo.vietjet_flights, hdbank_transactions: userInfo.hdbank_transactions, dragon_city_visits: userInfo.dragon_city_visits }
      for (const [key, required] of Object.entries(cond.min_brand_specific)) {
        if ((brandChecks[key] ?? 0) < (required as number)) return false
      }
    }
    return true
  }
}
