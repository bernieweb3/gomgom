"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { apiClient } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export function useUserProfile() {
  const { address, isConnected } = useAccount()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected && address) {
      loadProfile()
    }
  }, [isConnected, address])

  const loadProfile = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      // Load data with fallback handling
      const [profileData, pointsData, flashPointsData, nftsData, creditData] = await Promise.allSettled([
        apiClient.getUserProfile(address),
        apiClient.getPointBalances(address),
        apiClient.getFlashPoints(address),
        apiClient.getUserNFTs(address),
        apiClient.getCreditScore(address),
      ])

      // Extract data from settled promises, use fallback if failed
      const profile = profileData.status === 'fulfilled' ? profileData.value : {
        address,
        totalValue: "0",
        lastUpdated: Date.now(),
        fallback: true
      }

      const points = pointsData.status === 'fulfilled' ? pointsData.value : []
      const flashPoints = flashPointsData.status === 'fulfilled' ? flashPointsData.value : { balance: "0", fallback: true }
      const nfts = nftsData.status === 'fulfilled' ? nftsData.value : []
      const credit = creditData.status === 'fulfilled' ? creditData.value : { score: 0, fallback: true }

      setProfile({
        ...profile,
        pointBalances: points,
        flashPoints: flashPoints,
        nfts: nfts,
        creditScore: credit.score || 0,
        maxLoanAmount: credit.maxLoanAmount || "0",
      })

      // Show warning if using fallback data
      if (profile.fallback || flashPoints.fallback || credit.fallback) {
        toast({
          title: "Dữ liệu tạm thời",
          description: "Đang sử dụng dữ liệu mẫu do kết nối blockchain chậm.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      // Set fallback profile even on error
      setProfile({
        address,
        totalValue: "0",
        lastUpdated: Date.now(),
        pointBalances: [],
        flashPoints: { balance: "0", fallback: true },
        nfts: [],
        creditScore: 0,
        maxLoanAmount: "0",
        fallback: true
      })

      toast({
        title: "Dữ liệu tạm thời",
        description: "Đang hiển thị dữ liệu mẫu. Vui lòng thử lại sau.",
        variant: "default",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { profile, isLoading, loadProfile }
}

export function useExchange() {
  const [pairs, setPairs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPairs()
  }, [])

  const loadPairs = async () => {
    setIsLoading(true)
    try {
      const pairsData = await apiClient.getExchangePairs()
      setPairs(pairsData)
    } catch (error) {
      console.error("Error loading exchange pairs:", error)
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải thông tin trao đổi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const executeSwap = async (swapData: any) => {
    try {
      const result = await apiClient.executeSwap(swapData)
      toast({
        title: "Giao dịch thành công",
        description: "Hoán đổi đã được thực hiện thành công.",
      })
      return result
    } catch (error) {
      console.error("Error executing swap:", error)
      toast({
        title: "Lỗi giao dịch",
        description: "Không thể thực hiện hoán đổi.",
        variant: "destructive",
      })
      throw error
    }
  }

  return { pairs, isLoading, executeSwap, loadPairs }
}

export function useMissions() {
  const { address, isConnected } = useAccount()
  const [missions, setMissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected && address) {
      loadMissions()
    }
  }, [isConnected, address])

  const loadMissions = async (status?: string) => {
    if (!address) return

    setIsLoading(true)
    try {
      const missionsData = await apiClient.getMissions(address, status)
      setMissions(missionsData)
    } catch (error) {
      console.error("Error loading missions:", error)
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải danh sách nhiệm vụ.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const joinMission = async (missionId: string) => {
    if (!address) return

    try {
      await apiClient.joinMission(missionId, address)
      toast({
        title: "Tham gia thành công",
        description: "Bạn đã tham gia nhiệm vụ thành công.",
      })
      await loadMissions()
    } catch (error) {
      console.error("Error joining mission:", error)
      toast({
        title: "Lỗi tham gia",
        description: "Không thể tham gia nhiệm vụ.",
        variant: "destructive",
      })
    }
  }

  const claimReward = async (missionId: string) => {
    if (!address) return

    try {
      await apiClient.claimMissionReward(missionId, address)
      toast({
        title: "Nhận thưởng thành công",
        description: "Phần thưởng đã được chuyển vào ví của bạn.",
      })
      await loadMissions()
    } catch (error) {
      console.error("Error claiming reward:", error)
      toast({
        title: "Lỗi nhận thưởng",
        description: "Không thể nhận thưởng.",
        variant: "destructive",
      })
    }
  }

  return { missions, isLoading, loadMissions, joinMission, claimReward }
}

export function useTransactions() {
  const { address, isConnected } = useAccount()
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected && address) {
      loadTransactions()
    }
  }, [isConnected, address])

  const loadTransactions = async (type?: string) => {
    if (!address) return

    setIsLoading(true)
    try {
      const transactionsData = await apiClient.getTransactions(address, type)
      setTransactions(transactionsData)
    } catch (error) {
      console.error("Error loading transactions:", error)
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải lịch sử giao dịch.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { transactions, isLoading, loadTransactions }
}
