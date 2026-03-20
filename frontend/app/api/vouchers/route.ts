import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // TODO: Query voucher database/contracts
    const mockVouchers = [
      {
        id: "voucher-1",
        title: "Giảm 50% đồ uống",
        brand: "Starbucks",
        description: "Áp dụng cho tất cả đồ uống size Venti, không áp dụng cho combo",
        pointsRequired: "500",
        originalValue: "150,000 VND",
        discountPercent: 50,
        category: "food",
        expiryDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        termsAndConditions: [
          "Chỉ áp dụng 1 lần/khách hàng",
          "Không áp dụng cùng khuyến mãi khác",
          "Có hiệu lực trong 30 ngày",
        ],
        available: true,
        stock: 50,
        contractAddress: "0x9012345678901234567890123456789012345678",
      },
      {
        id: "voucher-2",
        title: "Miễn phí giao hàng",
        brand: "Grab Food",
        description: "Miễn phí phí giao hàng cho đơn từ 100k, áp dụng toàn quốc",
        pointsRequired: "200",
        originalValue: "25,000 VND",
        category: "food",
        expiryDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        termsAndConditions: ["Đơn tối thiểu 100,000 VND", "Áp dụng toàn quốc", "Có hiệu lực trong 7 ngày"],
        available: true,
        stock: 100,
        contractAddress: "0x0123456789012345678901234567890123456789",
      },
      {
        id: "voucher-3",
        title: "Giảm 30% vé xem phim",
        brand: "CGV Cinemas",
        description: "Giảm 30% giá vé xem phim 2D, áp dụng tất cả suất chiếu",
        pointsRequired: "800",
        originalValue: "120,000 VND",
        discountPercent: 30,
        category: "entertainment",
        expiryDate: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days
        termsAndConditions: ["Chỉ áp dụng cho phim 2D", "Không áp dụng ngày lễ", "Có hiệu lực trong 14 ngày"],
        available: true,
        stock: 25,
        contractAddress: "0x1234567890123456789012345678901234567890",
      },
      {
        id: "voucher-4",
        title: "Giảm 20% toàn bộ sản phẩm",
        brand: "Uniqlo",
        description: "Giảm 20% cho tất cả sản phẩm thời trang, không giới hạn số lượng",
        pointsRequired: "1000",
        originalValue: "200,000 VND",
        discountPercent: 20,
        category: "shopping",
        expiryDate: Date.now() + 21 * 24 * 60 * 60 * 1000, // 21 days
        termsAndConditions: ["Áp dụng toàn bộ sản phẩm", "Không giới hạn số lượng", "Có hiệu lực trong 21 ngày"],
        available: true,
        stock: 75,
        contractAddress: "0x2345678901234567890123456789012345678901",
      },
      {
        id: "voucher-5",
        title: "Massage thư giãn 60 phút",
        brand: "Spa Relax",
        description: "Dịch vụ massage thư giãn toàn thân 60 phút với tinh dầu thiên nhiên",
        pointsRequired: "1500",
        originalValue: "500,000 VND",
        category: "services",
        expiryDate: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days
        termsAndConditions: ["Cần đặt lịch trước 24h", "Áp dụng từ T2-T6", "Có hiệu lực trong 60 ngày"],
        available: true,
        stock: 10,
        contractAddress: "0x3456789012345678901234567890123456789012",
      },
    ]

    let filteredVouchers = mockVouchers
    if (category && category !== "all") {
      filteredVouchers = mockVouchers.filter((v) => v.category === category)
    }

    return NextResponse.json(filteredVouchers)
  } catch (error) {
    console.error("Error fetching vouchers:", error)
    return NextResponse.json({ error: "Failed to fetch vouchers" }, { status: 500 })
  }
}
