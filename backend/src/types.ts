export interface Env {
  // Database
  NEON_DB_URL: string

  // Blockchain
  LISK_SEPOLIA_RPC_URL: string
  ADMIN_PRIVATE_KEY: string
  NEXT_PUBLIC_CONTRACT_REGISTRY_ADDRESS: string
  NEXT_PUBLIC_CONTRACT_NFT_ADDRESS: string
  NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS: string

  // IPFS / Pinata
  PINATA_API_KEY: string
  PINATA_SECRET_API_KEY: string

  // General
  NODE_ENV: string
}
