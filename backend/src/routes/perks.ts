import { Hono } from 'hono'
import type { Env } from '../types'
import { DatabaseService } from '../services/database'

const app = new Hono<{ Bindings: Env }>()

// GET /api/perks/user/:walletAddress
app.get('/user/:walletAddress', async (c) => {
  try {
    const { walletAddress } = c.req.param()
    if (!walletAddress) return c.json({ status: 'error', message: 'Wallet address is required' }, 400)
    const db = new DatabaseService(c.env.NEON_DB_URL)
    const perks = await db.getUserPerks(walletAddress)
    return c.json({ status: 'success', data: perks })
  } catch (error) {
    return c.json({ status: 'error', message: (error as Error).message }, 500)
  }
})

// GET /api/perks/all
app.get('/all', async (c) => {
  try {
    const db = new DatabaseService(c.env.NEON_DB_URL)
    const result = await db.executeQuery(`SELECT p.*, bp.brand_name, bp.brand_color FROM perks p JOIN brand_partners bp ON p.brand_id = bp.brand_id WHERE p.is_active = true ORDER BY bp.brand_name, p.perk_name`)
    return c.json({ status: 'success', data: result.rows })
  } catch (error) {
    return c.json({ status: 'error', message: (error as Error).message }, 500)
  }
})

// GET /api/perks/brand/:brandId
app.get('/brand/:brandId', async (c) => {
  try {
    const brandId = parseInt(c.req.param('brandId'))
    if (isNaN(brandId)) return c.json({ status: 'error', message: 'Valid brand ID is required' }, 400)
    const db = new DatabaseService(c.env.NEON_DB_URL)
    const result = await db.executeQuery(`SELECT p.*, bp.brand_name, bp.brand_color FROM perks p JOIN brand_partners bp ON p.brand_id = bp.brand_id WHERE p.brand_id = $1 AND p.is_active = true ORDER BY p.perk_name`, [brandId])
    return c.json({ status: 'success', data: result.rows })
  } catch (error) {
    return c.json({ status: 'error', message: (error as Error).message }, 500)
  }
})

export default app
