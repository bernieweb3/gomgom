import { type NextRequest, NextResponse } from "next/server"
import { JsonRpcProvider } from "ethers"

const RPC_URL = "https://rpc.sepolia-api.lisk.com"

export async function GET(request: NextRequest) {
  try {
    // Test RPC connection
    const provider = new JsonRpcProvider(RPC_URL)
    
    // Get basic network info
    const [network, blockNumber] = await Promise.all([
      provider.getNetwork(),
      provider.getBlockNumber()
    ])

    return NextResponse.json({
      success: true,
      network: {
        name: network.name,
        chainId: network.chainId.toString(),
        blockNumber: blockNumber.toString()
      },
      rpcUrl: RPC_URL
    })
  } catch (error) {
    console.error("RPC test error:", error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      rpcUrl: RPC_URL
    }, { status: 500 })
  }
}
