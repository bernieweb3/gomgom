const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // User Profile APIs
  async getUserProfile(address: string) {
    return this.request(`/user/profile/${address}`)
  }

  async getPointBalances(address: string) {
    return this.request(`/user/points/${address}`)
  }

  async getFlashPoints(address: string) {
    return this.request(`/user/flash-points/${address}`)
  }

  async getUserNFTs(address: string) {
    return this.request(`/user/nfts/${address}`)
  }

  async getCreditScore(address: string) {
    return this.request(`/user/credit-score/${address}`)
  }

  // Exchange APIs
  async getExchangePairs() {
    return this.request("/exchange/pairs")
  }

  async getExchangeRate(fromToken: string, toToken: string, amount: string) {
    return this.request(`/exchange/rate?from=${fromToken}&to=${toToken}&amount=${amount}`)
  }

  async executeSwap(data: any) {
    return this.request("/exchange/swap", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Voucher APIs
  async getVouchers(category?: string) {
    const query = category ? `?category=${category}` : ""
    return this.request(`/vouchers${query}`)
  }

  async redeemVoucher(voucherId: string, userAddress: string) {
    return this.request("/vouchers/redeem", {
      method: "POST",
      body: JSON.stringify({ voucherId, userAddress }),
    })
  }

  // Mission APIs
  async getMissions(address: string, status?: string) {
    const query = status ? `?status=${status}` : ""
    return this.request(`/missions/${address}${query}`)
  }

  async joinMission(missionId: string, userAddress: string) {
    return this.request("/missions/join", {
      method: "POST",
      body: JSON.stringify({ missionId, userAddress }),
    })
  }

  async claimMissionReward(missionId: string, userAddress: string) {
    return this.request("/missions/claim", {
      method: "POST",
      body: JSON.stringify({ missionId, userAddress }),
    })
  }

  // Credit APIs
  async getLoanPositions(address: string) {
    return this.request(`/credit/loans/${address}`)
  }

  async createLoan(data: any) {
    return this.request("/credit/loans", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async repayLoan(loanId: string, userAddress: string) {
    return this.request("/credit/loans/repay", {
      method: "POST",
      body: JSON.stringify({ loanId, userAddress }),
    })
  }

  // Transaction APIs
  async getTransactions(address: string, type?: string) {
    const query = type ? `?type=${type}` : ""
    return this.request(`/transactions/${address}${query}`)
  }
}

export const apiClient = new ApiClient()
