import { HOSPITAL_CONTACT } from '@/config/contact'

// ============================================================================
// PHASE 3 / BATCH 3A — DỮ LIỆU MINH HỌA BẢNG GIÁ DỊCH VỤ (/bang-gia)
// Tuân thủ: Master Prompt V2.0 & Baseline Kiến trúc 2026
// Mọi thông tin đều mang cờ isMock: true, không tự bịa số tiền giả.
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
}

export const MOCK_PRICING_EDITORIAL_NOTICE =
  'Toàn bộ bảng giá dịch vụ dưới đây là dữ liệu minh họa cấu trúc hiển thị — đang cập nhật dữ liệu thực tế từ Bệnh viện Thú y Lê Sơn. Chi phí thực tế phụ thuộc vào tình trạng sức khỏe, cân nặng và chỉ định thăm khám lâm sàng của bác sĩ. Vui lòng liên hệ hotline 097 355 51 05 để được tư vấn điều kiện tiếp nhận và báo giá chính xác.'

export const MOCK_PRICING_CATEGORIES: readonly MockPricingCategory[] = [
  {
    id: 'kham-dieu-tri',
    isMock: true,
    name: 'Khám & Điều trị',
    shortDesc: 'Thăm khám lâm sàng ban đầu, tư vấn thể trạng và theo dõi điều trị ngoại trú',
    badgeLabel: 'Lâm sàng tổng quát',
  },
  {
    id: 'can-lam-sang',
    isMock: true,
    name: 'X-quang, Siêu âm & Xét nghiệm',
    shortDesc: 'Chẩn đoán hình ảnh và xét nghiệm cận lâm sàng phục vụ đánh giá chuyên môn',
    badgeLabel: 'Cận lâm sàng',
  },
  {
    id: 'phau-thuat',
    isMock: true,
    name: 'Phẫu thuật ngoại khoa',
    shortDesc: 'Can thiệp ngoại khoa từ tiểu phẫu triệt sản đến phẫu thuật xử lý chấn thương',
    badgeLabel: 'Ngoại khoa',
  },
  {
    id: 'noi-tru',
    isMock: true,
    name: 'Chăm sóc nội trú',
    shortDesc: 'Lưu trú theo dõi y tế sau phẫu thuật hoặc gửi chăm sóc thú cưng định kỳ',
    badgeLabel: 'Lưu trú',
  },
  {
    id: 'spa',
    isMock: true,
    name: 'Spa & Grooming',
    shortDesc: 'Tắm vệ sinh, cắt tỉa lông móng và chăm sóc ngoại hình sạch sẽ, dịu nhẹ',
    badgeLabel: 'Grooming',
  },
  {
    id: 'dich-vu-khac',
    isMock: true,
    name: 'Dự phòng & Khác',
    shortDesc: 'Tiêm phòng vaccine, tẩy giun sán định kỳ và thủ tục hồ sơ theo dõi sức khỏe',
    badgeLabel: 'Dự phòng',
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
    applicableFor: 'Chó & mèo mọi lứa tuổi',
    executionTime: 'Khoảng 20 – 30 phút',
    notes: 'Bác sĩ trao đổi trực tiếp với chủ nuôi về thói quen sinh hoạt và lịch sử tiêm phòng của bé.',
  },
  {
    id: 'price-kham-02',
    isMock: true,
    categoryId: 'kham-dieu-tri',
    name: 'Tái khám theo dõi theo chỉ định bác sĩ',
    shortDesc: 'Đánh giá tiến triển hồi phục sau đợt điều trị hoặc kiểm tra phản ứng sau khi dùng thuốc.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng đang trong phác đồ theo dõi',
    executionTime: 'Khoảng 15 – 25 phút',
    notes: 'Gia đình nên mang theo sổ khám hoặc đơn thuốc cũ để bác sĩ đối chiếu chỉ số.',
  },
  {
    id: 'price-kham-03',
    isMock: true,
    categoryId: 'kham-dieu-tri',
    name: 'Khám chuyên sâu da liễu & tai mũi họng',
    shortDesc: 'Soi kính hiển vi tìm nấm, ký sinh trùng tai, kiểm tra tổn thương da và biểu hiện ngứa rát kéo dài.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng có biểu hiện viêm da, rụng lông hoặc ngứa tai',
    executionTime: 'Khoảng 30 – 45 phút',
    notes: 'Hạn chế tắm hoặc bôi thuốc mỡ lên vùng da tổn thương trước khi đưa bé đến khám.',
  },

  // 2. Cận lâm sàng: X-quang, Siêu âm, Xét nghiệm
  {
    id: 'price-cls-01',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Chụp X-quang kỹ thuật số (1 tư thế)',
    shortDesc: 'Khảo sát hình thái xương khớp, lồng ngực hoặc ổ bụng theo vùng chỉ định thăm khám.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Theo chỉ định thăm khám trực tiếp của bác sĩ',
    executionTime: 'Khoảng 15 – 20 phút',
    notes: 'Hỗ trợ cố định tư thế êm ái, giảm tối đa căng thẳng và phản xạ giật mình của thú cưng.',
  },
  {
    id: 'price-cls-02',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Chụp X-quang kỹ thuật số (2 tư thế tiêu chuẩn)',
    shortDesc: 'Ghi nhận hình ảnh đa góc độ vùng ngực hoặc bụng phục vụ đánh giá giải phẫu chuẩn xác hơn.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Theo chỉ định chẩn đoán hình ảnh',
    executionTime: 'Khoảng 20 – 30 phút',
    notes: 'Bác sĩ giải thích phim chụp trực tiếp cho chủ nuôi ngay sau khi xử lý kỹ thuật số.',
  },
  {
    id: 'price-cls-03',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Siêu âm ổ bụng tổng quát thú cưng',
    shortDesc: 'Khảo sát cấu trúc gan, thận, bàng quang, lách và tử cung buồng trứng qua đầu dò chuyên dụng.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó & mèo cần kiểm tra tạng phủ ổ bụng',
    executionTime: 'Khoảng 20 – 30 phút',
    notes: 'Nên cạo nhẹ lông vùng bụng và cho bé nhịn ăn nhẹ khoảng 4–6 tiếng nếu có hẹn trước.',
  },
  {
    id: 'price-cls-04',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Xét nghiệm huyết học tổng quát (Công thức máu)',
    shortDesc: 'Đánh giá các chỉ số hồng cầu, bạch cầu, tiểu cầu nhằm phát hiện sớm tình trạng thiếu máu hoặc viêm nhiễm.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thăm khám định kỳ hoặc chuẩn bị trước can thiệp ngoại khoa',
    executionTime: 'Khoảng 20 – 30 phút',
    notes: 'Lấy lượng máu nhỏ an toàn từ tĩnh mạch chân hoặc cổ, kết quả được phân tích tự động.',
  },
  {
    id: 'price-cls-05',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Xét nghiệm sinh hóa máu đánh giá chức năng gan/thận',
    shortDesc: 'Kiểm tra các chỉ số men gan (ALT, AST), thận (Urea, Creatinine), đường huyết và điện giải.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng lớn tuổi, điều trị dài ngày hoặc tiền phẫu',
    executionTime: 'Khoảng 30 – 45 phút',
    notes: 'Cần nhịn ăn 6–8 tiếng trước khi lấy mẫu để bảo đảm tính chuẩn xác của các chỉ số sinh hóa.',
  },
  {
    id: 'price-cls-06',
    isMock: true,
    categoryId: 'can-lam-sang',
    name: 'Test nhanh phát hiện kháng nguyên bệnh truyền nhiễm',
    shortDesc: 'Sàng lọc nhanh virus nguy hiểm như Parvovirus, Care (ở chó) hoặc Giảm bạch cầu FPV (ở mèo).',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng có biểu hiện nôn mửa, tiêu chảy ra máu hoặc sốt li bì',
    executionTime: 'Khoảng 15 – 20 phút',
    notes: 'Thực hiện ngay khi tiếp nhận cấp cứu để kịp thời cách ly và áp dụng phác đồ điều trị hỗ trợ.',
  },

  // 3. Phẫu thuật ngoại khoa
  {
    id: 'price-pt-01',
    isMock: true,
    categoryId: 'phau-thuat',
    name: 'Phẫu thuật triệt sản mèo đực',
    shortDesc: 'Thủ thuật ngoại khoa nhanh, xâm lấn tối thiểu, giúp giảm thói quen đi hoang và đánh dấu lãnh thổ.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Mèo đực từ 6 tháng tuổi, thể trạng khỏe mạnh',
    executionTime: 'Khoảng 30 – 45 phút',
    notes: 'Bé cần được nhịn ăn 6–8 tiếng trước gây mê và kiểm tra thể trạng tiền phẫu cùng bác sĩ.',
  },
  {
    id: 'price-pt-02',
    isMock: true,
    categoryId: 'phau-thuat',
    name: 'Phẫu thuật triệt sản mèo cái',
    shortDesc: 'Phẫu thuật cắt bỏ buồng trứng/tử cung qua đường mổ nhỏ, khâu thẩm mỹ chỉ tự tiêu.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Mèo cái từ 6 tháng tuổi, không trong chu kỳ động dục rộ',
    executionTime: 'Khoảng 45 – 60 phút',
    notes: 'Chăm sóc hậu phẫu cần đeo vòng chống liếm hoặc áo bảo hộ vết mổ trong 7–10 ngày.',
  },
  {
    id: 'price-pt-03',
    isMock: true,
    categoryId: 'phau-thuat',
    name: 'Phẫu thuật triệt sản chó (Theo phân loại thể trọng)',
    shortDesc: 'Can thiệp ngoại khoa triệt sản cho chó đực hoặc chó cái với quy trình tiền mê và theo dõi hô hấp an toàn.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó từ 6 tháng tuổi, phân loại theo nhóm cân nặng',
    executionTime: 'Khoảng 60 – 90 phút',
    notes: 'Bắt buộc kiểm tra công thức máu và đông máu cơ bản trước khi tiến hành thủ thuật.',
  },
  {
    id: 'price-pt-04',
    isMock: true,
    categoryId: 'phau-thuat',
    name: 'Xử lý vết thương phần mềm & khâu phục hồi',
    shortDesc: 'Làm sạch mô hoại tử, khử trùng sâu và khâu tái tạo mép da sau tai nạn hoặc cắn xé.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Vết rách da, trầy xước sâu hoặc áp-xe dưới da',
    executionTime: 'Tùy mức độ tổn thương thực tế',
    notes: 'Trường hợp có chảy máu nhiều được tiếp nhận ưu tiên theo quy trình cấp cứu ngoại khoa khẩn.',
  },

  // 4. Chăm sóc Nội trú
  {
    id: 'price-nt-01',
    isMock: true,
    categoryId: 'noi-tru',
    name: 'Lưu trú theo dõi y tế sau phẫu thuật (Theo ngày)',
    shortDesc: 'Bố trí ô lưu trú yên tĩnh, theo dõi hồi tỉnh sau gây mê, kiểm tra vết mổ và chăm sóc sinh hoạt.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng vừa hoàn thành can thiệp ngoại khoa',
    executionTime: 'Tính theo chu kỳ 24h lưu viện',
    notes: 'Bao gồm chăm sóc vệ sinh ô lưu trú, cấp nước sạch và bữa ăn nhẹ phù hợp đường tiêu hóa.',
  },
  {
    id: 'price-nt-02',
    isMock: true,
    categoryId: 'noi-tru',
    name: 'Lưu trú chăm sóc thú cưng định kỳ khi gia đình bận',
    shortDesc: 'Tiếp nhận thú cưng lưu lại cơ sở khi chủ nuôi đi công tác hoặc du lịch, cho ăn và vận động theo nếp sinh hoạt.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó & mèo khỏe mạnh đã tiêm phòng đầy đủ',
    executionTime: 'Theo thỏa thuận thời gian gửi của gia đình',
    notes: 'Chủ nuôi mang theo thức ăn quen thuộc của bé và trao đổi thói quen cá nhân tại quầy tiếp đón.',
  },

  // 5. Spa & Grooming
  {
    id: 'price-spa-01',
    isMock: true,
    categoryId: 'spa',
    name: 'Gói tắm vệ sinh & sấy chải mềm mượt cơ bản',
    shortDesc: 'Làm ướt ấm, tắm sạch dịu nhẹ với sữa tắm chuyên dụng, sấy khô kết hợp chải tơi phồng lông.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Phân loại theo cân nặng và độ dày lông của bé',
    executionTime: 'Khoảng 45 – 75 phút',
    notes: 'Nên đặt hẹn trước qua hotline để nhân sự grooming sắp xếp khung giờ phục vụ chu đáo.',
  },
  {
    id: 'price-spa-02',
    isMock: true,
    categoryId: 'spa',
    name: 'Chăm sóc chi tiết: Vệ sinh tai, cắt móng & tỉa lông đệm bàn chân',
    shortDesc: 'Làm sạch ống tai ngoài, bấm gọn đầu móng chống trầy xước và cạo lông đệm chân chống trơn trượt.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó & mèo cần vệ sinh định kỳ các vùng nhạy cảm',
    executionTime: 'Khoảng 20 – 30 phút',
    notes: 'Thực hiện bằng thao tác ân cần, giúp các bé nhát người không bị hoảng sợ.',
  },
  {
    id: 'price-spa-03',
    isMock: true,
    categoryId: 'spa',
    name: 'Cắt tỉa lông tạo phom thẩm mỹ theo yêu cầu',
    shortDesc: 'Tỉa gọn gàng toàn thân hoặc tạo kiểu phom dáng tròn trịa, gọn gàng phù hợp sinh hoạt gia đình.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó mèo lông dài (Poodle, Phốc sóc, Mèo Anh lông dài...)',
    executionTime: 'Khoảng 90 – 120 phút',
    notes: 'Trao đổi mong muốn về độ dài lông cùng chuyên viên trước khi bắt đầu cắt tỉa.',
  },

  // 6. Dự phòng & Khác
  {
    id: 'price-dp-01',
    isMock: true,
    categoryId: 'dich-vu-khac',
    name: 'Tiêm vaccine phòng bệnh tổng hợp cho chó/mèo',
    shortDesc: 'Khám sàng lọc thể trạng trước tiêm, sử dụng vaccine chính hãng bảo quản lạnh đúng quy chuẩn.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Thú cưng từ 2 tháng tuổi, hoàn toàn khỏe mạnh',
    executionTime: 'Khoảng 15 – 25 phút (bao gồm theo dõi sau tiêm)',
    notes: 'Cần giữ bé ở lại phòng khám theo dõi phản ứng dị ứng khoảng 15–20 phút sau mũi tiêm.',
  },
  {
    id: 'price-dp-02',
    isMock: true,
    categoryId: 'dich-vu-khac',
    name: 'Tẩy giun sán định kỳ & nhỏ gáy trị ve rận',
    shortDesc: 'Cân trọng lượng chính xác, cho uống thuốc tẩy giun hoặc nhỏ thuốc trị ngoại ký sinh trùng an toàn.',
    priceStatus: 'Liên hệ để biết giá',
    applicableFor: 'Chó & mèo định kỳ 1–3 tháng/lần tùy môi trường sống',
    executionTime: 'Khoảng 10 – 15 phút',
    notes: 'Không tắm cho thú cưng trong vòng 48 giờ sau khi nhỏ thuốc ngoài da.',
  },
  {
    id: 'price-dp-03',
    isMock: true,
    categoryId: 'dich-vu-khac',
    name: 'Cấp sổ theo dõi sức khỏe & kiểm tra vi chất',
    shortDesc: 'Ghi nhận toàn bộ lịch tiêm chủng, tẩy giun, thể trọng qua các giai đoạn phát triển của bé.',
    priceStatus: 'Chưa cập nhật',
    applicableFor: 'Thú cưng mới đón về nuôi hoặc chuyển đổi cơ sở chăm sóc',
    executionTime: 'Khoảng 10 – 15 phút',
    notes: 'Hỗ trợ chủ nuôi dễ dàng ghi nhớ mốc thời gian tiêm nhắc lại hàng năm.',
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
    question: 'Làm thế nào để nhận báo giá chi tiết trước khi đưa thú cưng đến viện?',
    answer: `Quý khách vui lòng liên hệ trực tiếp qua hotline ${HOSPITAL_CONTACT.hotlineDisplay} hoặc trao đổi tại quầy tiếp đón ${HOSPITAL_CONTACT.address}. Đội ngũ tư vấn sẽ lắng nghe mô tả thể trạng của bé và cung cấp khoảng giá tham chiếu phù hợp nhất.`,
  },
  {
    id: 'pricing-faq-3',
    isMock: true,
    question: 'Trường hợp cấp cứu ngoài giờ có áp dụng phụ phí không?',
    answer: `Bệnh viện Thú y Lê Sơn duy trì tiếp nhận cấp cứu khẩn cấp 24/24 qua hotline ${HOSPITAL_CONTACT.hotlineDisplay}. Mọi thông tin về chi phí xử lý cấp cứu ban đầu sẽ được bác sĩ trực trao đổi minh bạch với chủ nuôi ngay khi tiếp nhận bé tại phòng khám.`,
  },
]
