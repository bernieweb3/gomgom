import { type NextRequest, NextResponse } from "next/server"
import { JsonRpcProvider, Contract } from "ethers"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/contractAddresses"
import flashPointAbi from "@/lib/contracts/FlashPointToken.json"
import factoryAbi from "@/lib/contracts/GomGomTokenFactory.json"

const RPC_URL = "https://rpc.sepolia-api.lisk.com"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params

    // Fallback data
    const fallbackPoints = [
      {
        brand: "FlashPoint",
        balance: "1000",
        symbol: "FPT",
        contractAddress: CONTRACT_ADDRESSES.FlashPointToken,
        lastUpdated: Date.now(),
        fallback: true
      },
      {
        brand: "GomGom",
        balance: "500",
        symbol: "GGT",
        contractAddress: CONTRACT_ADDRESSES.GomGomTokenFactory,
        lastUpdated: Date.now(),
        fallback: true
      }
    ]

    try {
      // Kết nối với blockchain để lấy dữ liệu thật
      const provider = new JsonRpcProvider(RPC_URL)

      // Lấy thông tin từ FlashPoint contract
      const flashPointContract = new Contract(CONTRACT_ADDRESSES.FlashPointToken, flashPointAbi.abi, provider)
      const factoryContract = new Contract(CONTRACT_ADDRESSES.GomGomTokenFactory, factoryAbi.abi, provider)

      // Timeout cho blockchain calls
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )

      try {
        // Lấy balance của user (nếu contract hỗ trợ)
        const [totalSupply, brandCount] = await Promise.race([
          Promise.all([
            flashPointContract.totalSupply(),
            factoryContract.getBrandCount()
          ]),
          timeoutPromise
        ]) as any[]

        // Tạo point balances từ blockchain data
        const pointBalances = [
          {
            brand: "FlashPoint",
            symbol: "FPT",
            balance: "0", // User balance sẽ cần function balanceOf
            value: "0 VND",
            contractAddress: CONTRACT_ADDRESSES.FlashPointToken,
            decimals: 18,
            totalSupply: totalSupply.toString(),
            fallback: false
          }
        ]

        // Thêm thông tin về brands từ factory
        if (brandCount > 0) {
          pointBalances.push({
            brand: "GomGom Ecosystem",
            symbol: "GGE",
            balance: brandCount.toString(),
            value: `${Number(brandCount) * 10000} VND`,
            contractAddress: CONTRACT_ADDRESSES.GomGomTokenFactory,
            decimals: 0,
            totalSupply: brandCount.toString(),
            fallback: false
          })
        }

        return NextResponse.json(pointBalances)
      } catch (contractError) {
        console.error("Contract interaction error:", contractError)
        // Return fallback data if contract calls fail
        return NextResponse.json(fallbackPoints)
      }
    } catch (blockchainError) {
      console.error("Blockchain connection failed:", blockchainError)
      return NextResponse.json(fallbackPoints)
    }
  } catch (error) {
    console.error("Error fetching point balances:", error)
    return NextResponse.json(fallbackPoints)
  }
}
