import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params

    // TODO: Query smart contracts for flash points
    const mockFlashPoints = [
      {
        id: "flash-1",
        brand: "McDonald's",
        amount: "500",
        expiresAt: Date.now() + 2 * 60 * 60 * 1000, // 2 hours from now
        contractAddress: "0x4567890123456789012345678901234567890123",
      },
      {
        id: "flash-2",
        brand: "KFC",
        amount: "300",
        expiresAt: Date.now() + 45 * 60 * 1000, // 45 minutes from now
        contractAddress: "0x5678901234567890123456789012345678901234",
      },
    ]

    return NextResponse.json(mockFlashPoints)
  } catch (error) {
    console.error("Error fetching flash points:", error)
    return NextResponse.json({ error: "Failed to fetch flash points" }, { status: 500 })
  }
}
