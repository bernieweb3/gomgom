import { ethers } from 'ethers'

export const GOMGOM_REGISTRY_ABI = [
  "function isConfigured() view returns (bool)",
  "function isMinter(address account) view returns (bool)",
  "function isUpdater(address account) view returns (bool)",
  "function isStakingManager(address account) view returns (bool)",
  "function getGomGomNFTAddress() view returns (address)",
  "function getStakingPoolAddress() view returns (address)",
  "function grantRoleWithLog(bytes32 role, address account)",
  "function MINTER_ROLE() view returns (bytes32)",
  "function UPDATER_ROLE() view returns (bytes32)",
  "function STAKING_MANAGER_ROLE() view returns (bytes32)"
]

export const GOMGOM_NFT_ABI = [
  "function mint(address to) returns (uint256)",
  "function mintWithURI(address to, string memory _tokenURI) returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function totalSupply() view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function setTokenURI(uint256 tokenId, string memory uri)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
]

export const STAKING_POOL_ABI = [
  "function getStakedAmount(address user) view returns (uint256)",
  "function getUserStakingInfo(address user) view returns (tuple(uint256 totalETH, uint256 pendingRewards, uint256 lastStakeTime, bool hasActiveStake))",
  "function getGlobalStakingInfo() view returns (tuple(uint256 totalETH, uint256 totalNFTs, uint256 contractBalance))",
  "function stake() payable",
  "function unstake(uint256 amount)",
  "function claimRewards()",
  "function minimumStakeAmount() view returns (uint256)",
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount)"
]

export interface BlockchainConfig {
  rpcUrl: string
  adminPrivateKey: string
  contracts: {
    registry: string
    nft: string
    staking: string
  }
}

export class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider
  private signer: ethers.Wallet
  private registryContract: ethers.Contract
  private nftContract: ethers.Contract
  private stakingContract: ethers.Contract

  constructor(cfg: BlockchainConfig) {
    this.provider = new ethers.providers.JsonRpcProvider(cfg.rpcUrl)
    this.signer = new ethers.Wallet(cfg.adminPrivateKey, this.provider)
    this.registryContract = new ethers.Contract(cfg.contracts.registry, GOMGOM_REGISTRY_ABI, this.signer)
    this.nftContract = new ethers.Contract(cfg.contracts.nft, GOMGOM_NFT_ABI, this.signer)
    this.stakingContract = new ethers.Contract(cfg.contracts.staking, STAKING_POOL_ABI, this.signer)
  }

  async getSignerAddress(): Promise<string> {
    return this.signer.getAddress()
  }

  async getSignerBalance(): Promise<string> {
    const balance = await this.signer.getBalance()
    return ethers.utils.formatEther(balance)
  }

  async getTotalSupply(): Promise<number> {
    const totalSupply = await this.nftContract.totalSupply()
    return totalSupply.toNumber()
  }

  async userOwnsNFT(userAddress: string): Promise<boolean> {
    const balance = await this.nftContract.balanceOf(userAddress)
    return balance.gt(0)
  }

  async getUserTokenId(userAddress: string): Promise<number | null> {
    const balance = await this.nftContract.balanceOf(userAddress)
    if (balance.eq(0)) return null
    const tokenId = await this.nftContract.tokenOfOwnerByIndex(userAddress, 0)
    return tokenId.toNumber()
  }

  async mintNFTWithURI(userAddress: string, tokenURI: string): Promise<{ tokenId: number; transactionHash: string }> {
    const ownsNFT = await this.userOwnsNFT(userAddress)
    if (ownsNFT) throw new Error('User already owns an NFT')
    if (!tokenURI?.trim()) throw new Error('Token URI cannot be empty')
    const currentSupply = await this.nftContract.totalSupply()
    const expectedTokenId = currentSupply.toNumber() + 1
    const tx = await this.nftContract.mintWithURI(userAddress, tokenURI)
    const receipt = await tx.wait()
    const transferEvent = receipt.events?.find((e: any) => e.event === 'Transfer')
    const tokenId = transferEvent?.args?.tokenId?.toNumber() || expectedTokenId
    return { tokenId, transactionHash: receipt.transactionHash }
  }

  async updateTokenURI(tokenId: number, newURI: string): Promise<string> {
    const tx = await this.nftContract.setTokenURI(tokenId, newURI)
    const receipt = await tx.wait()
    return receipt.transactionHash
  }

  async getUserStakingInfo(userAddress: string): Promise<{ totalETH: string; pendingRewards: string; lastStakeTime: number; hasActiveStake: boolean }> {
    try {
      const info = await this.stakingContract.getUserStakingInfo(userAddress)
      return {
        totalETH: ethers.utils.formatEther(info.totalETH),
        pendingRewards: ethers.utils.formatEther(info.pendingRewards),
        lastStakeTime: info.lastStakeTime.toNumber(),
        hasActiveStake: info.hasActiveStake,
      }
    } catch {
      return { totalETH: '0', pendingRewards: '0', lastStakeTime: 0, hasActiveStake: false }
    }
  }

  async healthCheck(): Promise<{ status: string; blockNumber: number; signerAddress: string; signerBalance: string; contractsAccessible: boolean }> {
    const blockNumber = await this.provider.getBlockNumber()
    const signerAddress = await this.getSignerAddress()
    const signerBalance = await this.getSignerBalance()
    const registryConfigured = await this.registryContract.isConfigured()
    return { status: 'healthy', blockNumber, signerAddress, signerBalance, contractsAccessible: registryConfigured }
  }
}
