import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import type { Env } from './types'
import usersRoutes from './routes/users'
import nftsRoutes from './routes/nfts'
import actionsRoutes from './routes/actions'
import perksRoutes from './routes/perks'
import ipfsRoutes from './routes/ipfs'
import demoRoutes from './routes/demo'
import metadataRoutes from './routes/metadata'

const app = new Hono<{ Bindings: Env }>()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: (origin) => {
    const allowed = [
      'https://gomgom.pages.dev',
      'http://localhost:3000',
      'http://localhost:3001',
    ]
    if (!origin || allowed.some(o => origin.startsWith(o.replace('*', '')))) {
      return origin ?? '*'
    }
    return null
  },
  credentials: true,
}))

// Root
app.get('/', (c) => c.json({
  message: 'GomGom Loyalty System Backend API',
  version: '2.0.0',
  runtime: 'Cloudflare Workers + Hono',
  health: '/api/health'
}))

// Health
app.get('/api/health', (c) => c.json({
  status: 'OK',
  message: 'Backend is running on Cloudflare Workers',
  timestamp: new Date().toISOString(),
  version: '2.0.0'
}))

app.get('/api/health/database', async (c) => {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(c.env.NEON_DB_URL)
    const result = await sql`SELECT NOW() as current_time`
    return c.json({ status: 'healthy', timestamp: result[0].current_time, connection: true })
  } catch (error) {
    return c.json({ status: 'unhealthy', error: (error as Error).message }, 500)
  }
})

app.get('/api/health/blockchain', async (c) => {
  try {
    const { ethers } = await import('ethers')
    const provider = new ethers.providers.JsonRpcProvider(c.env.LISK_SEPOLIA_RPC_URL)
    const blockNumber = await provider.getBlockNumber()
    const signer = new ethers.Wallet(c.env.ADMIN_PRIVATE_KEY, provider)
    const signerAddress = await signer.getAddress()
    const balance = await signer.getBalance()
    return c.json({
      status: 'healthy',
      blockNumber,
      signerAddress,
      signerBalance: ethers.utils.formatEther(balance),
      contractsAccessible: true
    })
  } catch (error) {
    return c.json({ status: 'unhealthy', error: (error as Error).message }, 500)
  }
})

// API routes
app.route('/api/users', usersRoutes)
app.route('/api/nfts', nftsRoutes)
app.route('/api/actions', actionsRoutes)
app.route('/api/perks', perksRoutes)
app.route('/api/ipfs', ipfsRoutes)
app.route('/api/demo', demoRoutes)
app.route('/api/metadata', metadataRoutes)

// 404
app.notFound((c) => c.json({ status: 'error', message: 'Route not found', path: c.req.path }, 404))

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ status: 'error', message: 'Internal server error' }, 500)
})

export default app
