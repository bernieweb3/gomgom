"use client";

import { useAccount, useBalance } from "wagmi";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet,
  Coins,
  Trophy,
  CreditCard,
  Zap,
  Settings,
  Bell,
  Globe,
  Shield,
  Clock,
  TrendingUp,
  Copy,
  ExternalLink,
} from "lucide-react";
import { WalletConnect } from "@/components/wallet-connect";
import { toast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-api";

import { useGomGomTokenFactory } from "@/hooks/useGomGomTokenFactory";
import { useFlashPointToken } from "@/hooks/useFlashPointToken";
import { useGomGomDEX } from "@/hooks/useGomGomDEX";
import { useGomGomNFTSimple } from "@/hooks/useGomGomNFTSimple";
import { useMissionManager } from "@/hooks/useMissionManager";
import { useEffect, useState } from "react";

export default function MyProfilePage() {
  // Test SMC
  const factory = useGomGomTokenFactory();
  const flashPoint = useFlashPointToken();
  const dex = useGomGomDEX();
  const nft = useGomGomNFTSimple();
  const mission = useMissionManager();

  const [brandCount, setBrandCount] = useState<string | null>(null);
  const [flashTotal, setFlashTotal] = useState<string | null>(null);
  const [dexOwner, setDexOwner] = useState<string | null>(null);
  const [nftName, setNftName] = useState<string | null>(null);
  const [missionCount, setMissionCount] = useState<string | null>(null);

  useEffect(() => {
    if (factory)
      factory.getBrandCount().then((v: any) => setBrandCount(v.toString()));
    if (flashPoint)
      flashPoint.totalSupply().then((v: any) => setFlashTotal(v.toString()));
    // DEX contract doesn't have owner() function, skip this call
    if (nft) nft.name().then((v: string) => setNftName(v));
    if (mission && mission.getAllMissionIds)
      mission.getAllMissionIds().then((v: any) => setMissionCount(v.length.toString()));
  }, [factory, flashPoint, dex, nft, mission]);

  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const { profile, isLoading } = useUserProfile();

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Đã sao chép",
        description: "Địa chỉ ví đã được sao chép vào clipboard",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Wallet className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Kết nối ví để tiếp tục
                </h1>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Vui lòng kết nối ví Web3 của bạn để truy cập My Profile và các
                  tính năng của Gom Gom
                </p>
                <WalletConnect />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Nếu chưa có profile thực tế, chỉ hiển thị thông báo
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Chưa có dữ liệu hồ sơ
                </h1>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Dữ liệu hồ sơ sẽ hiển thị khi đã kết nối blockchain hoặc
                  backend thực tế.
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-3">
                  My Profile
                </h1>
                <p className="text-xl text-gray-600">
                  Quản lý tài sản loyalty và cài đặt tài khoản của bạn
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-medium"
              >
                Đã kết nối
              </Badge>
            </div>
          </div>

          <div className="grid xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-8">
              {/* Total Balance */}
              <Card className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 text-white rounded-3xl shadow-2xl border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-green-100 mb-2">
                        Tổng giá trị điểm thưởng
                      </h2>
                      {isLoading ? (
                        <Skeleton className="h-12 w-48 bg-white/20" />
                      ) : (
                        <>
                          <div className="text-5xl font-black mb-2">
                            {profile?.totalValue || 0} VND
                          </div>
                          <div className="text-green-100 text-lg">
                            ETH Balance:{" "}
                            {ethBalance
                              ? Number.parseFloat(ethBalance.formatted).toFixed(
                                  4
                                )
                              : "0"}{" "}
                            ETH
                          </div>
                        </>
                      )}
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex items-center text-green-100">
                    <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
                    <span>Cập nhật real-time từ blockchain</span>
                  </div>
                </CardContent>
              </Card>

              {/* Points List */}
              <Card className="rounded-3xl shadow-xl border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-gray-900 text-2xl">
                    <Coins className="w-7 h-7 mr-3 text-green-600" />
                    Danh sách điểm thưởng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl"
                        >
                          <div className="flex items-center space-x-4">
                            <Skeleton className="w-14 h-14 rounded-xl" />
                            <div>
                              <Skeleton className="h-5 w-32 mb-2" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          </div>
                          <div className="text-right">
                            <Skeleton className="h-5 w-24 mb-2" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : profile?.pointBalances?.length > 0 ? (
                    <div className="grid gap-4">
                      {profile.pointBalances.map(
                        (point: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all hover:scale-[1.02]"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                                {point.brand.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-lg">
                                  {point.brand}
                                </div>
                                <div className="text-gray-600">
                                  {point.balance} {point.symbol}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900 text-lg">
                                {point.value}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2 text-xs bg-transparent"
                                onClick={() =>
                                  window.open(
                                    `https://liskscan.com/address/${point.contractAddress}`,
                                    "_blank"
                                  )
                                }
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Contract
                              </Button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Coins className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Chưa có điểm thưởng
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Bạn chưa có điểm thưởng nào. Hãy tham gia các nhiệm vụ
                        để tích điểm!
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Khám phá nhiệm vụ
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Flash Points */}
              <Card className="rounded-3xl shadow-xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-gray-900 text-2xl">
                    <Zap className="w-7 h-7 mr-3 text-yellow-600" />
                    Điểm Chớp Nhoáng
                    {profile?.flashPoints?.length > 0 && (
                      <Badge className="ml-3 bg-red-500 text-white animate-pulse">
                        {profile.flashPoints.length} điểm sắp hết hạn
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-5 bg-white rounded-2xl"
                        >
                          <div className="flex items-center space-x-4">
                            <Skeleton className="w-12 h-12 rounded-xl" />
                            <div>
                              <Skeleton className="h-5 w-32 mb-2" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                          <div className="text-right">
                            <Skeleton className="h-5 w-20 mb-2" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : profile?.flashPoints?.length > 0 ? (
                    <div className="space-y-4">
                      {profile.flashPoints.map((point: any) => {
                        const timeLeft = Math.max(
                          0,
                          point.expiresAt - Date.now()
                        );
                        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                        const minutes = Math.floor(
                          (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
                        );

                        return (
                          <div
                            key={point.id}
                            className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-yellow-200 shadow-sm"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900">
                                  {point.brand} Flash Points
                                </div>
                                <div className="text-gray-600">
                                  {point.amount} điểm
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-red-600 font-bold flex items-center text-lg">
                                <Clock className="w-5 h-5 mr-2" />
                                {hours}h {minutes}m
                              </div>
                              <Button
                                size="sm"
                                className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                              >
                                Sử dụng ngay
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                      <p className="text-gray-600">
                        Không có điểm chớp nhoáng nào
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* NFTs */}
              <Card className="rounded-3xl shadow-xl border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-gray-900 text-2xl">
                    <Trophy className="w-7 h-7 mr-3 text-green-600" />
                    NFTs sở hữu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-white rounded-2xl p-6 text-center border border-gray-100"
                        >
                          <Skeleton className="w-20 h-20 rounded-2xl mx-auto mb-4" />
                          <Skeleton className="h-5 w-24 mx-auto mb-2" />
                          <Skeleton className="h-4 w-16 mx-auto mb-2" />
                          <Skeleton className="h-6 w-12 mx-auto" />
                        </div>
                      ))}
                    </div>
                  ) : profile?.nfts?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {profile.nfts.map((nft: any) => (
                        <div
                          key={nft.id}
                          className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                          onClick={() =>
                            window.open(
                              `https://liskscan.com/token/${nft.contractAddress}/${nft.tokenId}`,
                              "_blank"
                            )
                          }
                        >
                          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <Trophy className="w-10 h-10 text-white" />
                          </div>
                          <div className="font-bold text-gray-900 mb-1">
                            {nft.name}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {nft.brand}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs font-medium"
                          >
                            {nft.rarity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Chưa có NFT
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Hoàn thành các nhiệm vụ để nhận NFT độc quyền từ các
                        thương hiệu!
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Xem nhiệm vụ
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Wallet Info */}
              <Card className="rounded-3xl shadow-xl border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-gray-900 text-xl">
                    <Wallet className="w-6 h-6 mr-3 text-green-600" />
                    Thông tin ví
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-2">
                        Địa chỉ ví
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="font-mono text-sm bg-gray-100 p-3 rounded-xl flex-1">
                          {address ? formatAddress(address) : ""}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="p-3 bg-transparent"
                          onClick={copyAddress}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-green-600">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="font-medium">Đã kết nối</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent"
                        onClick={() =>
                          window.open(
                            `https://liskscan.com/address/${address}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Xem trên Lisk
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Points */}
              <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-gray-900 text-xl">
                    <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                    Điểm Tín Chấp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      {isLoading ? (
                        <Skeleton className="h-12 w-16 mx-auto mb-2" />
                      ) : (
                        <div className="text-4xl font-bold text-blue-600 mb-1">
                          {profile?.creditScore || 0}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        Điểm tín nhiệm
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <div className="text-sm mb-2">
                        <div className="text-gray-600">Trạng thái vay:</div>
                        <div className="text-green-600 font-medium">
                          Không có khoản vay
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-600">Hạn mức ước tính:</div>
                        <div className="font-bold text-gray-900">
                          {profile?.maxLoanAmount
                            ? `$${profile.maxLoanAmount} USD`
                            : "Chưa đánh giá"}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl">
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card className="rounded-3xl shadow-xl border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-gray-900 text-xl">
                    <Settings className="w-6 h-6 mr-3 text-gray-600" />
                    Cài đặt nhanh
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 mr-3 text-gray-600" />
                        <span className="font-medium">Bảo mật 2FA</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent"
                      >
                        Chưa bật
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <Bell className="w-5 h-5 mr-3 text-gray-600" />
                        <span className="font-medium">Thông báo</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent"
                      >
                        Cài đặt
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 mr-3 text-gray-600" />
                        <span className="font-medium">Ngôn ngữ</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent"
                      >
                        Tiếng Việt
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
