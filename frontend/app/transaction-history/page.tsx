"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { History, ArrowUpRight, ArrowDownLeft, Repeat, Trophy, ExternalLink, Filter, Download } from "lucide-react"
import { WalletConnect } from "@/components/wallet-connect"
import { toast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: "earn" | "spend" | "swap" | "reward" | "loan" | "repay"
  amount: string
  token: string
  from?: string
  to?: string
  brand?: string
  timestamp: number
  status: "completed" | "pending" | "failed"
  txHash: string
  gasUsed?: string
}

export default function TransactionHistoryPage() {
  const { address, isConnected } = useAccount()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (isConnected && address) {
      loadTransactions()
    }
  }, [isConnected, address])

  const loadTransactions = async () => {
    setIsLoading(true)
    try {
      // TODO: Load transactions from blockchain/indexer
      setTransactions([])
    } catch (error) {
      console.error("Error loading transactions:", error)
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải lịch sử giao dịch. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earn":
        return <ArrowDownLeft className="w-5 h-5 text-green-600" />
      case "spend":
        return <ArrowUpRight className="w-5 h-5 text-red-600" />
      case "swap":
        return <Repeat className="w-5 h-5 text-blue-600" />
      case "reward":
        return <Trophy className="w-5 h-5 text-yellow-600" />
      case "loan":
        return <ArrowDownLeft className="w-5 h-5 text-purple-600" />
      case "repay":
        return <ArrowUpRight className="w-5 h-5 text-purple-600" />
      default:
        return <History className="w-5 h-5 text-gray-600" />
    }
  }

  const getTransactionTitle = (tx: Transaction) => {
    switch (tx.type) {
      case "earn":
        return `Nhận điểm từ ${tx.brand || "Unknown"}`
      case "spend":
        return `Sử dụng điểm tại ${tx.brand || "Unknown"}`
      case "swap":
        return `Hoán đổi ${tx.token}`
      case "reward":
        return `Phần thưởng từ ${tx.brand || "Mission"}`
      case "loan":
        return "Tạo khoản vay"
      case "repay":
        return "Trả nợ"
      default:
        return "Giao dịch"
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === "all") return true
    return tx.type === activeTab
  })

  const exportTransactions = () => {
    // TODO: Export transactions to CSV
    toast({
      title: "Xuất dữ liệu",
      description: "Tính năng xuất dữ liệu sẽ có sẵn sớm.",
    })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <History className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Kết nối ví để xem lịch sử</h1>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Vui lòng kết nối ví Web3 để xem lịch sử giao dịch của bạn
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-3">Lịch sử Giao dịch</h1>
                <p className="text-xl text-gray-600">Theo dõi tất cả hoạt động của bạn trên blockchain</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="bg-white" onClick={exportTransactions}>
                  <Download className="w-4 h-4 mr-2" />
                  Xuất dữ liệu
                </Button>
                <Button variant="outline" className="bg-white">
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-6 max-w-4xl mx-auto bg-white rounded-2xl p-2 shadow-lg">
              <TabsTrigger value="all" className="rounded-xl">
                Tất cả
              </TabsTrigger>
              <TabsTrigger value="earn" className="rounded-xl">
                Nhận điểm
              </TabsTrigger>
              <TabsTrigger value="spend" className="rounded-xl">
                Sử dụng
              </TabsTrigger>
              <TabsTrigger value="swap" className="rounded-xl">
                Hoán đổi
              </TabsTrigger>
              <TabsTrigger value="reward" className="rounded-xl">
                Thưởng
              </TabsTrigger>
              <TabsTrigger value="loan" className="rounded-xl">
                Vay/Trả
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Card className="rounded-3xl shadow-xl border-0">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center text-gray-900 text-2xl">
                    <History className="w-7 h-7 mr-3 text-green-600" />
                    Lịch sử giao dịch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-4 p-6 bg-gray-50 rounded-2xl">
                          <Skeleton className="w-12 h-12 rounded-xl" />
                          <div className="flex-1">
                            <Skeleton className="h-5 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <div className="text-right">
                            <Skeleton className="h-5 w-24 mb-2" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {filteredTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center space-x-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            {getTransactionIcon(tx.type)}
                          </div>

                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">{getTransactionTitle(tx)}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(tx.timestamp).toLocaleString("vi-VN")}
                            </div>
                          </div>

                          <div className="text-right">
                            <div
                              className={`font-bold text-lg ${
                                tx.type === "earn" || tx.type === "reward" || tx.type === "loan"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {tx.type === "earn" || tx.type === "reward" || tx.type === "loan" ? "+" : "-"}
                              {tx.amount} {tx.token}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  tx.status === "completed"
                                    ? "default"
                                    : tx.status === "pending"
                                      ? "outline"
                                      : "destructive"
                                }
                                className={
                                  tx.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : tx.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {tx.status === "completed" && "Hoàn thành"}
                                {tx.status === "pending" && "Đang xử lý"}
                                {tx.status === "failed" && "Thất bại"}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs bg-transparent"
                                onClick={() => window.open(`https://liskscan.com/tx/${tx.txHash}`, "_blank")}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {activeTab === "all" ? "Chưa có giao dịch" : `Chưa có giao dịch ${activeTab}`}
                      </h3>
                      <p className="text-gray-600 mb-8">
                        {activeTab === "all"
                          ? "Bạn chưa có giao dịch nào. Hãy bắt đầu sử dụng Gom Gom!"
                          : `Bạn chưa có giao dịch loại ${activeTab}. Khám phá các tính năng khác!`}
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700">Khám phá tính năng</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
