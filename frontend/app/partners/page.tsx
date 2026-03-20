"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Building2,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

interface Partner {
  id: number;
  name: string;
  contact_info?: string;
  created_at: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => {
        setPartners(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const benefits = [
    {
      icon: TrendingUp,
      title: "Giảm chi phí vận hành",
      description:
        "Tiết kiệm đến 60% chi phí vận hành chương trình loyalty nhờ tự động hóa blockchain",
    },
    {
      icon: Users,
      title: "Tăng engagement",
      description:
        "Gamification và NFT rewards tăng tương tác khách hàng lên 3-5 lần",
    },
    {
      icon: BarChart3,
      title: "Đo lường hiệu quả",
      description:
        "Analytics real-time và on-chain data giúp tối ưu ROI chương trình",
    },
    {
      icon: Shield,
      title: "Minh bạch & Bảo mật",
      description:
        "Blockchain đảm bảo tính minh bạch và bảo mật tuyệt đối cho dữ liệu",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Tạo nhiệm vụ",
      description:
        "Dashboard quản lý để tạo và theo dõi các nhiệm vụ gamified cho khách hàng",
    },
    {
      icon: Building2,
      title: "Airdrop điểm chớp nhoáng",
      description:
        "Công cụ marketing mạnh mẽ để tạo buzz và tăng engagement nhanh chóng",
    },
    {
      icon: BarChart3,
      title: "Tích hợp POS/API",
      description: "SDK và API dễ tích hợp với hệ thống POS và CRM hiện có",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Danh sách đối tác */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-white text-center mb-8">
              Đối tác tiêu biểu
            </h2>
            {loading ? (
              <div className="text-center text-gray-400">Đang tải...</div>
            ) : partners.length === 0 ? (
              <div className="text-center text-gray-400">
                Chưa có đối tác nào.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-black/30 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                  >
                    <Building2 className="w-10 h-10 text-green-400 mb-3" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {partner.name}
                    </h3>
                    {partner.contact_info && (
                      <p className="text-gray-400 text-sm mb-1">
                        {partner.contact_info}
                      </p>
                    )}
                    <span className="text-xs text-gray-500">
                      Tham gia:{" "}
                      {new Date(partner.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold text-white mb-6">
              Đối tác & Doanh nghiệp
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Tham gia hệ sinh thái Gom Gom để cách mạng hóa chương trình khách
              hàng thân thiết của bạn
            </p>
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-500/20 border border-green-500/30 text-green-200">
              <Building2 className="w-5 h-5 mr-2" />
              Đã có {partners.length} thương hiệu tham gia
            </div>
          </div>

          {/* Benefits Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Lợi ích cho doanh nghiệp
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Tính năng dành cho doanh nghiệp
            </h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-black/30 border border-white/10 rounded-xl p-8"
                >
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Case Study Section */}
          <section className="mb-20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Case Study
                </h2>
                <h3 className="text-2xl font-semibold text-green-400 mb-4">
                  Chuỗi cà phê ABC
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Sau 3 tháng triển khai Gom Gom, chuỗi cà phê ABC đã đạt được:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-4"></div>
                    <span className="text-white">
                      <strong>+150%</strong> tăng trưởng engagement
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-4"></div>
                    <span className="text-white">
                      <strong>-40%</strong> giảm chi phí vận hành
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-4"></div>
                    <span className="text-white">
                      <strong>+80%</strong> tăng retention rate
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm">
                <div className="aspect-video bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-green-400">Dashboard Analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="max-w-2xl mx-auto">
            <div className="bg-black/30 border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Liên hệ hợp tác
                </h2>
                <p className="text-gray-300">
                  Để lại thông tin để được tư vấn miễn phí về giải pháp loyalty
                  Web3
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Tên công ty *
                    </label>
                    <Input
                      placeholder="VD: Công ty ABC"
                      className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Người liên hệ *
                    </label>
                    <Input
                      placeholder="Họ và tên"
                      className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="contact@company.com"
                      className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Số điện thoại
                    </label>
                    <Input
                      placeholder="+84 xxx xxx xxx"
                      className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Lĩnh vực kinh doanh
                  </label>
                  <Input
                    placeholder="VD: F&B, Retail, E-commerce..."
                    className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Mô tả nhu cầu
                  </label>
                  <Textarea
                    placeholder="Chia sẻ về chương trình loyalty hiện tại và mong muốn cải thiện..."
                    rows={4}
                    className="bg-black/30 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Gửi yêu cầu tư vấn
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-6">
                Chúng tôi sẽ liên hệ trong vòng 24h để tư vấn miễn phí
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
