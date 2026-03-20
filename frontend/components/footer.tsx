import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Gom Gom</h3>
            <p className="text-gray-300 mb-4">
              Nền tảng loyalty Web3 đầu tiên tại Việt Nam, biến điểm thưởng
              thành tài sản có giá trị thực.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Sản phẩm</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mvp-features"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tính năng MVP
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Đối tác</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/partners"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dành cho doanh nghiệp
                </Link>
              </li>
              <li>
                <Link
                  href="/integration"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tích hợp API
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Liên hệ hợp tác
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Điều khoản
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Gom Gom. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
