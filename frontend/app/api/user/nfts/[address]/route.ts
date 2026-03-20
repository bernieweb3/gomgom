import { type NextRequest, NextResponse } from "next/server"
import { JsonRpcProvider, Contract } from "ethers"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/contractAddresses"
import nftAbi from "@/lib/contracts/GomGomNFTSimple.json"

const RPC_URL = "https://rpc.sepolia-api.lisk.com"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params

    // Kết nối với blockchain để lấy dữ liệu NFT thật
    const provider = new JsonRpcProvider(RPC_URL)
    const nftContract = new Contract(CONTRACT_ADDRESSES.GomGomNFTSimple, nftAbi.abi, provider)

    try {
      // Lấy thông tin NFT của user
      const [balance, name, symbol] = await Promise.all([
        nftContract.balanceOf(address),
        nftContract.name(),
        nftContract.symbol()
      ])

      const nfts = []

      // Nếu user có NFTs, lấy thông tin chi tiết
      if (balance > 0) {
        // Lấy current token ID để biết range
        const currentTokenId = await nftContract.getCurrentTokenId()

        // Kiểm tra từng token ID để tìm NFTs của user
        for (let i = 1; i <= Math.min(Number(currentTokenId), 10); i++) {
          try {
            const owner = await nftContract.ownerOf(i)
            if (owner.toLowerCase() === address.toLowerCase()) {
              const [tokenURI, brandWallet] = await Promise.all([
                nftContract.tokenURI(i),
                nftContract.getTokenBrand(i)
              ])

              nfts.push({
                id: `nft-${i}`,
                name: `${name} #${i}`,
                brand: "GomGom",
                rarity: "Common",
                tokenId: i.toString(),
                contractAddress: CONTRACT_ADDRESSES.GomGomNFTSimple,
                tokenURI,
                brandWallet
              })
            }
          } catch (tokenError) {
            // Token không tồn tại hoặc lỗi khác, bỏ qua
            continue
          }
        }
      }

      return NextResponse.json(nfts)
    } catch (contractError) {
      console.error("NFT contract interaction error:", contractError)
      // Fallback to empty array if contract calls fail
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Error fetching NFTs:", error)
    return NextResponse.json({ error: "Failed to fetch NFTs" }, { status: 500 })
  }
}
