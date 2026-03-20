import { Hono } from 'hono'
import type { Env } from '../types'
import { IpfsService } from '../services/ipfs'

const app = new Hono<{ Bindings: Env }>()

function ipfsCfg(env: Env) {
  return { apiKey: env.PINATA_API_KEY, secretApiKey: env.PINATA_SECRET_API_KEY }
}

// GET /api/ipfs/test
app.get('/test', async (c) => {
  try {
    const connected = await IpfsService.testConnection(ipfsCfg(c.env))
    return c.json({ success: connected, message: connected ? 'Pinata connection successful' : 'Pinata connection failed' }, connected ? 200 : 500)
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500)
  }
})

// POST /api/ipfs/upload-file  (accepts multipart/form-data)
app.post('/upload-file', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File | null
    if (!file) return c.json({ success: false, message: 'No file provided' }, 400)
    const name = (formData.get('name') as string | null) || file.name
    let metadata: Record<string, any> | undefined
    const metaStr = formData.get('metadata') as string | null
    if (metaStr) {
      try { metadata = JSON.parse(metaStr) } catch { return c.json({ success: false, message: 'Invalid metadata JSON' }, 400) }
    }
    const bytes = await file.arrayBuffer()
    const ipfsHash = await IpfsService.pinBytesToIPFS(ipfsCfg(c.env), bytes, file.name, { name, metadata })
    return c.json({ success: true, ipfsHash, ipfsUrl: IpfsService.getIPFSUrl(ipfsHash), message: 'File uploaded to IPFS successfully' })
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500)
  }
})

// POST /api/ipfs/upload-json
app.post('/upload-json', async (c) => {
  try {
    const { data, name, metadata } = await c.req.json()
    if (!data || typeof data !== 'object') return c.json({ success: false, message: 'Invalid or missing JSON data' }, 400)
    const ipfsHash = await IpfsService.pinJSONToIPFS(ipfsCfg(c.env), data, { name, metadata })
    return c.json({ success: true, ipfsHash, ipfsUrl: IpfsService.getIPFSUrl(ipfsHash), message: 'JSON uploaded to IPFS successfully' })
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500)
  }
})

// GET /api/ipfs/pins
app.get('/pins', async (c) => {
  try {
    const status = (c.req.query('status') || 'pinned') as 'pinned' | 'unpinned' | 'all'
    const pageLimit = parseInt(c.req.query('pageLimit') || '10')
    const pageOffset = parseInt(c.req.query('pageOffset') || '0')
    const pinList = await IpfsService.getPinList(ipfsCfg(c.env), { status, pageLimit, pageOffset })
    return c.json({ success: true, data: pinList, message: 'Pin list retrieved successfully' })
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500)
  }
})

// POST /api/ipfs/create-nft-metadata
app.post('/create-nft-metadata', async (c) => {
  try {
    const { name, description, imageHash, attributes, externalUrl } = await c.req.json()
    if (!name || !description || !imageHash) return c.json({ success: false, message: 'Name, description, and imageHash are required' }, 400)
    const metadata = IpfsService.createNFTMetadata({ name, description, imageHash, attributes, externalUrl })
    const metadataHash = await IpfsService.pinJSONToIPFS(ipfsCfg(c.env), metadata, { name: `${name} - Metadata`, metadata: { type: 'nft_metadata', nft_name: name } })
    return c.json({ success: true, metadata, metadataHash, tokenUri: `ipfs://${metadataHash}`, metadataUrl: IpfsService.getIPFSUrl(metadataHash), message: 'NFT metadata created and uploaded successfully' })
  } catch (error) {
    return c.json({ success: false, message: (error as Error).message }, 500)
  }
})

export default app
