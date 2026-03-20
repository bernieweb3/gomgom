import { Hono } from 'hono'
import type { Env } from '../types'
import { DatabaseService } from '../services/database'

const app = new Hono<{ Bindings: Env }>()

// POST /api/users/init
app.post('/init', async (c) => {
  try {
    const { walletAddress } = await c.req.json()
    if (!walletAddress) return c.json({ status: 'error', message: 'Wallet address is required' }, 400)
    const db = new DatabaseService(c.env.NEON_DB_URL)
    const result = await db.initUser(walletAddress)
    return c.json(result)
  } catch (error) {
    return c.json({ status: 'error', message: (error as Error).message }, 500)
  }
})

export default app
