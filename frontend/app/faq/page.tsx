import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Shield, Coins, Gavel } from "lucide-react"

export default function FAQPage() {
  const faqs = [
    {
      question: "Gom Gom có phải là cryptocurrency không?",
      answer:
        "Gom Gom không phải là cryptocurrency truyền thống. Chúng tôi sử dụng công nghệ blockchain để token hóa điểm thưởng, giúp chúng có thể chuyển nhượng và giao dịch. Tuy nhiên, điểm thưởng vẫn giữ bản chất là loyalty points, không phải là tài sản tài chính.",
    },
    {
      question: "Có rủi ro pháp lý khi sử dụng Gom Gom không?",
      answer:
        "Gom Gom tuân thủ đầy đủ các quy định pháp luật Việt Nam. Chúng tôi đã tham khảo ý kiến luật sư và đảm bảo hoạt động trong khuôn khổ pháp lý. Điểm thưởng được token hóa nhưng vẫn giữ tính chất là phần thưởng khách hàng thân thiết, không phải chứng khoán hay tài sản tài chính.",
    },
    {
      question: "NFT trong Gom Gom được sử dụng như thế nào?",
      answer:
        "NFT trong Gom Gom được sử dụng làm phần thưởng đặc biệt và chứng chỉ thành tích. Chúng có thể là voucher độc quyền, membership card, hoặc collectibles từ thương hiệu. NFT giúp tạo tính độc đáo và giá trị sưu tập cho người dùng.",
    },
    {
      question: "Điểm thưởng có thể đổi ra tiền mặt được không?",
      answer:
        "Điểm thưởng trong Gom Gom chủ yếu được sử dụng để đổi sản phẩm, dịch vụ hoặc ưu đãi từ các thương hiệu đối tác. Việc chuyển đổi trực tiếp ra tiền mặt sẽ tuân theo quy định của từng thương hiệu và pháp luật hiện hành.",
    },
    {
      question: "Làm thế nào để bảo mật ví và tài sản?",
      answer:
        "Gom Gom sử dụng các biện pháp bảo mật hàng đầu bao gồm: mã hóa end-to-end, xác thực đa yếu tố, và smart contract đã được audit. Người dùng cần bảo mật private key và sử dụng ví phần cứng cho tài sản có giá trị cao.",
    },
    {
      question: "Chi phí sử dụng Gom Gom như thế nào?",
      answer:
        "Gom Gom miễn phí cho người dùng cuối. Chúng tôi chỉ thu phí từ các thương hiệu đối tác. Phí giao dịch blockchain (gas fee) trên Lisk rất thấp, thường dưới $0.01 cho mỗi giao dịch.",
    },
    {
      question: "Tại sao chọn Lisk blockchain?",
      answer:
        "Lisk được chọn vì: phí giao dịch thấp, tốc độ xử lý nhanh, thân thiện với developer, và có hệ sinh thái mạnh. Điều này giúp Gom Gom cung cấp trải nghiệm mượt mà với chi phí tối thiểu cho người dùng.",
    },
    {
      question: "Làm thế nào để thương hiệu tham gia Gom Gom?",
      answer:
        "Thương hiệu có thể liên hệ qua trang Partners để được tư vấn. Chúng tôi cung cấp SDK, API và dashboard quản lý để tích hợp dễ dàng với hệ thống hiện có. Quá trình onboarding thường mất 2-4 tuần.",
    },
  ]

  const legalSections = [
    {
      icon: Shield,
      title: "Bảo mật & Quyền riêng tư",
      content:
        "Chúng tôi cam kết bảo vệ thông tin cá nhân và tuân thủ các quy định về bảo vệ dữ liệu. Tất cả dữ liệu được mã hóa và lưu trữ an toàn.",
    },
    {
      icon: Gavel,
      title: "Điều khoản sử dụng",
      content:
        "Việc sử dụng Gom Gom đồng nghĩa với việc chấp nhận các điều khoản và điều kiện của chúng tôi. Vui lòng đọc kỹ trước khi sử dụng.",
    },
    {
      icon: Coins,
      title: "Chính sách điểm thưởng",
      content:
        "Điểm thưởng có thời hạn sử dụng và quy định riêng từ mỗi thương hiệu. Gom Gom chỉ là nền tảng kỹ thuật, không chịu trách nhiệm về chính sách điểm thưởng.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <HelpCircle className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-white mb-6">FAQ & Pháp lý</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tìm câu trả lời cho các thắc mắc thường gặp và thông tin pháp lý quan trọng
            </p>
          </div>

          {/* FAQ Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Câu hỏi thường gặp</h2>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-black/30 border border-white/10 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-white hover:text-purple-400 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* Legal Section */}
          <section>
            <h2 className="text-3xl font-bold text-white text-center mb-12">Thông tin pháp lý</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {legalSections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
                    <section.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{section.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-20 text-center">
            <div className="bg-black/30 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Vẫn có thắc mắc?</h3>
              <p className="text-gray-300 mb-6">Liên hệ với đội ngũ hỗ trợ của chúng tôi để được giải đáp chi tiết</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@gomgom.io"
                  className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Email hỗ trợ
                </a>
                <a
                  href="https://t.me/gomgom_support"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Telegram
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
