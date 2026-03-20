"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Star,
  Wallet,
  Zap,
  Shield,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFlashPointToken } from "@/hooks/useFlashPointToken";

export default function Page() {
  const token = useFlashPointToken();
  const [mounted, setMounted] = useState(false);
  const [totalSupply, setTotalSupply] = useState<string>("0");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !token) return;
    const fetchSupply = async () => {
      try {
        const supply = await token.totalSupply();
        setTotalSupply(supply.toString());
        console.log("Total Supply:", supply.toString());
      } catch (error) {
        console.error("Error fetching total supply:", error);
      }
    };
    fetchSupply();
  }, [token, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Chuyển đổi điểm thưởng thành{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                tài sản số
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Gom Gom giúp bạn tối đa hóa giá trị từ các chương trình khách hàng thân thiết.
              Chuyển đổi điểm thưởng thành NFT và token có thể giao dịch trên blockchain.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/point-exchange">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Bắt đầu ngay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/my-profile">
                <Button variant="outline" size="lg">
                  Xem hồ sơ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Thống kê hệ thống
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Dữ liệu thời gian thực từ blockchain
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-white/80 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Total Supply</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-purple-600">
                  {totalSupply}
                </dd>
              </div>
              <div className="flex flex-col bg-white/80 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Người dùng</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-purple-600">1,200+</dd>
              </div>
              <div className="flex flex-col bg-white/80 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Giao dịch</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-purple-600">15,000+</dd>
              </div>
              <div className="flex flex-col bg-white/80 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">Thương hiệu</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-purple-600">50+</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tính năng nổi bật
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Khám phá các tính năng mạnh mẽ giúp bạn tối đa hóa giá trị điểm thưởng
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Wallet className="h-5 w-5 flex-none text-purple-600" />
                  Ví đa chuỗi
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Kết nối với nhiều loại ví crypto phổ biến như MetaMask, WalletConnect, Coinbase Wallet.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Zap className="h-5 w-5 flex-none text-purple-600" />
                  Giao dịch nhanh
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Chuyển đổi điểm thưởng thành token và NFT chỉ trong vài giây với phí gas thấp.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Shield className="h-5 w-5 flex-none text-purple-600" />
                  Bảo mật cao
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Smart contracts đã được audit và verify trên blockchain, đảm bảo an toàn tuyệt đối.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
