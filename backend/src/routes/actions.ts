import { Hono } from 'hono'
import type { Env } from '../types'
import { DatabaseService } from '../services/database'

const app = new Hono<{ Bindings: Env }>()

const VALID_ACTION_TYPES = [
  'vietjet_flight_booking',
  'hdbank_transaction',
  'dragon_city_visit',
  'hd_saison_purchase',
  'ha_long_star_booking',
]

// POST /api/actions/simulate
app.post('/simulate', async (c) => {
  try {
    const { walletAddress, actionType, details } = await c.req.json()
    if (!walletAddress || !actionType || !details) {
      return c.json({ status: 'error', message: 'Wallet address, action type, and details are required' }, 400)
    }
    if (!VALID_ACTION_TYPES.includes(actionType)) {
      return c.json({ status: 'error', message: `Invalid action type. Valid types: ${VALID_ACTION_TYPES.join(', ')}` }, 400)
    }
    const db = new DatabaseService(c.env.NEON_DB_URL)
    const user = await db.getUserByAddress(walletAddress)
    if (!user) return c.json({ status: 'error', message: 'User not found. Please initialize user first.' }, 404)
    const result = await db.processUserAction(walletAddress, actionType, details)
    return c.json({ ...result, actionType, details })
  } catch (error) {
    return c.json({ status: 'error', message: (error as Error).message }, 500)
  }
})

// GET /api/actions/history/:walletAddress
app.get('/history/:walletAddress', async (c) => {
  try {
    const { walletAddress } = c.req.param()
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')
    if (!walletAddress) return c.json({ status: 'error', message: 'Wallet address is required' }, 400)
    const db = new DatabaseService(c.env.NEON_DB_URL)
    const result = await db.executeQuery(
      `SELECT action_id, action_type, details, points_earned, created_at FROM user_actions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [walletAddress.toLowerCase(), limit, offset]
    )
    return c.json({ status: 'success', data: result.rows, pagination: { limit, offset, total: result.rows.length } })
  } catch (error) {
    return c.json({ status: 'error', message: (error as Error).message }, 500)
  }
})

export default app
