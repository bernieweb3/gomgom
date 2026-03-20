"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { apiClient } from "@/lib/api"
import type { BrandVoucher, VoucherCategory } from "@/types/voucher"
import { toast } from "@/hooks/use-toast"

export function useVouchers() {
  const { address, isConnected } = useAccount()
  const [vouchers, setVouchers] = useState<BrandVoucher[]>([])
  const [categories, setCategories] = useState<VoucherCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    if (isConnected && address) {
      loadVouchers()
    }
  }, [isConnected, address, selectedCategory])

  const loadVouchers = async () => {
    setIsLoading(true)
    try {
      const vouchersData = await apiClient.getVouchers(selectedCategory)
      setVouchers(vouchersData)

      // Calculate category counts
      const categoryCounts = vouchersData.reduce((acc: any, voucher: BrandVoucher) => {
        acc[voucher.category] = (acc[voucher.category] || 0) + 1
        return acc
      }, {})

      setCategories([
        { id: "all", name: "Tất cả", icon: "🏪", count: vouchersData.length },
        { id: "food", name: "Ăn uống", icon: "🍕", count: categoryCounts.food || 0 },
        { id: "shopping", name: "Mua sắm", icon: "🛍️", count: categoryCounts.shopping || 0 },
        { id: "entertainment", name: "Giải trí", icon: "🎬", count: categoryCounts.entertainment || 0 },
        { id: "travel", name: "Du lịch", icon: "✈️", count: categoryCounts.travel || 0 },
        { id: "services", name: "Dịch vụ", icon: "🔧", count: categoryCounts.services || 0 },
      ])
    } catch (error) {
      console.error("Error loading vouchers:", error)
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải danh sách voucher. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const redeemVoucher = async (voucher: BrandVoucher) => {
    if (!address) return

    try {
      await apiClient.redeemVoucher(voucher.id, address)
      toast({
        title: "Đổi voucher thành công",
        description: `Bạn đã đổi thành công ${voucher.title} từ ${voucher.brand}.`,
      })
      await loadVouchers()
    } catch (error) {
      console.error("Redeem error:", error)
      toast({
        title: "Lỗi đổi voucher",
        description: "Không thể đổi voucher. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  const filteredVouchers =
    selectedCategory === "all" ? vouchers : vouchers.filter((voucher) => voucher.category === selectedCategory)

  return {
    vouchers: filteredVouchers,
    categories,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    redeemVoucher,
    loadVouchers,
  }
}
