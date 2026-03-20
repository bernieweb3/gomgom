import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

// Kết nối tới Neon.tech (PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Đặt biến môi trường DATABASE_URL
  ssl: { rejectUnauthorized: false },
})

// Lấy danh sách đối tác
export async function GET() {
  try {
    const result = await pool.query("SELECT id, name, contact_info, created_at FROM partners ORDER BY created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching partners:", error)
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 })
  }
}

// Thêm mới đối tác
export async function POST(request: NextRequest) {
  try {
    const { name, contact_info } = await request.json()
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    const result = await pool.query(
      "INSERT INTO partners (name, contact_info) VALUES ($1, $2) RETURNING *",
      [name, contact_info || null]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error creating partner:", error)
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 })
  }
}
