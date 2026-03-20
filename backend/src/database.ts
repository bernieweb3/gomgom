import { neon, NeonQueryFunction } from '@neondatabase/serverless'

/**
 * Get a Neon SQL client from the DB URL (Workers-compatible, no Pool).
 * Call this per-request; it's lightweight.
 */
export function getDb(dbUrl: string): NeonQueryFunction<false, false> {
  return neon(dbUrl)
}

export async function dbQuery(dbUrl: string, text: string, params?: unknown[]): Promise<{ rows: any[]; rowCount: number }> {
  const sql = getDb(dbUrl)
  // neon tagged-template doesn't support dynamic parameterised strings easily,
  // so we use the unsafe query method for parameterised queries.
  const result = await sql(text, params ?? [])
  return { rows: result as any[], rowCount: (result as any[]).length }
}

export async function dbHealthCheck(dbUrl: string): Promise<{ status: 'healthy' | 'unhealthy'; timestamp: string; details: any }> {
  try {
    const { rows } = await dbQuery(dbUrl, 'SELECT NOW() as current_time')
    return { status: 'healthy', timestamp: new Date().toISOString(), details: { connection: 'OK', time: rows[0]?.current_time } }
  } catch (error) {
    return { status: 'unhealthy', timestamp: new Date().toISOString(), details: { error: (error as Error).message } }
  }
}
