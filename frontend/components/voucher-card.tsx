"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink, ShoppingBag, Utensils, Music, Plane, Wrench } from "lucide-react"
import type { BrandVoucher } from "@/types/voucher"

interface VoucherCardProps {
  voucher: BrandVoucher
  onRedeem: (voucher: BrandVoucher) => void
}

export function VoucherCard({ voucher, onRedeem }: VoucherCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return <Utensils className="w-4 h-4" />
      case "shopping":
        return <ShoppingBag className="w-4 h-4" />
      case "entertainment":
        return <Music className="w-4 h-4" />
      case "travel":
        return <Plane className="w-4 h-4" />
      case "services":
        return <Wrench className="w-4 h-4" />
      default:
        return <ShoppingBag className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "food":
        return "bg-orange-100 text-orange-800"
      case "shopping":
        return "bg-blue-100 text-blue-800"
      case "entertainment":
        return "bg-purple-100 text-purple-800"
      case "travel":
        return "bg-green-100 text-green-800"
      case "services":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="rounded-2xl border border-gray-200 hover:shadow-xl transition-all hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">{voucher.brand.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{voucher.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{voucher.brand}</p>
            <Badge className={`text-xs ${getCategoryColor(voucher.category)}`}>
              {getCategoryIcon(voucher.category)}
              <span className="ml-1 capitalize">{voucher.category}</span>
            </Badge>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{voucher.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Cần:</span>
            <span className="font-bold text-green-600">{voucher.pointsRequired} điểm</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Giá trị:</span>
            <div className="text-right">
              <span className="font-bold text-gray-900">{voucher.originalValue}</span>
              {voucher.discountPercent && (
                <span className="text-xs text-green-600 ml-2">(-{voucher.discountPercent}%)</span>
              )}
            </div>
          </div>
          {voucher.stock && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Còn lại:</span>
              <span className="text-sm font-medium text-orange-600">{voucher.stock} voucher</span>
            </div>
          )}
          {voucher.expiryDate && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hết hạn:</span>
              <span className="text-sm text-red-600 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 rounded-xl"
            disabled={!voucher.available}
            onClick={() => onRedeem(voucher)}
          >
            {voucher.available ? "Đổi voucher" : "Hết hàng"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs bg-transparent"
            onClick={() => window.open(`https://liskscan.com/address/${voucher.contractAddress}`, "_blank")}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Xem smart contract
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
