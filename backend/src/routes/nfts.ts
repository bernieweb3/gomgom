import { Hono } from 'hono'
import type { Env } from '../types'
import { DatabaseService } from '../services/database'
import { BlockchainService } from '../services/blockchain'
import { IpfsService } from '../services/ipfs'
import { generateMetadataUrl, NFT_CONFIG } from '../config/nft-levels'

const app = new Hono<{ Bindings: Env }>()

function getBlockchain(env: Env) {
  return new BlockchainService({
    rpcUrl: env.LISK_SEPOLIA_RPC_URL,
    adminPrivateKey: env.ADMIN_PRIVATE_KEY,
    contracts: {
      registry: env.NEXT_PUBLIC_CONTRACT_REGISTRY_ADDRESS,
      nft: env.NEXT_PUBLIC_CONTRACT_NFT_ADDRESS,
      staking: env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS,
    }
  })
}

// POST /api/nfts/mint
app.post('/mint', async (c) => {
  try {
    const { userAddress } = await c.req.json()
    if (!userAddress) return c.json({ status: 'error', message: 'User address is required' }, 400)
    const db = new DatabaseService(c.env.NEON_DB_URL)
    const user = await db.getUserByAddress(userAddress)
    if (!user) return c.json({ status: 'error', message: 'User not found. Please initialize user first.' }, 404)
    const bc = getBlockchain(c.env)
    const ownsNFT = await bc.userOwnsNFT(userAddress)
    if (ownsNFT) return c.json({ status: 'error', message: 'User already owns an NFT' }, 400)
    const currentSupply = await bc.getTotalSupply()
    const expectedTokenId = currentSupply + 1
    const staticTokenURI = generateMetadataUrl(expectedTokenId)
    const mintResult = await bc.mintNFTWithURI(userAddress, staticTokenURI)
    await db.createNFTRecord(userAddress, mintResult.tokenId, mintResult.transactionHash, {
      name: `${NFT_CONFIG.DEFAULT_NAME_PREFIX} #${mintResult.tokenId}`,
      description: NFT_CONFIG.DEFAULT_DESCRIPTION,
      tokenUri: staticTokenURI,
      attributes: [
        { trait_type: 'Loyalty Level', value: 0 },
        { trait_type: 'Level Name', value: 'Explorer' },
        { trait_type: 'Loyalty Points', value: 0 },
        { trait_type: 'Flights Taken', value: 0 },
        { trait_type: 'Bank Tier', value: 'Standard' },
        { trait_type: 'Status Tier', value: 'Bronze' },
        { trait_type: 'Rarity', value: 'Common' },
      ]
    })
    return c.json({
      status: 'success',
      tokenId: mintResult.tokenId,
      transactionHash: mintResult.transactionHash,
      tokenURI: staticTokenURI,
      metadataUrl: staticTokenURI,
      architecture: { type: 'dynamic_nft', api_endpoint: `${NFT_CONFIG.METADATA_BASE_URL}/${mintResult.tokenId}` },
      message: 'Dynamic NFT minted successfully!'
    })
  } catch (error) {
    return c.json({ status: 'error', message: (error as Error).message }, 500)
  }
})

// GET /api/nfts/user/:walletAddress
app.get('/user/:walletAddress', async (c) => {
  try {
    const { walletAddress } = c.req.param()
    if (!walletAddress) return c.json({ status: 'error', message: 'Wallet address is required' }, 400)
    const db = new DatabaseService(c.env.NEON_DB_URL)
    const nftInfo = await db.getNFTCompleteInfo(walletAddress)
    if (!nftInfo) return c.json({ status: 'error', message: 'NFT not found for this user' }, 404)
    const bc = getBlockchain(c.env)
    const [tokenId, stakingInfo] = await Promise.all([
      bc.getUserTokenId(walletAddress),
      bc.getUserStakingInfo(walletAddress)
    ])
    return c.json({
      status: 'success',
      data: {
        ...nftInfo, tokenId,
        blockchain: {
          stakingInfo,
          contractAddresses: {
            nft: c.env.NEXT_PUBLIC_CONTRACT_NFT_ADDRESS,
            staking: c.env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS,
            registry: c.env.NEXT_PUBLIC_CONTRACT_REGISTRY_ADDRESS,
          }
        }
      }
    })
  } catch (error) {
    return c.json({ status: 'error', message: (error as Error).message }, 500)
  }
})

// POST /api/nfts/mint-with-metadata
app.post('/mint-with-metadata', async (c) => {
  try {
    const { userAddress, imageBase64, filename, name, description, attributes = [], externalUrl } = await c.req.json()
    if (!userAddress || !imageBase64 || !name || !description) {
      return c.json({ status: 'error', message: 'userAddress, imageBase64, name, and description are required' }, 400)
    }
    const db = new DatabaseService(c.env.NEON_DB_URL)
    const user = await db.getUserByAddress(userAddress)
    if (!user) return c.json({ status: 'error', message: 'User not found. Please initialize user first.' }, 404)
    const bc = getBlockchain(c.env)
    const ownsNFT = await bc.userOwnsNFT(userAddress)
    if (ownsNFT) return c.json({ status: 'error', message: 'User already owns an NFT' }, 400)
    const ipfsCfg = { apiKey: c.env.PINATA_API_KEY, secretApiKey: c.env.PINATA_SECRET_API_KEY }
    // Decode base64 image
    const binaryStr = atob(imageBase64)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i)
    const imageHash = await IpfsService.pinBytesToIPFS(ipfsCfg, bytes.buffer, filename || 'nft-image.png', { name: `${name} - Image`, metadata: { type: 'nft_image', user_address: userAddress } })
    const metadata = IpfsService.createNFTMetadata({ name, description, imageHash, attributes, externalUrl })
    const metadataHash = await IpfsService.pinJSONToIPFS(ipfsCfg, metadata, { name: `${name} - Metadata`, metadata: { type: 'nft_metadata', nft_name: name, user_address: userAddress } })
    const tokenUri = `ipfs://${metadataHash}`
    const mintResult = await bc.mintNFTWithURI(userAddress, tokenUri)
    await db.createNFTRecord(userAddress, mintResult.tokenId, mintResult.transactionHash, { name, description, imageHash, metadataHash, tokenUri, attributes })
    return c.json({
      status: 'success',
      tokenId: mintResult.tokenId,
      transactionHash: mintResult.transactionHash,
      ipfs: { imageHash, metadataHash, tokenUri, imageUrl: IpfsService.getIPFSUrl(imageHash), metadataUrl: IpfsService.getIPFSUrl(metadataHash) },
      metadata,
      message: 'NFT minted successfully with IPFS metadata'
    })
  } catch (error) {
    return c.json({ status: 'error', message: (error as Error).message }, 500)
  }
})

// GET /api/nfts/demo-gallery
app.get('/demo-gallery', async (c) => {
  try {
    const ipfsCfg = { apiKey: c.env.PINATA_API_KEY, secretApiKey: c.env.PINATA_SECRET_API_KEY }
    const pinataData = await IpfsService.getPinList(ipfsCfg, { status: 'pinned', pageLimit: 50, metadata: { type: 'nft_metadata' } })
    const nftGallery = pinataData.rows.map(item => ({
      id: item.id, ipfsHash: item.ipfs_pin_hash, name: item.metadata.name,
      metadataUrl: IpfsService.getIPFSUrl(item.ipfs_pin_hash),
      datePinned: item.date_pinned, size: item.size, metadata: item.metadata.keyvalues
    }))
    return c.json({ status: 'success', data: { total: pinataData.count, nfts: nftGallery } })
  } catch (error) {
    return c.json({ status: 'error', message: (error as Error).message }, 500)
  }
})

// POST /api/nfts/update-loyalty/:tokenId
app.post('/update-loyalty/:tokenId', async (c) => {
  try {
    const tokenId = parseInt(c.req.param('tokenId'))
    if (isNaN(tokenId)) return c.json({ status: 'error', message: 'Invalid token ID' }, 400)
    const { actionType, actionDetails } = await c.req.json()
    const db = new DatabaseService(c.env.NEON_DB_URL)
    const nftData = await db.getNFTMetadata(tokenId)
    if (!nftData) return c.json({ status: 'error', message: 'NFT not found' }, 404)
    const actionResult = await db.processUserAction(nftData.owner_wallet_address, actionType, actionDetails || {})
    const newLevel = await db.updateLoyaltyLevel(tokenId)
    const updatedMetadata = await db.getNFTMetadata(tokenId)
    return c.json({
      status: 'success', tokenId,
      previousLevel: nftData.loyalty_level, newLevel,
      levelChanged: newLevel !== nftData.loyalty_level,
      actionProcessed: actionResult, updatedAttributes: updatedMetadata,
      metadataUrl: generateMetadataUrl(tokenId),
      message: newLevel !== nftData.loyalty_level ? `Congratulations! Your NFT evolved to level ${newLevel}!` : 'NFT attributes updated successfully'
    })
  } catch (error) {
    return c.json({ status: 'error', message: (error as Error).message }, 500)
  }
})

export default app
