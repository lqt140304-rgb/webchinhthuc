import { HOSPITAL_CONTACT } from '@/config/contact'

// ============================================================================
// PHASE 3 / BATCH 3A — DỮ LIỆU MINH HỌA BẢNG GIÁ DỊCH VỤ (/bang-gia)
// Tuân thủ: Master Prompt V2.0 & Baseline Kiến trúc 2026
// Mọi thông tin đều mang cờ isMock: true, không tự bịa số tiền giả.
// Bệnh viện đã xác nhận 4 dịch vụ lâm sàng: X-quang, Siêu âm, Phẫu thuật, Xét nghiệm.
// Tuyệt đối không suy diễn công nghệ chuyên sâu hoặc đưa ra chỉ dẫn y khoa chưa duyệt.
// ============================================================================

export interface MockPricingServiceItem {
  readonly id: string
  readonly isMock: true
  readonly categoryId: string
  readonly name: string
  readonly shortDesc: string
  readonly priceStatus: 'Liên hệ để biết giá' | 'Chưa cập nhật'
  readonly applicableFor: string
  readonly executionTime: string
  readonly notes: string
}

export interface MockPricingCategory {
  readonly id: string
  readonly isMock: true
  readonly name: string
  readonly shortDesc: string
  readonly badgeLabel: string
  readonly groupNotice?: string
}

export const MOCK_PRICING_EDITORIAL_NOTICE =
  'Toàn bộ bảng giá dịch vụ dưới đây là dữ liệu minh họa cấu trúc hiển thị — đang cập nhật dữ liệu thực tế từ Bệnh viện Thú y Lê Sơn. Bệnh viện đã xác nhận cung cấp dịch vụ X-quang, Siêu âm, Phẫu thuật và Xét nghiệm. Chi phí thực tế phụ thuộc vào tình trạng sức khỏe, cân nặng và chỉ định thăm khám lâm sàng của bác sĩ. Vui lòng liên hệ hotline 097 355 51 05 để được tư vấn điều kiện tiếp nhận và báo giá chính xác.'

export const MOCK_PRICING_CATEGORIES: readonly MockPricingCategory[] = [
  {
    id: 'kham-dieu-tri',
    isMock: true,
    name: 'Khám & Điều trị',
    shortDesc: 'Thăm khám lâm sàng ban đầu, tư vấn thể trạng và theo dõi điều trị ngoại trú',
    badgeLabel: 'Lâm sàng tổng quát',
    groupNotice:
      'Danh mục dịch vụ khám & điều trị minh họa — đang cập nhật danh mục chính thức từ bệnh viện.',
  },
  {
    id: 'can-lam-sang',
    isMock: true,
    name: 'X-quang, Siêu âm & Xét nghiệm',
    shortDesc: 'Chẩn đoán hình ảnh và xét nghiệm cận lâm sàng phục vụ đánh giá chuyên môn',
    badgeLabel: 'Cận lâm sàng đã xác nhận',
    groupNotice:
      'Bệnh viện Thú y Lê Sơn có cung cấp dịch vụ X-quang, Siêu âm và Xét nghiệm. Danh mục các gói kỹ thuật chi tiết dưới đây là nội dung minh họa — đang cập nhật danh mục thực tế.',
  },
  {
    id: 'phau-thuat',
    isMock: true,
    name: 'Phẫu thuật ngoại khoa',
    shortDesc: 'Can thiệp ngoại khoa từ tiểu phẫu triệt sản đến phẫu thuật xử lý chấn thương',
    badgeLabel: 'Ngoại khoa đã xác nhận',
    groupNotice:
      'Bệnh viện Thú y Lê Sơn có cung cấp dịch vụ Phẫu thuật. Danh mục các ca phẫu thuật chi tiết dưới đây là nội dung minh họa — đang cập nhật danh mục thực tế.',
  },
  {
    id: 'noi-tru',
    isMock: true,
    name: 'Chăm sóc nội trú',
    shortDesc: 'Lưu trú theo dõi y tế sau phẫu thuật hoặc gửi chăm sóc thú cưng định kỳ',
    badgeLabel: 'Lưu trú',
    groupNotice:
      'Danh mục chăm sóc nội trú minh họa — đang cập nhật quy trình và danh mục chính thức.',
  },
  {
    id: 'spa',
    isMock: true,
    name: 'Spa & Grooming',
    shortDesc: 'Tắm vệ sinh, cắt tỉa lông móng và chăm sóc ngoại hình sạch sẽ, dịu nhẹ',
    badgeLabel: 'Grooming',
    groupNotice:
      'Bảng dịch vụ Spa & Grooming minh họa — vui lòng liên hệ để được tư vấn theo thể trạng của bé.',
  },
  {
    id: 'dich-vu-khac',
    isMock: true,
    name: 'Dự phòng & Khác',
    shortDesc: 'Tiêm phòng vaccine, tẩy giun sán định kỳ và thủ tục hồ sơ theo dõi sức khỏe',
    badgeLabel: 'Dự phòng',
    groupNotice:
      'Danh mục dịch vụ dự phòng minh họa — vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn.',
  },
]

export const MOCK_PRICING_SERVICES: readonly MockPricingServiceItem[] = [
  // 1. Khám & Điều trị
  {
    id: 'price-kham-01',
    isMock: true,
    categoryId: 'kham-dieu-tri',
    name: 'Khám lâm sàng tổng quát & tư vấn sức khỏe',
    shortDesc: 'Kiểm tra thể trạng chung, nhịp tim phổi, niêm mạc mắt miệng và tư vấn chế độ chăm sóc ban đầu.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó & mèo mọi thể trạng',
    executionTime: 'Khoảng 20 – 30 phút',
    notes: 'Bác sĩ trao đổi trực tiếp với chủ nuôi về thói quen sinh hoạt và lịch sử thăm khám của bé.',
  },
  {
    id: 'price-kham-02',
    isMock: true,
    categoryId: 'kham-dieu-tri',
    name: 'Tái khám theo dõi theo chỉ định bác sĩ',
    shortDesc: 'Đánh giá tiến triển hồi phục sau đợt điều trị hoặc kiểm tra phản ứng của thú cưng.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng đang trong kế hoạch theo dõi',
    executionTime: 'Khoảng 15 – 25 phút',
    notes: 'Gia đình nên mang theo sổ khám hoặc hồ sơ cũ để bác sĩ đối chiếu thông tin lâm sàng.',
  },
  {
    id: 'price-kham-03',
    isMock: true,
    categoryId: 'kham-dieu-tri',
    name: 'Khám chuyên sâu da liễu & tai mũi họng',
    shortDesc: 'Kiểm tra tổn thương da lông, vùng tai và các biểu hiện khó chịu kéo dài ở thú cưng.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng có biểu hiện viêm da, rụng lông hoặc ngứa tai',
    executionTime: 'Khoảng 30 – 45 phút',
    notes: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn phù hợp trước khi thăm khám.',
  },

  // 2. Cận lâm sàng: X-quang, Siêu âm, Xét nghiệm (Đã xác nhận dịch vụ)
  {
    id: 'price-cls-01',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Chụp X-quang (1 tư thế)',
    shortDesc: 'Khảo sát hình thái xương khớp, lồng ngực hoặc ổ bụng theo vùng chỉ định thăm khám.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Theo chỉ định thăm khám trực tiếp của bác sĩ',
    executionTime: 'Khoảng 15 – 20 phút',
    notes: 'Bác sĩ và kỹ thuật viên hỗ trợ cố định tư thế nhẹ nhàng, bảo đảm an toàn cho thú cưng.',
  },
  {
    id: 'price-cls-02',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Chụp X-quang (2 tư thế)',
    shortDesc: 'Ghi nhận hình ảnh đa góc độ vùng ngực hoặc bụng phục vụ đánh giá chuyên môn.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Theo chỉ định chẩn đoán hình ảnh của bác sĩ',
    executionTime: 'Khoảng 20 – 30 phút',
    notes: 'Bác sĩ giải thích trực tiếp kết quả hình ảnh cho chủ nuôi sau khi hoàn thành chụp phim.',
  },
  {
    id: 'price-cls-03',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Siêu âm ổ bụng tổng quát thú cưng',
    shortDesc: 'Khảo sát hình thái các cơ quan vùng bụng theo chỉ định thăm khám chuyên môn.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó & mèo cần kiểm tra tạng phủ ổ bụng',
    executionTime: 'Khoảng 20 – 30 phút',
    notes: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được hướng dẫn chuẩn bị phù hợp trước khi siêu âm.',
  },
  {
    id: 'price-cls-04',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Xét nghiệm huyết học tổng quát (Công thức máu)',
    shortDesc: 'Đánh giá các chỉ số tế bào máu nhằm hỗ trợ phát hiện sớm tình trạng viêm nhiễm hoặc bất thường.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thăm khám định kỳ hoặc chuẩn bị trước can thiệp ngoại khoa',
    executionTime: 'Khoảng 20 – 30 phút',
    notes: 'Lấy mẫu máu an toàn theo quy trình chuyên môn, kết quả được bác sĩ giải thích trực tiếp.',
  },
  {
    id: 'price-cls-05',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Xét nghiệm sinh hóa máu',
    shortDesc: 'Kiểm tra các chỉ số chức năng cơ quan phục vụ theo dõi sức khỏe và đánh giá chuyên môn.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng thăm khám chuyên sâu hoặc theo chỉ định bác sĩ',
    executionTime: 'Khoảng 30 – 45 phút',
    notes: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được hướng dẫn chuẩn bị trước khi xét nghiệm.',
  },
  {
    id: 'price-cls-06',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Xét nghiệm sàng lọc kháng nguyên nhanh',
    shortDesc: 'Hỗ trợ phát hiện nhanh kháng nguyên một số mầm bệnh thường gặp ở chó mèo.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng có biểu hiện bất thường hoặc theo chỉ định bác sĩ',
    executionTime: 'Khoảng 15 – 20 phút',
    notes: 'Thực hiện theo chỉ định của bác sĩ khi cần hỗ trợ đánh giá ban đầu.',
  },

  // 3. Phẫu thuật ngoại khoa (Đã xác nhận dịch vụ)
  {
    id: 'price-pt-01',
    isMock: true,
    categoryId: 'phau-thuat',
    name: 'Phẫu thuật triệt sản mèo đực',
    shortDesc: 'Thủ thuật ngoại khoa triệt sản hỗ trợ quản lý sức khỏe và hành vi của thú cưng.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Mèo đực đủ điều kiện sức khỏe qua thăm khám',
    executionTime: 'Khoảng 30 – 45 phút',
    notes: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn và chuẩn bị phù hợp trước phẫu thuật.',
  },
  {
    id: 'price-pt-02',
    isMock: true,
    categoryId: 'phau-thuat',
    name: 'Phẫu thuật triệt sản mèo cái',
    shortDesc: 'Can thiệp ngoại khoa triệt sản mèo cái thực hiện bởi bác sĩ có chuyên môn.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Mèo cái đủ điều kiện sức khỏe qua thăm khám',
    executionTime: 'Khoảng 45 – 60 phút',
    notes: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn chăm sóc hậu phẫu phù hợp.',
  },
  {
    id: 'price-pt-03',
    isMock: true,
    categoryId: 'phau-thuat',
    name: 'Phẫu thuật triệt sản chó',
    shortDesc: 'Can thiệp ngoại khoa triệt sản cho chó với quy trình theo dõi sát sao từ đội ngũ y tế.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó đủ điều kiện sức khỏe qua thăm khám',
    executionTime: 'Khoảng 60 – 90 phút',
    notes: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn kiểm tra tiền phẫu phù hợp.',
  },
  {
    id: 'price-pt-04',
    isMock: true,
    categoryId: 'phau-thuat',
    name: 'Xử lý vết thương phần mềm & khâu phục hồi',
    shortDesc: 'Vệ sinh, làm sạch và khâu tái tạo tổn thương phần mềm do chấn thương hoặc va chạm.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Tổn thương da và mô mềm theo đánh giá lâm sàng',
    executionTime: 'Tùy mức độ tổn thương thực tế',
    notes: 'Trường hợp cấp cứu được tiếp nhận ưu tiên theo quy trình chuyên môn.',
  },

  // 4. Chăm sóc Nội trú
  {
    id: 'price-nt-01',
    isMock: true,
    categoryId: 'noi-tru',
    name: 'Lưu trú theo dõi y tế sau can thiệp (Theo ngày)',
    shortDesc: 'Bố trí ô lưu trú yên tĩnh, theo dõi hồi tỉnh sau can thiệp và chăm sóc sinh hoạt.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng vừa hoàn thành can thiệp hoặc cần theo dõi',
    executionTime: 'Tính theo chu kỳ lưu viện thực tế',
    notes: 'Bao gồm vệ sinh ô lưu trú, cấp nước sạch và bữa ăn phù hợp thể trạng của thú cưng.',
  },
  {
    id: 'price-nt-02',
    isMock: true,
    categoryId: 'noi-tru',
    name: 'Lưu trú chăm sóc thú cưng định kỳ khi gia đình bận',
    shortDesc: 'Tiếp nhận thú cưng lưu lại cơ sở khi chủ nuôi có việc bận, duy trì chăm sóc sinh hoạt.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó & mèo có sức khỏe ổn định',
    executionTime: 'Theo thỏa thuận thời gian gửi của gia đình',
    notes: 'Chủ nuôi trao đổi thói quen sinh hoạt của bé cùng nhân viên tiếp đón tại quầy cơ sở.',
  },

  // 5. Spa & Grooming
  {
    id: 'price-spa-01',
    isMock: true,
    categoryId: 'spa',
    name: 'Gói tắm vệ sinh & sấy chải dịu nhẹ cơ bản',
    shortDesc: 'Tắm sạch dịu nhẹ với sản phẩm chuyên dụng, sấy khô và chải lông tơi xốp.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Phân loại theo thể trọng và độ dài lông của bé',
    executionTime: 'Khoảng 45 – 75 phút',
    notes: 'Nên đặt hẹn trước qua hotline để nhân sự grooming sắp xếp khung giờ phục vụ chu đáo.',
  },
  {
    id: 'price-spa-02',
    isMock: true,
    categoryId: 'spa',
    name: 'Chăm sóc chi tiết: Vệ sinh tai, cắt móng & tỉa đệm chân',
    shortDesc: 'Làm sạch vành tai ngoài, bấm gọn đầu móng và tỉa gọn lông đệm chân.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó & mèo cần vệ sinh định kỳ',
    executionTime: 'Khoảng 20 – 30 phút',
    notes: 'Thao tác ân cần, giúp các bé cảm thấy thoải mái và an tâm trong suốt quá trình chăm sóc.',
  },
  {
    id: 'price-spa-03',
    isMock: true,
    categoryId: 'spa',
    name: 'Cắt tỉa lông tạo phom theo yêu cầu',
    shortDesc: 'Tỉa gọn gàng toàn thân hoặc tạo kiểu phom dáng phù hợp sinh hoạt gia đình.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó mèo lông dài theo nhu cầu của chủ nuôi',
    executionTime: 'Khoảng 90 – 120 phút',
    notes: 'Trao đổi mong muốn về kiểu dáng lông cùng chuyên viên trước khi bắt đầu cắt tỉa.',
  },

  // 6. Dự phòng & Khác
  {
    id: 'price-dp-01',
    isMock: true,
    categoryId: 'dich-vu-khac',
    name: 'Tiêm phòng vaccine cho chó/mèo',
    shortDesc: 'Khám sàng lọc thể trạng trước tiêm và tư vấn lịch tiêm phòng phù hợp.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng đủ điều kiện sức khỏe qua thăm khám',
    executionTime: 'Khoảng 15 – 25 phút',
    notes: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn phác đồ và hướng dẫn theo dõi phù hợp.',
  },
  {
    id: 'price-dp-02',
    isMock: true,
    categoryId: 'dich-vu-khac',
    name: 'Phòng ngừa ký sinh trùng định kỳ',
    shortDesc: 'Cân trọng lượng và tư vấn giải pháp phòng ngừa nội ngoại ký sinh trùng an toàn.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó & mèo theo nhu cầu phòng ngừa định kỳ',
    executionTime: 'Khoảng 10 – 15 phút',
    notes: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn sản phẩm và cách sử dụng phù hợp.',
  },
  {
    id: 'price-dp-03',
    isMock: true,
    categoryId: 'dich-vu-khac',
    name: 'Cấp sổ theo dõi sức khỏe thú cưng',
    shortDesc: 'Ghi nhận lịch tiêm chủng, cân nặng và các mốc theo dõi phát triển của thú cưng.',
    priceStatus: 'Chưa cập nhật',
    applicableFor: 'Thú cưng mới tiếp nhận hoặc cần mở sổ theo dõi mới',
    executionTime: 'Khoảng 10 – 15 phút',
    notes: 'Hỗ trợ chủ nuôi dễ dàng ghi nhớ và theo dõi các mốc chăm sóc định kỳ cho bé.',
  },
]

export const MOCK_PRICING_FAQS: readonly {
  readonly id: string
  readonly isMock: true
  readonly question: string
  readonly answer: string
}[] = [
  {
    id: 'pricing-faq-1',
    isMock: true,
    question: 'Tại sao mức giá dịch vụ tại cơ sở chưa hiển thị con số cụ thể trên website?',
    answer:
      'Chi phí y tế thú y phụ thuộc vào thể trạng, cân nặng, mức độ phức tạp của từng ca bệnh và lượng vật tư tiêu hao thực tế. Bệnh viện Thú y Lê Sơn đang hoàn thiện bảng giá niêm yết chính thức. Khi đưa bé đến khám, bác sĩ luôn tư vấn phương án và thông báo dự toán chi phí rõ ràng trước khi thực hiện bất kỳ chỉ định nào.',
  },
  {
    id: 'pricing-faq-2',
    isMock: true,
    question: 'Làm thế nào để nhận thông tin tư vấn chi phí trước khi đưa thú cưng đến viện?',
    answer: `Quý khách vui lòng liên hệ trực tiếp qua hotline ${HOSPITAL_CONTACT.hotlineDisplay} hoặc trao đổi tại quầy tiếp đón ${HOSPITAL_CONTACT.address}. Đội ngũ tư vấn sẽ lắng nghe mô tả thể trạng của bé và cung cấp thông tin tham chiếu phù hợp.`,
  },
  {
    id: 'pricing-faq-3',
    isMock: true,
    question: 'Trường hợp cấp cứu tiếp nhận như thế nào?',
    answer: `Bệnh viện Thú y Lê Sơn duy trì tiếp nhận cấp cứu khẩn cấp 24/24 qua hotline ${HOSPITAL_CONTACT.hotlineDisplay}. Mọi thông tin về chi phí xử lý cấp cứu ban đầu sẽ được bác sĩ trực trao đổi minh bạch với chủ nuôi ngay khi tiếp nhận bé tại phòng khám.`,
  },
]
