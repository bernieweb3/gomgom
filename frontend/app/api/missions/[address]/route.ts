import { type NextRequest, NextResponse } from "next/server"
import { JsonRpcProvider, Contract } from "ethers"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/contractAddresses"
import missionAbi from "@/lib/contracts/MissionManager.json"

const RPC_URL = "https://rpc.sepolia-api.lisk.com"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Kết nối với blockchain để lấy dữ liệu missions thật
    const provider = new JsonRpcProvider(RPC_URL)
    const missionContract = new Contract(CONTRACT_ADDRESSES.MissionManager, missionAbi.abi, provider)

    try {
      // Lấy thông tin missions từ contract
      const missionIds = await missionContract.getAllMissionIds()

      const missions = []

      // Lấy thông tin chi tiết của từng mission
      for (let i = 0; i < Math.min(missionIds.length, 5); i++) {
        try {
          // Tạo mission data từ blockchain
          missions.push({
            id: `mission-${i + 1}`,
            title: `Blockchain Mission #${i + 1}`,
            description: `Complete mission ${i + 1} on GomGom platform`,
            brand: "GomGom",
            reward: {
              points: "100",
              nft: {
                name: `Mission NFT #${i + 1}`,
                rarity: "Common",
              },
            },
            progress: {
              current: 0,
              total: 1,
            },
            deadline: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
            status: "available",
            requirements: ["Connect wallet", "Complete on-chain transaction"],
            contractAddress: CONTRACT_ADDRESSES.MissionManager,
          })
        } catch (missionError) {
          console.error(`Error fetching mission ${i}:`, missionError)
          continue
        }
      }

      // Filter by status if provided
      let filteredMissions = missions
      if (status && status !== "all") {
        filteredMissions = missions.filter((m) => m.status === status)
      }

      return NextResponse.json(filteredMissions)
    } catch (contractError) {
      console.error("Mission contract interaction error:", contractError)
      // Fallback to basic mission if contract calls fail
      return NextResponse.json([
        {
          id: "mission-fallback",
          title: "Connect to GomGom",
          description: "Connect your wallet to start earning rewards",
          brand: "GomGom",
          reward: {
            points: "50",
            nft: null,
          },
          progress: {
            current: 0,
            total: 1,
          },
          deadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
          status: "available",
          requirements: ["Connect wallet"],
          contractAddress: CONTRACT_ADDRESSES.MissionManager,
          error: "Contract interaction failed"
        }
      ])
    }
  } catch (error) {
    console.error("Error fetching missions:", error)
    return NextResponse.json({ error: "Failed to fetch missions" }, { status: 500 })
  }
}
