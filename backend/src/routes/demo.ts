import { Hono } from 'hono'
import type { Env } from '../types'
import { IpfsService } from '../services/ipfs'

const app = new Hono<{ Bindings: Env }>()

function ipfsCfg(env: Env) {
  return { apiKey: env.PINATA_API_KEY, secretApiKey: env.PINATA_SECRET_API_KEY }
}

// GET /api/demo/ipfs/test
app.get('/ipfs/test', async (c) => {
  try {
    const connected = await IpfsService.testConnection(ipfsCfg(c.env))
    return c.json({ success: true, connected, message: connected ? 'IPFS connection successful' : 'IPFS connection failed' })
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500)
  }
})

// POST /api/demo/ipfs/create-sample-metadata
app.post('/ipfs/create-sample-metadata', async (c) => {
  try {
    const cfg = ipfsCfg(c.env)
    const sampleMetadata = IpfsService.createNFTMetadata({
      name: 'GomGom Demo NFT #1',
      description: 'A demonstration NFT for the GomGom Loyalty System showcasing IPFS integration.',
      imageHash: 'QmYourImageHashWouldGoHere',
      attributes: [{ trait_type: 'Tier', value: 'Bronze' }, { trait_type: 'Loyalty Points', value: 100 }, { trait_type: 'Special', value: 'Demo NFT' }],
      externalUrl: 'https://gomgom.com/nft/demo-1'
    })
    const metadataHash = await IpfsService.pinJSONToIPFS(cfg, sampleMetadata, { name: 'GomGom Demo NFT #1 - Metadata', metadata: { type: 'nft_metadata', category: 'demo' } })
    return c.json({ success: true, metadata: sampleMetadata, metadataHash, tokenUri: `ipfs://${metadataHash}`, metadataUrl: IpfsService.getIPFSUrl(metadataHash) })
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500)
  }
})

// POST /api/demo/ipfs/create-sample-gallery
app.post('/ipfs/create-sample-gallery', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}))
    const count = Math.min(body.count ?? 3, 5)
    const cfg = ipfsCfg(c.env)
    const results = []
    for (let i = 1; i <= count; i++) {
      const metadata = IpfsService.createNFTMetadata({
        name: `GomGom Demo NFT #${i}`,
        description: `Demo NFT #${i} for GomGom.`,
        imageHash: `QmSampleImageHash${i}`,
        attributes: [
          { trait_type: 'Tier', value: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'][i - 1] || 'Bronze' },
          { trait_type: 'Loyalty Points', value: i * 250 },
          { trait_type: 'Rarity', value: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'][i - 1] || 'Common' },
        ],
      })
      const metadataHash = await IpfsService.pinJSONToIPFS(cfg, metadata, { name: `GomGom Demo NFT #${i} - Metadata`, metadata: { type: 'nft_metadata', category: 'demo' } })
      results.push({ id: i, metadata, metadataHash, tokenUri: `ipfs://${metadataHash}`, metadataUrl: IpfsService.getIPFSUrl(metadataHash) })
    }
    return c.json({ success: true, count: results.length, nfts: results })
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500)
  }
})

// GET /api/demo/ipfs/gallery
app.get('/ipfs/gallery', async (c) => {
  try {
    const pinataData = await IpfsService.getPinList(ipfsCfg(c.env), { status: 'pinned', pageLimit: 20, metadata: { category: 'demo' } })
    const gallery = pinataData.rows.map(item => ({ id: item.id, ipfsHash: item.ipfs_pin_hash, name: item.metadata.name, metadataUrl: IpfsService.getIPFSUrl(item.ipfs_pin_hash), datePinned: item.date_pinned, size: item.size, metadata: item.metadata.keyvalues }))
    return c.json({ success: true, total: pinataData.count, gallery })
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500)
  }
})

// POST /api/demo/ipfs/upload-sample-image
app.post('/ipfs/upload-sample-image', async (c) => {
  try {
    const cfg = ipfsCfg(c.env)
    const demoContent = `GomGom Demo NFT Image\nGenerated at: ${new Date().toISOString()}\nThis is a placeholder for demonstration purposes.`
    const encoder = new TextEncoder()
    const bytes = encoder.encode(demoContent).buffer as ArrayBuffer
    const imageHash = await IpfsService.pinBytesToIPFS(cfg, bytes, 'demo-image.txt', { name: 'GomGom Demo Image', metadata: { type: 'demo_image', category: 'sample' } })
    return c.json({ success: true, imageHash, imageUrl: IpfsService.getIPFSUrl(imageHash), message: 'Demo image uploaded to IPFS' })
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500)
  }
})

// POST /api/demo/ipfs/complete-workflow
app.post('/ipfs/complete-workflow', async (c) => {
  try {
    const cfg = ipfsCfg(c.env)
    const workflow: string[] = []
    workflow.push('Step 1: Creating demo image...')
    const imgContent = `GomGom Demo NFT Image\nCreated: ${new Date().toISOString()}`
    const imgBytes = new TextEncoder().encode(imgContent).buffer as ArrayBuffer
    const imageHash = await IpfsService.pinBytesToIPFS(cfg, imgBytes, 'workflow-demo.txt', { name: 'GomGom Workflow Demo Image', metadata: { type: 'demo_image', workflow: 'complete_demo' } })
    workflow.push(`✅ Image uploaded: ${imageHash}`)
    workflow.push('Step 2: Creating NFT metadata...')
    const metadata = IpfsService.createNFTMetadata({ name: 'GomGom Complete Workflow Demo NFT', description: 'Demonstrates the complete NFT workflow.', imageHash, attributes: [{ trait_type: 'Type', value: 'Workflow Demo' }, { trait_type: 'System', value: 'GomGom Loyalty' }] })
    const metadataHash = await IpfsService.pinJSONToIPFS(cfg, metadata, { name: 'GomGom Workflow Demo - Metadata', metadata: { type: 'nft_metadata', workflow: 'complete_demo' } })
    workflow.push(`✅ Metadata uploaded: ${metadataHash}`)
    const tokenUri = `ipfs://${metadataHash}`
    workflow.push(`✅ Token URI generated: ${tokenUri}`)
    return c.json({ success: true, workflow, result: { imageHash, metadataHash, tokenUri, imageUrl: IpfsService.getIPFSUrl(imageHash), metadataUrl: IpfsService.getIPFSUrl(metadataHash), metadata } })
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500)
  }
})

export default app
