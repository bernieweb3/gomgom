"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Target, Trophy, Clock, CheckCircle, Calendar, Zap, ExternalLink } from "lucide-react"
import { WalletConnect } from "@/components/wallet-connect"
import { toast } from "@/hooks/use-toast"

interface Mission {
  id: string
  title: string
  description: string
  brand: string
  brandLogo?: string
  reward: {
    points: string
    nft?: {
      name: string
      rarity: string
    }
  }
  progress: {
    current: number
    total: number
  }
  deadline?: number
  status: "ongoing" | "completed" | "upcoming"
  requirements: string[]
  contractAddress: string
}

export default function BrandMissionsPage() {
  const { address, isConnected } = useAccount()

  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("ongoing")

  useEffect(() => {
    if (isConnected && address) {
      loadMissions()
    }
  }, [isConnected, address])

  const loadMissions = async () => {
    setIsLoading(true)
    try {
      // TODO: Load missions from smart contracts
      setMissions([])
    } catch (error) {
      console.error("Error loading missions:", error)
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải danh sách nhiệm vụ. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const joinMission = async (missionId: string) => {
    try {
      // TODO: Join mission via smart contract
      toast({
        title: "Tham gia thành công",
        description: "Bạn đã tham gia nhiệm vụ. Hãy hoàn thành các yêu cầu để nhận thưởng!",
      })
      await loadMissions() // Reload to update status
    } catch (error) {
      console.error("Error joining mission:", error)
      toast({
        title: "Lỗi tham gia",
        description: "Không thể tham gia nhiệm vụ. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  const claimReward = async (missionId: string) => {
    try {
      // TODO: Claim reward via smart contract
      toast({
        title: "Nhận thưởng thành công",
        description: "Phần thưởng đã được chuyển vào ví của bạn!",
      })
      await loadMissions() // Reload to update status
    } catch (error) {
      console.error("Error claiming reward:", error)
      toast({
        title: "Lỗi nhận thưởng",
        description: "Không thể nhận thưởng. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  const filteredMissions = missions.filter((mission) => {
    switch (activeTab) {
      case "ongoing":
        return mission.status === "ongoing"
      case "completed":
        return mission.status === "completed"
      case "upcoming":
        return mission.status === "upcoming"
      default:
        return true
    }
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Target className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Kết nối ví để xem nhiệm vụ</h1>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Vui lòng kết nối ví Web3 để tham gia các nhiệm vụ từ thương hiệu
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
            <h1 className="text-5xl font-bold text-gray-900 mb-3">Nhiệm vụ Thương hiệu</h1>
            <p className="text-xl text-gray-600">Hoàn thành nhiệm vụ gamified để nhận điểm thưởng và NFT độc quyền</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto bg-white rounded-2xl p-2 shadow-lg">
              <TabsTrigger value="ongoing" className="flex items-center space-x-2 rounded-xl">
                <Target className="w-4 h-4" />
                <span>Đang diễn ra</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center space-x-2 rounded-xl">
                <CheckCircle className="w-4 h-4" />
                <span>Đã hoàn thành</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center space-x-2 rounded-xl">
                <Calendar className="w-4 h-4" />
                <span>Sắp tới</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="rounded-3xl border-0 shadow-xl">
                      <CardContent className="p-8">
                        <div className="flex items-start space-x-4 mb-6">
                          <Skeleton className="w-16 h-16 rounded-2xl" />
                          <div className="flex-1">
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-4 w-3/4 mb-6" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredMissions.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredMissions.map((mission) => (
                    <Card
                      key={mission.id}
                      className="rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
                    >
                      <CardContent className="p-8">
                        {/* Mission Header */}
                        <div className="flex items-start space-x-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">{mission.brand.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{mission.title}</h3>
                            <p className="text-sm text-gray-600">{mission.brand}</p>
                            {mission.deadline && (
                              <div className="flex items-center text-orange-600 text-xs mt-2">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(mission.deadline).toLocaleDateString("vi-VN")}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Mission Description */}
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{mission.description}</p>

                        {/* Progress */}
                        {mission.status === "ongoing" && (
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Tiến độ</span>
                              <span className="text-sm text-gray-600">
                                {mission.progress.current}/{mission.progress.total}
                              </span>
                            </div>
                            <Progress
                              value={(mission.progress.current / mission.progress.total) * 100}
                              className="h-2"
                            />
                          </div>
                        )}

                        {/* Rewards */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Phần thưởng</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Điểm thưởng:</span>
                              <span className="font-bold text-green-600">{mission.reward.points}</span>
                            </div>
                            {mission.reward.nft && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">NFT:</span>
                                <Badge variant="outline" className="text-xs">
                                  {mission.reward.nft.name} ({mission.reward.nft.rarity})
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Requirements */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Yêu cầu</h4>
                          <ul className="space-y-1">
                            {mission.requirements.map((req, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action Button */}
                        <div className="space-y-3">
                          {mission.status === "ongoing" && (
                            <>
                              {mission.progress.current >= mission.progress.total ? (
                                <Button
                                  className="w-full bg-green-600 hover:bg-green-700 rounded-xl"
                                  onClick={() => claimReward(mission.id)}
                                >
                                  <Trophy className="w-4 h-4 mr-2" />
                                  Nhận thưởng
                                </Button>
                              ) : (
                                <Button
                                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl"
                                  onClick={() => joinMission(mission.id)}
                                >
                                  <Target className="w-4 h-4 mr-2" />
                                  Tham gia nhiệm vụ
                                </Button>
                              )}
                            </>
                          )}

                          {mission.status === "completed" && (
                            <Button className="w-full bg-gray-100 text-gray-600 rounded-xl cursor-not-allowed" disabled>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Đã hoàn thành
                            </Button>
                          )}

                          {mission.status === "upcoming" && (
                            <Button
                              className="w-full bg-orange-100 text-orange-600 rounded-xl cursor-not-allowed"
                              disabled
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Sắp ra mắt
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs bg-transparent"
                            onClick={() =>
                              window.open(`https://liskscan.com/address/${mission.contractAddress}`, "_blank")
                            }
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Xem smart contract
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    {activeTab === "ongoing" && <Target className="w-12 h-12 text-gray-400" />}
                    {activeTab === "completed" && <CheckCircle className="w-12 h-12 text-gray-400" />}
                    {activeTab === "upcoming" && <Calendar className="w-12 h-12 text-gray-400" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {activeTab === "ongoing" && "Chưa có nhiệm vụ đang diễn ra"}
                    {activeTab === "completed" && "Chưa hoàn thành nhiệm vụ nào"}
                    {activeTab === "upcoming" && "Chưa có nhiệm vụ sắp tới"}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {activeTab === "ongoing" && "Hiện tại chưa có nhiệm vụ nào từ các thương hiệu. Hãy quay lại sau!"}
                    {activeTab === "completed" &&
                      "Bạn chưa hoàn thành nhiệm vụ nào. Hãy tham gia các nhiệm vụ để nhận thưởng!"}
                    {activeTab === "upcoming" && "Chưa có nhiệm vụ nào được lên lịch. Theo dõi để cập nhật sớm nhất!"}
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Khám phá tính năng khác
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
