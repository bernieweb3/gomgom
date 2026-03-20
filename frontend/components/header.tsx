"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { WalletConnect } from "@/components/wallet-connect"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent"
          >
            Gom Gom
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-50"
            >
              Trang chủ
            </Link>
            <Link
              href="/my-profile"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-50"
            >
              My Profile
            </Link>
            <Link
              href="/point-exchange"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-50"
            >
              Trao đổi Điểm
            </Link>
            <Link
              href="/brand-missions"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-50"
            >
              Nhiệm vụ
            </Link>
            <Link
              href="/credit-points"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-50"
            >
              Điểm Tín Chấp
            </Link>
            <Link
              href="/transaction-history"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-50"
            >
              Lịch sử
            </Link>
            <Link
              href="/partners"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-green-50"
            >
              Đối tác
            </Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <WalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-gray-700 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-6 pb-6 border-t border-gray-100">
            <div className="flex flex-col space-y-2 pt-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-3 rounded-lg hover:bg-green-50"
              >
                Trang chủ
              </Link>
              <Link
                href="/my-profile"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-3 rounded-lg hover:bg-green-50"
              >
                My Profile
              </Link>
              <Link
                href="/point-exchange"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-3 rounded-lg hover:bg-green-50"
              >
                Trao đổi Điểm
              </Link>
              <Link
                href="/brand-missions"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-3 rounded-lg hover:bg-green-50"
              >
                Nhiệm vụ
              </Link>
              <Link
                href="/credit-points"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-3 rounded-lg hover:bg-green-50"
              >
                Điểm Tín Chấp
              </Link>
              <Link
                href="/transaction-history"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-3 rounded-lg hover:bg-green-50"
              >
                Lịch sử
              </Link>
              <Link
                href="/partners"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium px-4 py-3 rounded-lg hover:bg-green-50"
              >
                Đối tác
              </Link>
              <div className="pt-4 px-4">
                <WalletConnect />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
