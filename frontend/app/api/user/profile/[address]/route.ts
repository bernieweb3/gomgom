import { type NextRequest, NextResponse } from "next/server"
import { JsonRpcProvider, Contract } from "ethers"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/contractAddresses"
import flashPointAbi from "@/lib/contracts/FlashPointToken.json"
import factoryAbi from "@/lib/contracts/GomGomTokenFactory.json"

const RPC_URL = "https://rpc.sepolia-api.lisk.com"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params

    // Tạo fallback profile data trước
    const fallbackProfile = {
      address,
      totalValue: "0",
      lastUpdated: Date.now(),
      onChainData: {
        flashPointTotalSupply: "1000000",
        brandCount: "1"
      },
      fallback: true
    }

    try {
      // Thử kết nối với blockchain để lấy dữ liệu thật
      const provider = new JsonRpcProvider(RPC_URL)

      // Lấy thông tin từ các contracts với timeout
      const flashPointContract = new Contract(CONTRACT_ADDRESSES.FlashPointToken, flashPointAbi.abi, provider)
      const factoryContract = new Contract(CONTRACT_ADDRESSES.GomGomTokenFactory, factoryAbi.abi, provider)

      // Lấy total supply và brand count với timeout 5s
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )

      const [totalSupply, brandCount] = await Promise.race([
        Promise.all([
          flashPointContract.totalSupply(),
          factoryContract.getBrandCount()
        ]),
        timeoutPromise
      ]) as any[]

      // Tạo profile data từ blockchain
      const profile = {
        address,
        totalValue: "0",
        lastUpdated: Date.now(),
        onChainData: {
          flashPointTotalSupply: totalSupply.toString(),
          brandCount: brandCount.toString()
        },
        fallback: false
      }

      return NextResponse.json(profile)
    } catch (blockchainError) {
      console.error("Blockchain connection failed, using fallback:", blockchainError)
      // Return fallback data if blockchain fails
      return NextResponse.json(fallbackProfile)
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    // Return fallback data even for general errors
    const fallbackProfile = {
      address: params?.address || "unknown",
      totalValue: "0",
      lastUpdated: Date.now(),
      onChainData: {
        flashPointTotalSupply: "1000000",
        brandCount: "1"
      },
      fallback: true,
      error: "Service temporarily unavailable"
    }
    return NextResponse.json(fallbackProfile)
  }
}
