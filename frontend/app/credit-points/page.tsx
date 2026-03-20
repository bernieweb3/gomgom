"use client"

import { useState, useEffect } from "react"
import { useAccount, useBalance } from "wagmi"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, TrendingUp, Shield, AlertCircle, DollarSign, Clock, ExternalLink } from "lucide-react"
import { WalletConnect } from "@/components/wallet-connect"
import { toast } from "@/hooks/use-toast"

interface LoanPosition {
  id: string
  amount: string
  collateral: string
  interestRate: number
  dueDate: number
  status: "active" | "repaid" | "liquidated"
  contractAddress: string
}

export default function CreditPointsPage() {
  const { address, isConnected } = useAccount()
  const { data: ethBalance } = useBalance({ address })

  const [creditScore, setCreditScore] = useState<number>(0)
  const [maxLoanAmount, setMaxLoanAmount] = useState<string>("0")
  const [loanPositions, setLoanPositions] = useState<LoanPosition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loanAmount, setLoanAmount] = useState("")
  const [collateralAmount, setCollateralAmount] = useState("")
  const [isCreatingLoan, setIsCreatingLoan] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      loadCreditData()
    }
  }, [isConnected, address])

  const loadCreditData = async () => {
    setIsLoading(true)
    try {
      // TODO: Load credit score and loan data from smart contracts
      setCreditScore(0)
      setMaxLoanAmount("0")
      setLoanPositions([])
    } catch (error) {
      console.error("Error loading credit data:", error)
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải thông tin tín chấp. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createLoan = async () => {
    if (!loanAmount || !collateralAmount) {
      toast({
        title: "Thông tin không đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin vay.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingLoan(true)
    try {
      // TODO: Create loan via smart contract
      toast({
        title: "Đang tạo khoản vay",
        description: "Giao dịch đang được xử lý trên blockchain.",
      })

      // Reset form
      setLoanAmount("")
      setCollateralAmount("")
      await loadCreditData()
    } catch (error) {
      console.error("Error creating loan:", error)
      toast({
        title: "Lỗi tạo khoản vay",
        description: "Không thể tạo khoản vay. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingLoan(false)
    }
  }

  const repayLoan = async (loanId: string) => {
    try {
      // TODO: Repay loan via smart contract
      toast({
        title: "Đang trả nợ",
        description: "Giao dịch trả nợ đang được xử lý.",
      })
      await loadCreditData()
    } catch (error) {
      console.error("Error repaying loan:", error)
      toast({
        title: "Lỗi trả nợ",
        description: "Không thể trả nợ. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <CreditCard className="w-10 h-10 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Kết nối ví để sử dụng tín chấp</h1>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Vui lòng kết nối ví Web3 để truy cập tính năng điểm tín chấp
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">Điểm Tín Chấp</h1>
            <p className="text-xl text-gray-600">
              Sử dụng điểm thưởng làm tài sản thế chấp để vay mượn trong hệ sinh thái DeFi
            </p>
          </div>

          <div className="grid xl:grid-cols-3 gap-8">
            {/* Credit Score & Loan Creation */}
            <div className="xl:col-span-2 space-y-8">
              {/* Credit Score */}
              <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-blue-100 mb-2">Điểm tín nhiệm của bạn</h2>
                      {isLoading ? (
                        <Skeleton className="h-16 w-32 bg-white/20" />
                      ) : (
                        <div className="text-6xl font-black mb-2">{creditScore}</div>
                      )}
                      <div className="text-blue-100">Hạn mức tối đa: {maxLoanAmount} USD</div>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mr-2 animate-pulse"></div>
                    <span>Tính toán từ hoạt động on-chain</span>
                  </div>
                </CardContent>
              </Card>

              {/* Create Loan */}
              <Card className="rounded-3xl shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 text-2xl">
                    <DollarSign className="w-7 h-7 mr-3 text-green-600" />
                    Tạo khoản vay mới
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Số tiền muốn vay (USD)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tài sản thế chấp (Points)
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={collateralAmount}
                        onChange={(e) => setCollateralAmount(e.target.value)}
                        className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {loanAmount && collateralAmount && (
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Lãi suất ước tính</span>
                          <span className="font-semibold">8.5% APR</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Tỷ lệ thế chấp</span>
                          <span className="font-semibold">150%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Phí giao dịch</span>
                          <span className="font-semibold text-blue-600">~0.002 LSK</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold"
                    disabled={!loanAmount || !collateralAmount || isCreatingLoan || creditScore === 0}
                    onClick={createLoan}
                  >
                    {isCreatingLoan ? "Đang tạo khoản vay..." : "Tạo khoản vay"}
                  </Button>

                  {creditScore === 0 && (
                    <div className="flex items-center text-orange-600 text-sm bg-orange-50 p-3 rounded-xl">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Bạn cần có điểm tín nhiệm để tạo khoản vay
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active Loans */}
              <Card className="rounded-3xl shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 text-2xl">
                    <Clock className="w-7 h-7 mr-3 text-orange-600" />
                    Khoản vay hiện tại
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="p-6 bg-gray-50 rounded-2xl">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <Skeleton className="h-5 w-32 mb-2" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                          </div>
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : loanPositions.length > 0 ? (
                    <div className="space-y-4">
                      {loanPositions.map((loan) => (
                        <div key={loan.id} className="p-6 bg-white rounded-2xl border border-gray-100">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="font-bold text-gray-900 text-lg">${loan.amount}</div>
                              <div className="text-sm text-gray-600">Thế chấp: {loan.collateral} points</div>
                              <div className="text-sm text-gray-600">Lãi suất: {loan.interestRate}% APR</div>
                            </div>
                            <Badge
                              variant={loan.status === "active" ? "default" : "outline"}
                              className={
                                loan.status === "active"
                                  ? "bg-orange-100 text-orange-800"
                                  : loan.status === "repaid"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {loan.status === "active" && "Đang vay"}
                              {loan.status === "repaid" && "Đã trả"}
                              {loan.status === "liquidated" && "Đã thanh lý"}
                            </Badge>
                          </div>

                          {loan.status === "active" && (
                            <div className="space-y-3">
                              <div className="text-sm text-gray-600">
                                Hạn trả: {new Date(loan.dueDate).toLocaleDateString("vi-VN")}
                              </div>
                              <div className="flex space-x-3">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => repayLoan(loan.id)}
                                >
                                  Trả nợ
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-transparent"
                                  onClick={() =>
                                    window.open(`https://liskscan.com/address/${loan.contractAddress}`, "_blank")
                                  }
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Contract
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có khoản vay</h3>
                      <p className="text-gray-600">Bạn chưa có khoản vay nào. Tạo khoản vay đầu tiên!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* How it works */}
              <Card className="rounded-3xl shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 text-xl">
                    <Shield className="w-6 h-6 mr-3 text-blue-600" />
                    Cách thức hoạt động
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "Điểm tín nhiệm được tính từ hoạt động on-chain",
                      "Sử dụng điểm thưởng làm tài sản thế chấp",
                      "Smart contract tự động quản lý khoản vay",
                      "Thanh lý tự động khi cần thiết",
                    ].map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Warning */}
              <Card className="rounded-3xl shadow-xl border-2 border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 text-xl">
                    <AlertCircle className="w-6 h-6 mr-3 text-orange-600" />
                    Cảnh báo rủi ro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>• Tài sản thế chấp có thể bị thanh lý nếu giá trị giảm</p>
                    <p>• Lãi suất có thể thay đổi theo thị trường</p>
                    <p>• Hãy đảm bảo hiểu rõ rủi ro trước khi vay</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
