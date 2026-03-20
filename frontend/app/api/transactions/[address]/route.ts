import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    // TODO: Query blockchain for actual transactions
    const mockTransactions = [
      {
        id: "tx-1",
        type: "earn",
        amount: "250",
        token: "STAR",
        brand: "Starbucks",
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        status: "completed",
        txHash: "0xabcd1234567890abcd1234567890abcd12345678",
        gasUsed: "0.001",
      },
      {
        id: "tx-2",
        type: "spend",
        amount: "500",
        token: "GRAB",
        brand: "Grab",
        timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
        status: "completed",
        txHash: "0xefgh5678901234efgh5678901234efgh56789012",
        gasUsed: "0.002",
      },
      {
        id: "tx-3",
        type: "swap",
        amount: "1000",
        token: "STAR → USDT",
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        status: "completed",
        txHash: "0xijkl9012345678ijkl9012345678ijkl90123456",
        gasUsed: "0.003",
      },
      {
        id: "tx-4",
        type: "reward",
        amount: "750",
        token: "CK",
        brand: "Mission Reward",
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        status: "completed",
        txHash: "0xmnop3456789012mnop3456789012mnop34567890",
        gasUsed: "0.001",
      },
      {
        id: "tx-5",
        type: "loan",
        amount: "500",
        token: "USDT",
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        status: "completed",
        txHash: "0xqrst7890123456qrst7890123456qrst78901234",
        gasUsed: "0.004",
      },
    ]

    let filteredTransactions = mockTransactions
    if (type && type !== "all") {
      filteredTransactions = mockTransactions.filter((tx) => tx.type === type)
    }

    return NextResponse.json(filteredTransactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
