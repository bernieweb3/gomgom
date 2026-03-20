export interface LevelConfig {
  level: number
  name: string
  description: string
  imageCid: string
  minRequirements: {
    loyaltyPoints?: number
    flightsTaken?: number
    totalSpending?: number
    bankTier?: string
  }
}

export const LEVEL_IMAGE_MAP: { [key: number]: string } = {
  0: 'bafkreihs44bfkpmh2wnuec3b567difnksanta37x7dtbnmlcylwn7h6gw4',
  1: 'bafybeibh56qt2q7dq7emhbrtp7vodkbkzerepxrdeaynhpubqizri4uute',
  2: 'bafkreidwdhm7e7pk4yfltkj3scur4mo7lobq5jetxod2zdstwcvxc46ptu',
  3: 'bafkreih6smgbqwhgj4cul57afpd5465o3yxnpkvwl6f2ao5x2k65tsn7uq',
  4: 'bafybeibywmwc7vfghnchifh6dwbfzxhvb7joutacmwjf3pd2s4g2dbw2aa',
  5: 'bafkreibjamecx6mrlua2bubdjek6el25gkgylkifnnkapu57jhn7dayqly',
  6: 'bafybeihajokglb5lfg2ujjidpgxdvsgy2cretjntrbdio7ffxo6vbqoaiy',
  7: 'bafybeie36og74jvgzjisjwzxs5c75rcm7e4g7qj6jmvyszxldp5nexyfly',
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 0, name: 'Explorer', description: 'Welcome to GomGom! Start your loyalty journey.', imageCid: LEVEL_IMAGE_MAP[0], minRequirements: { loyaltyPoints: 0, flightsTaken: 0, totalSpending: 0 } },
  { level: 1, name: 'Bronze Traveler', description: "You're getting started with your travels!", imageCid: LEVEL_IMAGE_MAP[1], minRequirements: { loyaltyPoints: 1000, flightsTaken: 2, totalSpending: 5000000 } },
  { level: 2, name: 'Silver Navigator', description: "You're becoming a seasoned traveler!", imageCid: LEVEL_IMAGE_MAP[2], minRequirements: { loyaltyPoints: 2500, flightsTaken: 5, totalSpending: 15000000, bankTier: 'Silver' } },
  { level: 3, name: 'Gold Adventurer', description: 'Your adventures are truly impressive!', imageCid: LEVEL_IMAGE_MAP[3], minRequirements: { loyaltyPoints: 5000, flightsTaken: 10, totalSpending: 35000000, bankTier: 'Gold' } },
  { level: 4, name: 'Diamond Explorer', description: "You're a true connoisseur of luxury travel!", imageCid: LEVEL_IMAGE_MAP[4], minRequirements: { loyaltyPoints: 10000, flightsTaken: 20, totalSpending: 75000000, bankTier: 'Platinum' } },
  { level: 5, name: 'Platinum Voyager', description: 'Your loyalty and engagement are exceptional!', imageCid: LEVEL_IMAGE_MAP[5], minRequirements: { loyaltyPoints: 20000, flightsTaken: 35, totalSpending: 150000000, bankTier: 'Platinum' } },
  { level: 6, name: 'Elite Wings', description: "You've reached the pinnacle of travel excellence!", imageCid: LEVEL_IMAGE_MAP[6], minRequirements: { loyaltyPoints: 35000, flightsTaken: 50, totalSpending: 300000000, bankTier: 'Diamond' } },
  { level: 7, name: 'Royal Crown', description: 'You are the ultimate GomGom loyalty member!', imageCid: LEVEL_IMAGE_MAP[7], minRequirements: { loyaltyPoints: 50000, flightsTaken: 75, totalSpending: 500000000, bankTier: 'Diamond' } },
]

export const NFT_CONFIG = {
  METADATA_BASE_URL: 'https://gomgom-backend.bernieweb3.workers.dev/api/metadata',
  PINATA_GATEWAY: 'https://harlequin-impressed-guan-658.mypinata.cloud',
  DEFAULT_NAME_PREFIX: 'GomGom Loyalty NFT',
  DEFAULT_DESCRIPTION: 'Dynamic loyalty NFT that evolves with your engagement across our partner ecosystem.',
  MAX_LEVEL: 7,
  MIN_LEVEL: 0,
} as const

export function getLevelConfig(level: number): LevelConfig | null {
  return LEVEL_CONFIGS.find(c => c.level === level) || null
}

export function calculateLoyaltyLevel(attributes: {
  loyaltyPoints: number
  flightsTaken: number
  totalSpending: number
  bankTier: string
}): number {
  const bankTierHierarchy = ['Standard', 'Silver', 'Gold', 'Platinum', 'Diamond']
  for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
    const cfg = LEVEL_CONFIGS[i]
    const req = cfg.minRequirements
    const meetsPoints = attributes.loyaltyPoints >= (req.loyaltyPoints || 0)
    const meetsFlights = attributes.flightsTaken >= (req.flightsTaken || 0)
    const meetsSpending = attributes.totalSpending >= (req.totalSpending || 0)
    const userTierIndex = bankTierHierarchy.indexOf(attributes.bankTier)
    const reqTierIndex = req.bankTier ? bankTierHierarchy.indexOf(req.bankTier) : 0
    const meetsBankTier = userTierIndex >= reqTierIndex
    if (meetsPoints && meetsFlights && meetsSpending && meetsBankTier) {
      return Math.max(NFT_CONFIG.MIN_LEVEL, Math.min(cfg.level, NFT_CONFIG.MAX_LEVEL))
    }
  }
  return NFT_CONFIG.MIN_LEVEL
}

export function generateMetadataUrl(tokenId: number): string {
  return `${NFT_CONFIG.METADATA_BASE_URL}/${tokenId}`
}

export function generateImageUrl(imageCid: string): string {
  return `${NFT_CONFIG.PINATA_GATEWAY}/ipfs/${imageCid}`
}
