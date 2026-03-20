"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star, Target, Zap, CreditCard, ShoppingBag, ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MVPFeaturesPage() {
  const features = [
    {
      icon: Star,
      title: "SuperPoint Wallet",
      description:
        "Ví tập trung quản lý tất cả điểm thưởng từ nhiều thương hiệu trong một giao diện duy nhất. Theo dõi số dư, lịch sử giao dịch và tỷ giá quy đổi real-time từ blockchain.",
      benefits: [
        "Quản lý đa thương hiệu trong 1 ví",
        "Theo dõi real-time từ blockchain",
        "Lịch sử giao dịch minh bạch",
        "Tỷ giá quy đổi tự động",
      ],
      color: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
      link: "/my-profile",
    },
    {
      icon: Target,
      title: "Nhiệm vụ Gamified",
      description:
        "Hoàn thành các nhiệm vụ thú vị từ thương hiệu để nhận điểm thưởng và NFT độc quyền. Hệ thống smart contract đảm bảo tính minh bạch và tự động.",
      benefits: [
        "Smart contract tự động",
        "NFT phần thưởng độc quyền",
        "Hệ thống achievement on-chain",
        "Leaderboard minh bạch",
      ],
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      link: "/brand-missions",
    },
    {
      icon: Zap,
      title: "Điểm Chớp Nhoáng",
      description:
        "Điểm thưởng có thời hạn ngắn với giá trị cao, được quản lý bởi smart contract với cơ chế time-decay tự động để tối ưu giá trị.",
      benefits: ["Smart contract time-decay", "Thông báo real-time", "Tự động hết hạn", "Boost engagement"],
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      link: "/my-profile",
    },
    {
      icon: CreditCard,
      title: "Điểm Tín Chấp",
      description:
        "Sử dụng điểm thưởng làm tài sản thế chấp để vay mượn trong hệ sinh thái DeFi. Tích hợp với các protocol lending hàng đầu.",
      benefits: ["Tích hợp DeFi protocols", "Tính toán risk tự động", "Thanh lý an toàn", "Lãi suất cạnh tranh"],
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      link: "/credit-points",
    },
    {
      icon: ShoppingBag,
      title: "Chợ Phần Thưởng",
      description:
        "Marketplace phi tập trung với các phần thưởng được đề xuất dựa trên phân tích on-chain và AI recommendation engine.",
      benefits: ["Phân tích on-chain", "AI recommendation", "Marketplace phi tập trung", "Giao dịch P2P"],
      color: "from-red-500/20 to-rose-500/20",
      borderColor: "border-red-500/30",
      link: "/point-exchange",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">Tính năng MVP</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Khám phá chi tiết các tính năng cốt lõi của Gom Gom - nền tảng loyalty Web3 với smart contract integration
            </p>
          </div>

          <div className="space-y-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${feature.color} border ${feature.borderColor} rounded-2xl p-8 lg:p-12`}
              >
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">{feature.title}</h2>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">{feature.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center text-white">
                          <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={feature.link}>
                      <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                        Trải nghiệm ngay
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <feature.icon className="w-16 h-16 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70">Tính năng đang hoạt động</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3 text-white/70 border-white/30 bg-transparent hover:bg-white/10"
                          onClick={() => window.open("https://liskscan.com", "_blank")}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Xem trên Lisk
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/partners">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
              >
                Tìm hiểu về đối tác
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
