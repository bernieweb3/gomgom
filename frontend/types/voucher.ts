export interface BrandVoucher {
  id: string
  title: string
  brand: string
  brandLogo?: string
  description: string
  pointsRequired: string
  originalValue: string
  discountPercent?: number
  category: "food" | "shopping" | "entertainment" | "travel" | "services"
  expiryDate?: number
  termsAndConditions: string[]
  available: boolean
  stock?: number
  contractAddress: string
}

export interface VoucherCategory {
  id: string
  name: string
  icon: string
  count: number
}
