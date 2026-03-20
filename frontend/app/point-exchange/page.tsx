"use client"

import { useState, useEffect } from "react"
import { useAccount, useBalance } from "wagmi"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpDown, Sparkles, Star, AlertCircle } from "lucide-react"
import { WalletConnect } from "@/components/wallet-connect"
import { toast } from "@/hooks/use-toast"
import { VoucherCard } from "@/components/voucher-card"
import { useVouchers } from "@/hooks/use-vouchers"
import { Badge } from "@/components/ui/badge"

interface TokenPair {
  fromToken: string
  toToken: string
  rate: number
  liquidity: string
  fee: string
}

interface PersonalizedReward {
  id: string
  title: string
  brand: string
  pointsRequired: string
  tokenRequired: string
  reason: string
  urgent: boolean
  available: boolean
  contractAddress: string
}

export default function PointExchangePage() {
  const { address, isConnected } = useAccount()
  const { data: ethBalance } = useBalance({ address })

  const [fromAmount, setFromAmount] = useState("")
  const [fromToken, setFromToken] = useState("")
  const [toToken, setToToken] = useState("")
  const [exchangeRate, setExchangeRate] = useState<number>(0)
  const [isSwapping, setIsSwapping] = useState(false)
  const [availablePairs, setAvailablePairs] = useState<TokenPair[]>([])
  const [personalizedRewards, setPersonalizedRewards] = useState<PersonalizedReward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [gasEstimate, setGasEstimate] = useState<string>("0")

  const {
    vouchers,
    categories,
    isLoading: vouchersLoading,
    selectedCategory,
    setSelectedCategory,
    redeemVoucher,
  } = useVouchers()

  useEffect(() => {
    if (isConnected && address) {
      loadExchangeData()
    }
  }, [isConnected, address])

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      calculateExchangeRate()
    }
  }, [fromToken, toToken, fromAmount])

  const loadExchangeData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([loadAvailablePairs(), loadPersonalizedRewards()])
    } catch (error) {
      console.error("Error loading exchange data:", error)
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải thông tin trao đổi. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadAvailablePairs = async () => {
    // TODO: Load available trading pairs from DEX contract
    setAvailablePairs([])
  }

  const loadPersonalizedRewards = async () => {
    // TODO: Load personalized rewards from API/contract
    setPersonalizedRewards([])
  }

  const calculateExchangeRate = async () => {
    if (!fromToken || !toToken || !fromAmount) return

    try {
      // TODO: Get real exchange rate from DEX contract
      setExchangeRate(0)
      setGasEstimate("0.001")
    } catch (error) {
      console.error("Error calculating exchange rate:", error)
      setExchangeRate(0)
    }
  }

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !exchangeRate) {
      toast({
        title: "Thông tin không đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin để thực hiện hoán đổi.",
        variant: "destructive",
      })
      return
    }

    setIsSwapping(true)
    try {
      // TODO: Execute swap transaction
      toast({
        title: "Giao dịch đang xử lý",
        description: "Hoán đổi điểm đang được thực hiện trên blockchain.",
      })

      // Reset form after successful swap
      setFromAmount("")
      setFromToken("")
      setToToken("")
      setExchangeRate(0)
    } catch (error) {
      console.error("Swap error:", error)
      toast({
        title: "Lỗi hoán đổi",
        description: "Không thể thực hiện hoán đổi. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSwapping(false)
    }
  }

  const handleRedeemReward = async (reward: PersonalizedReward) => {
    if (!reward.available) {
      toast({
        title: "Phần thưởng không khả dụng",
        description: "Phần thưởng này hiện không khả dụng.",
        variant: "destructive",
      })
      return
    }

    try {
      // TODO: Execute reward redemption
      toast({
        title: "Đang đổi thưởng",
        description: `Đang thực hiện đổi ${reward.title} từ ${reward.brand}.`,
      })
    } catch (error) {
      console.error("Redeem error:", error)
      toast({
        title: "Lỗi đổi thưởng",
        description: "Không thể đổi thưởng. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <ArrowUpDown className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Kết nối ví để trao đổi</h1>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Vui lòng kết nối ví Web3 để sử dụng tính năng trao đổi điểm
                </p>
                <WalletConnect />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const toAmount = fromAmount && exchangeRate ? (Number.parseFloat(fromAmount) * exchangeRate).toFixed(2) : ""

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">Trao đổi Điểm</h1>
            <p className="text-xl text-gray-600">Hoán đổi điểm thưởng và khám phá phần thưởng cá nhân hóa</p>
          </div>

          <Tabs defaultValue="stablecoin" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-white rounded-2xl p-2 shadow-lg">
              <TabsTrigger value="stablecoin" className="flex items-center space-x-2 rounded-xl">
                <ArrowUpDown className="w-4 h-4" />
                <span>Đổi Stablecoin</span>
              </TabsTrigger>
              <TabsTrigger value="vouchers" className="flex items-center space-x-2 rounded-xl">
                <Sparkles className="w-4 h-4" />
                <span>Đổi Voucher</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stablecoin">
              <div className="max-w-2xl mx-auto">
                <Card className="rounded-3xl shadow-2xl border-0">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center text-gray-900 text-2xl">
                      <ArrowUpDown className="w-7 h-7 mr-3 text-green-600" />
                      Đổi điểm sang Stablecoin
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* From Token */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">Bạn muốn đổi</label>
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            className="text-xl h-14 rounded-2xl border-2 border-gray-200 focus:border-green-500"
                          />
                        </div>
                        <Select value={fromToken} onValueChange={setFromToken}>
                          <SelectTrigger className="w-48 h-14 rounded-2xl border-2 border-gray-200">
                            <SelectValue placeholder="Chọn token" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoading ? (
                              <div className="p-4">
                                <Skeleton className="h-4 w-32" />
                              </div>
                            ) : availablePairs.length > 0 ? (
                              availablePairs.map((pair, index) => (
                                <SelectItem key={index} value={pair.fromToken}>
                                  {pair.fromToken}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500">Không có token khả dụng</div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      {fromToken && (
                        <div className="text-sm text-gray-600">
                          Số dư: {ethBalance ? Number.parseFloat(ethBalance.formatted).toFixed(4) : "0"} ETH
                        </div>
                      )}
                    </div>

                    {/* Swap Icon */}
                    <div className="flex justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full w-12 h-12 p-0 border-2 border-green-200 hover:bg-green-50 bg-white shadow-lg"
                        onClick={() => {
                          const temp = fromToken
                          setFromToken(toToken)
                          setToToken(temp)
                        }}
                      >
                        <ArrowUpDown className="w-5 h-5 text-green-600" />
                      </Button>
                    </div>

                    {/* To Token */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">Bạn muốn nhận</label>
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={toAmount}
                            readOnly
                            className="text-xl h-14 rounded-2xl bg-gray-50 border-2 border-gray-200"
                          />
                        </div>
                        <Select value={toToken} onValueChange={setToToken}>
                          <SelectTrigger className="w-48 h-14 rounded-2xl border-2 border-gray-200">
                            <SelectValue placeholder="Chọn token" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoading ? (
                              <div className="p-4">
                                <Skeleton className="h-4 w-32" />
                              </div>
                            ) : availablePairs.length > 0 ? (
                              availablePairs.map((pair, index) => (
                                <SelectItem key={index} value={pair.toToken}>
                                  {pair.toToken}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500">Không có token khả dụng</div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Exchange Rate Info */}
                    {exchangeRate > 0 && (
                      <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Tỷ giá hối đoái</span>
                            <span className="font-semibold">
                              1 {fromToken} = {exchangeRate} {toToken}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Phí giao dịch ước tính</span>
                            <span className="font-semibold text-green-600">~{gasEstimate} LSK</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Slippage</span>
                            <span className="font-semibold">0.5%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Swap Button */}
                    <Button
                      className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl transition-all"
                      disabled={!fromAmount || !fromToken || !toToken || isSwapping || exchangeRate === 0}
                      onClick={handleSwap}
                    >
                      {isSwapping ? "Đang hoán đổi..." : "Hoán đổi"}
                    </Button>

                    {availablePairs.length === 0 && !isLoading && (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Chưa có cặp token khả dụng để hoán đổi</p>
                        <p className="text-sm text-gray-500 mt-2">Vui lòng quay lại sau khi có thêm thanh khoản</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vouchers">
              <div className="space-y-8">
                {/* Category Filter */}
                <Card className="rounded-3xl shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-3">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          className={`rounded-full ${
                            selectedCategory === category.id
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-white hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                          {category.count > 0 && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {category.count}
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Vouchers Grid */}
                <Card className="rounded-3xl shadow-2xl border-0">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center text-gray-900 text-2xl">
                      <Star className="w-7 h-7 mr-3 text-yellow-500" />
                      Voucher các hãng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {vouchersLoading ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <Card key={i} className="rounded-2xl border border-gray-200">
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4 mb-4">
                                <Skeleton className="w-16 h-16 rounded-xl" />
                                <div className="flex-1">
                                  <Skeleton className="h-5 w-32 mb-2" />
                                  <Skeleton className="h-4 w-20 mb-2" />
                                  <Skeleton className="h-5 w-16" />
                                </div>
                              </div>
                              <Skeleton className="h-4 w-full mb-4" />
                              <div className="space-y-3 mb-6">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                              </div>
                              <Skeleton className="h-10 w-full" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : vouchers.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vouchers.map((voucher) => (
                          <VoucherCard key={voucher.id} voucher={voucher} onRedeem={redeemVoucher} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {selectedCategory === "all"
                            ? "Chưa có voucher khả dụng"
                            : `Chưa có voucher ${categories.find((c) => c.id === selectedCategory)?.name.toLowerCase()}`}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {selectedCategory === "all"
                            ? "Hiện tại chưa có voucher nào từ các thương hiệu đối tác. Hãy quay lại sau!"
                            : "Thử chọn danh mục khác hoặc quay lại sau khi có thêm voucher mới"}
                        </p>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setSelectedCategory("all")}>
                          Xem tất cả danh mục
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
