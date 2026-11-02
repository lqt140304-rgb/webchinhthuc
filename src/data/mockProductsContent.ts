import { HOSPITAL_CONTACT } from '@/config/contact'

// ============================================================================
// PHASE 3 / BATCH 3A — DỮ LIỆU MINH HỌA SẢN PHẨM & DINH DƯỠNG (/san-pham)
// Tuân thủ: Master Prompt V2.0 & Baseline Kiến trúc 2026
// Mọi thông tin đều mang cờ isMock: true.
// Tuyệt đối không đưa thuốc kê đơn/kháng sinh vào danh mục bán trực tiếp.
// Không giả lập giỏ hàng, thanh toán hoặc đánh giá ảo.
// ============================================================================

export interface MockProductItem {
  readonly id: string
  readonly isMock: true
  readonly name: string
  readonly categoryId: string
  readonly categoryName: string
  readonly image: string
  readonly imageAlt: string
  readonly summary: string
  readonly priceStatus: 'Liên hệ để biết giá' | 'Đang cập nhật'
  readonly targetPet: string
  readonly isFeatured?: boolean
  readonly highlights: readonly string[]
  readonly usageGuide: string
  readonly consultationNote: string
}

export interface MockProductCategory {
  readonly id: string
  readonly isMock: true
  readonly name: string
  readonly description: string
  readonly countLabel: string
}

export const MOCK_PRODUCTS_EDITORIAL_NOTICE =
  'Danh mục sản phẩm, dinh dưỡng và phụ kiện dưới đây là nội dung minh họa — đang cập nhật dữ liệu thực tế. Bệnh viện Thú y Lê Sơn không cung cấp tính năng đặt mua trực tuyến hoặc thanh toán qua website. Quý khách vui lòng liên hệ hotline 097 355 51 05 hoặc trao đổi trực tiếp tại quầy tiếp đón 101 Khuất Duy Tiến để kiểm tra tình trạng hàng và được tư vấn phù hợp với thể trạng bé.'

export const MOCK_PRODUCT_CATEGORIES: readonly MockProductCategory[] = [
  {
    id: 'dinh-duong',
    isMock: true,
    name: 'Dinh dưỡng & Thức ăn',
    description: 'Thức ăn hạt cân bằng, pate giàu đạm và dinh dưỡng hỗ trợ phục hồi cho chó mèo',
    countLabel: '3 sản phẩm minh họa',
  },
  {
    id: 'cham-soc-ve-sinh',
    isMock: true,
    name: 'Vệ sinh & Chăm sóc lông da',
    description: 'Sữa tắm dịu nhẹ, dung dịch vệ sinh tai mắt và dụng cụ chải lông chuyên dụng',
    countLabel: '3 sản phẩm minh họa',
  },
  {
    id: 'phu-kien',
    isMock: true,
    name: 'Phụ kiện & Đồ dùng tiện ích',
    description: 'Bát ăn chống gù, đệm nằm êm ái và túi vận chuyển thông thoáng tiêu chuẩn an toàn',
    countLabel: '3 sản phẩm minh họa',
  },
  {
    id: 'bo-sung-suc-khoe',
    isMock: true,
    name: 'Bổ sung vi chất & Răng miệng',
    description: 'Gel dinh dưỡng cao năng lượng, men vi sinh đường ruột và sản phẩm chăm sóc men răng',
    countLabel: '3 sản phẩm minh họa',
  },
]

export const MOCK_PRODUCTS: readonly MockProductItem[] = [
  // 1. Dinh dưỡng & Thức ăn
  {
    id: 'prod-dd-01',
    isMock: true,
    name: 'Pate dinh dưỡng phục hồi thể trạng thú cưng',
    categoryId: 'dinh-duong',
    categoryName: 'Dinh dưỡng & Thức ăn',
    image: '/images/article-nutrition.webp',
    imageAlt: 'Pate dinh dưỡng phục hồi thể trạng thú cưng (Ảnh minh họa)',
    summary: 'Công thức giàu năng lượng và protein dễ tiêu hóa, hỗ trợ thú cưng sau ốm, mổ hoặc biếng ăn.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo cần phục hồi',
    isFeatured: true,
    highlights: [
      'Đậm độ năng lượng cao giúp bù đắp calo nhanh chóng',
      'Kết cấu nhuyễn mịn, có thể cho ăn trực tiếp hoặc qua xi-lanh',
      'Hương vị hấp dẫn tự nhiên, kích thích khứu giác và sự thèm ăn',
    ],
    usageGuide: 'Cho ăn trực tiếp hoặc trộn cùng thức ăn hạt theo lượng khuyến nghị của bác sĩ dựa trên cân nặng của bé.',
    consultationNote: 'Nên tham khảo ý kiến bác sĩ khi thú cưng có tiền sử viêm tụy hoặc suy thận cấp.',
  },
  {
    id: 'prod-dd-02',
    isMock: true,
    name: 'Hạt dinh dưỡng cân bằng cho mèo trưởng thành',
    categoryId: 'dinh-duong',
    categoryName: 'Dinh dưỡng & Thức ăn',
    image: '/images/hero-happy-cat.webp',
    imageAlt: 'Hạt dinh dưỡng cân bằng cho mèo trưởng thành (Ảnh minh họa)',
    summary: 'Dinh dưỡng hằng ngày cân đối chất đạm, chất xơ tự nhiên và khoáng chất bảo vệ đường tiết niệu.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Mèo từ 12 tháng tuổi',
    isFeatured: true,
    highlights: [
      'Chất xơ hòa tan hỗ trợ đào thải búi lông qua đường tiêu hóa',
      'Kiểm soát hàm lượng khoáng chất (Magie, Phốt pho) bảo vệ thận',
      'Bổ sung Taurine tự nhiên cho thị lực tinh anh và cơ tim khỏe',
    ],
    usageGuide: 'Chia làm 2–3 bữa trong ngày. Luôn chuẩn bị sẵn bát nước sạch bên cạnh khay thức ăn.',
    consultationNote: 'Với mèo triệt sản hoặc ít vận động, nên kiểm soát định lượng để tránh thừa cân.',
  },
  {
    id: 'prod-dd-03',
    isMock: true,
    name: 'Hạt dinh dưỡng chăm sóc da lông cho chó cưng',
    categoryId: 'dinh-duong',
    categoryName: 'Dinh dưỡng & Thức ăn',
    image: '/images/why-pet-companion.webp',
    imageAlt: 'Hạt dinh dưỡng chăm sóc da lông cho chó cưng (Ảnh minh họa)',
    summary: 'Công thức giàu Omega-3 & Omega-6 từ dầu cá hồi, hỗ trợ nang lông chắc khỏe và giảm gãy rụng.',
    priceStatus: 'Đang cập nhật',
    targetPet: 'Chó lông dài & da nhạy cảm',
    isFeatured: false,
    highlights: [
      'Nguồn đạm từ thịt gia cầm và cá hồi tự nhiên ít gây dị ứng',
      'Axit béo thiết yếu nuôi dưỡng biểu bì da ẩm mịn',
      'Kích thước hạt phù hợp với cơ hàm giúp làm sạch mảng bám cơ học',
    ],
    usageGuide: 'Chuyển đổi thức ăn từ từ trong 7 ngày bằng cách tăng dần tỷ lệ hạt mới vào khẩu phần cũ.',
    consultationNote: 'Nếu bé có biểu hiện gãi ngứa do dị ứng thức ăn, cần khám lâm sàng để xác định căn nguyên.',
  },

  // 2. Vệ sinh & Chăm sóc lông da
  {
    id: 'prod-vs-01',
    isMock: true,
    name: 'Sữa tắm thảo dược dịu nhẹ cho da nhạy cảm',
    categoryId: 'cham-soc-ve-sinh',
    categoryName: 'Vệ sinh & Chăm sóc lông da',
    image: '/images/service-spa.webp',
    imageAlt: 'Sữa tắm thảo dược dịu nhẹ cho da nhạy cảm (Ảnh minh họa)',
    summary: 'Chiết xuất từ yến mạch và hoa cúc La Mã, độ pH 6.5 sinh học phù hợp cho da chó mèo.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo mọi lứa tuổi',
    isFeatured: true,
    highlights: [
      'Không chứa cồn, paraben hoặc hương liệu tổng hợp nồng gắt',
      'Làm sạch bụi bẩn nhẹ nhàng, giữ lại lớp dầu tự nhiên bảo vệ lông',
      'Hương thơm thảo mộc thoang thoảng giúp thú cưng thư giãn khi tắm',
    ],
    usageGuide: 'Làm ướt lông bằng nước ấm, xoa đều sữa tắm đã pha loãng, massage 5–7 phút rồi xả sạch hoàn toàn.',
    consultationNote: 'Tránh để bọt xà phòng tiếp xúc trực tiếp vào mắt và ống tai của thú cưng.',
  },
  {
    id: 'prod-vs-02',
    isMock: true,
    name: 'Dung dịch vệ sinh tai kháng khuẩn thú y',
    categoryId: 'cham-soc-ve-sinh',
    categoryName: 'Vệ sinh & Chăm sóc lông da',
    image: '/images/hero-clinic-cuddle.webp',
    imageAlt: 'Dung dịch vệ sinh tai kháng khuẩn thú y (Ảnh minh họa)',
    summary: 'Làm mềm và tan ráy tai tích tụ, khử mùi hôi khó chịu và ức chế nấm mốc trong vành tai.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo tai cụp hoặc nhiều ráy',
    isFeatured: false,
    highlights: [
      'Dạng dung dịch dịu mát, không gây xót rát khi nhỏ vào vành tai',
      'Cơ chế tự bay hơi nhẹ giúp ống tai luôn khô thoáng sau khi lau',
      'Hỗ trợ phòng ngừa các đợt viêm tai tái phát ở các giống tai dài',
    ],
    usageGuide: 'Nhỏ 3–5 giọt vào ống tai, xoa nhẹ gốc tai khoảng 30 giây rồi dùng bông gòn mềm lau sạch chất bẩn trào ra.',
    consultationNote: 'Tuyệt đối không dùng tăm bông chọc sâu vào ống tai gây tổn thương màng nhĩ.',
  },
  {
    id: 'prod-vs-03',
    isMock: true,
    name: 'Lược chải lông và gỡ rối chuyên dụng',
    categoryId: 'cham-soc-ve-sinh',
    categoryName: 'Vệ sinh & Chăm sóc lông da',
    image: '/images/service-spa.webp',
    imageAlt: 'Lược chải lông và gỡ rối chuyên dụng (Ảnh minh họa)',
    summary: 'Răng thép không gỉ bo tròn đầu êm ái, hỗ trợ chải tơi lông rụng và gỡ búi rối cơ bản tại nhà.',
    priceStatus: 'Đang cập nhật',
    targetPet: 'Chó & Mèo lông vừa đến dài',
    isFeatured: false,
    highlights: [
      'Đầu răng lược được mài nhẵn, không cào xước biểu bì da',
      'Tay cầm bọc cao su chống trượt tạo cảm giác cầm nắm chắc chắn',
      'Loại bỏ lớp lông chết tích tụ, hạn chế tình trạng mèo nuốt búi lông',
    ],
    usageGuide: 'Chải nhẹ nhàng theo chiều mọc của lông mỗi ngày từ 5–10 phút, tập trung vào vùng ngực, nách và đuôi.',
    consultationNote: 'Nếu lông bị vón cục bết chặt sát da, nên đưa bé đến phòng Spa để được xử lý an toàn bằng máy cạo.',
  },

  // 3. Phụ kiện & Đồ dùng tiện ích
  {
    id: 'prod-pk-01',
    isMock: true,
    name: 'Bát ăn inox đôi nâng góc nghiêng 15 độ chống gù',
    categoryId: 'phu-kien',
    categoryName: 'Phụ kiện & Đồ dùng tiện ích',
    image: '/images/article-nutrition.webp',
    imageAlt: 'Bát ăn inox đôi nâng góc nghiêng 15 độ chống gù (Ảnh minh họa)',
    summary: 'Thiết kế độ cao hợp lý giảm áp lực lên đốt sống cổ và hỗ trợ tiêu hóa thức ăn thuận lợi hơn.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó nhỏ & Mèo',
    isFeatured: true,
    highlights: [
      'Lòng bát bằng Inox 304 tiêu chuẩn an toàn thực phẩm, dễ tháo rửa',
      'Chân đế nhựa ABS cứng cáp kèm đệm cao su chống xô lệch khi ăn',
      'Góc nghiêng 15 độ giúp thú cưng không phải cúi gập cổ quá sâu',
    ],
    usageGuide: 'Đặt khay tại vị trí bằng phẳng, cố định và vệ sinh bát ăn hằng ngày sau mỗi bữa.',
    consultationNote: 'Phù hợp đặc biệt với các bé mèo mặt tịt hoặc thú cưng có vấn đề về khớp cổ.',
  },
  {
    id: 'prod-pk-02',
    isMock: true,
    name: 'Đệm nằm ấm áp cách nhiệt chống thấm đáy',
    categoryId: 'phu-kien',
    categoryName: 'Phụ kiện & Đồ dùng tiện ích',
    image: '/images/service-inpatient.webp',
    imageAlt: 'Đệm nằm ấm áp cách nhiệt chống thấm đáy (Ảnh minh họa)',
    summary: 'Chất liệu nỉ nhung êm ái kết hợp bông xơ đàn hồi cao, giữ ấm cho bé trong những ngày trở gió.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo dưới 10kg',
    isFeatured: false,
    highlights: [
      'Mặt đáy hạt cao su chống trượt và chống thấm ẩm từ sàn nhà',
      'Thành đệm êm nhô cao tạo điểm tựa đầu thoải mái cho giấc ngủ sâu',
      'Vỏ ngoài có khóa kéo tiện lợi, có thể tháo rời để giặt máy',
    ],
    usageGuide: 'Đặt đệm ở góc phòng yên tĩnh, tránh luồng gió lùa trực tiếp hoặc ánh nắng gắt.',
    consultationNote: 'Vệ sinh đệm định kỳ 1–2 tuần/lần để ngăn ngừa bụi bẩn và bọ chét ẩn nấp.',
  },
  {
    id: 'prod-pk-03',
    isMock: true,
    name: 'Túi vận chuyển thú cưng thông thoáng tiêu chuẩn an toàn',
    categoryId: 'phu-kien',
    categoryName: 'Phụ kiện & Đồ dùng tiện ích',
    image: '/images/why-pet-companion.webp',
    imageAlt: 'Túi vận chuyển thú cưng thông thoáng tiêu chuẩn an toàn (Ảnh minh họa)',
    summary: 'Thiết kế khung giữ phom vững chãi, lưới thoáng khí 4 chiều và quai đeo chịu lực êm ái.',
    priceStatus: 'Đang cập nhật',
    targetPet: 'Thú cưng dưới 7kg',
    isFeatured: false,
    highlights: [
      'Lưới nhựa chịu lực chống cào xước, lưu thông không khí tối ưu',
      'Dây móc khóa an toàn bên trong gắn vào vòng cổ chống nhảy ra ngoài',
      'Có thể gấp gọn tiết kiệm không gian khi không sử dụng',
    ],
    usageGuide: 'Lót thêm khăn quen thuộc của bé bên trong để tạo mùi hương an tâm khi di chuyển ngoài đường.',
    consultationNote: 'Khi đưa bé đi khám hoặc cấp cứu, luôn cài khóa an toàn cẩn thận trước khi ra khỏi nhà.',
  },

  // 4. Bổ sung vi chất & Răng miệng
  {
    id: 'prod-bs-01',
    isMock: true,
    name: 'Gel dinh dưỡng cao năng lượng & Vitamin tổng hợp',
    categoryId: 'bo-sung-suc-khoe',
    categoryName: 'Bổ sung vi chất & Răng miệng',
    image: '/images/article-prevention.webp',
    imageAlt: 'Gel dinh dưỡng cao năng lượng & Vitamin tổng hợp (Ảnh minh họa)',
    summary: 'Bổ sung nhanh chóng vitamin nhóm B, A, D, E và khoáng chất cho thú cưng suy nhược, gầy yếu.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo mọi lứa tuổi',
    isFeatured: true,
    highlights: [
      'Cung cấp năng lượng tức thì mà không làm quá tải hệ tiêu hóa',
      'Vị mạch nha thơm ngon dễ uống, bé tự giác liếm từ ngón tay',
      'Hỗ trợ phục hồi thể lực sau tiêm phòng hoặc giai đoạn cai sữa',
    ],
    usageGuide: 'Cho ăn khoảng 1–2 thìa cà phê mỗi ngày trực tiếp hoặc trộn vào thức ăn.',
    consultationNote: 'Sản phẩm là thực phẩm bổ sung vi chất, không thay thế hoàn toàn khẩu phần ăn chính.',
  },
  {
    id: 'prod-bs-02',
    isMock: true,
    name: 'Gel làm sạch mảng bám men răng hương thịt tự nhiên',
    categoryId: 'bo-sung-suc-khoe',
    categoryName: 'Bổ sung vi chất & Răng miệng',
    image: '/images/hero-happy-cat.webp',
    imageAlt: 'Gel làm sạch mảng bám men răng hương thịt tự nhiên (Ảnh minh họa)',
    summary: 'Chứa enzyme sinh học hỗ trợ phân giải thức ăn thừa, kiểm soát vôi răng và giữ hơi thở thơm tho.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo từ 6 tháng tuổi',
    isFeatured: false,
    highlights: [
      'Không cần súc miệng lại bằng nước, an toàn tuyệt đối khi nuốt',
      'Hương vị hấp dẫn khiến thú cưng hợp tác khi vệ sinh khoang miệng',
      'Làm mềm vôi răng mới hình thành, hạn chế nguy cơ tụt lợi viêm nướu',
    ],
    usageGuide: 'Tra 1 lượng nhỏ gel lên kẽ răng và nướu của bé vào buổi tối sau khi ăn.',
    consultationNote: 'Với trường hợp vôi răng đã đóng tảng cứng dày, cần đưa bé đến phòng khám để bác sĩ lấy vôi răng siêu âm.',
  },
  {
    id: 'prod-bs-03',
    isMock: true,
    name: 'Men vi sinh sống hỗ trợ đường ruột & hấp thu',
    categoryId: 'bo-sung-suc-khoe',
    categoryName: 'Bổ sung vi chất & Răng miệng',
    image: '/images/article-firstaid.webp',
    imageAlt: 'Men vi sinh sống hỗ trợ đường ruột & hấp thu (Ảnh minh họa)',
    summary: 'Bổ sung hàng tỷ lợi khuẩn có lợi, cân bằng hệ vi sinh đường ruột khi đổi thức ăn hoặc sau khi dùng kháng sinh.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo tiêu hóa kém',
    isFeatured: false,
    highlights: [
      'Chủng lợi khuẩn bền nhiệt và kháng axit dạ dày hiệu quả',
      'Giảm thiểu tình trạng phân lỏng, đầy bụng và mùi hôi chất thải',
      'Hỗ trợ nâng cao sức đề kháng đường tiêu hóa tự nhiên',
    ],
    usageGuide: 'Rắc trực tiếp vào thức ăn hoặc pha với nước ấm (dưới 40°C) cho bé uống hằng ngày.',
    consultationNote: 'Nếu dùng kèm kháng sinh, nên uống cách thời điểm dùng kháng sinh tối thiểu 2 tiếng.',
  },
]

export const MOCK_PRODUCT_FAQS: readonly {
  readonly id: string
  readonly isMock: true
  readonly question: string
  readonly answer: string
}[] = [
  {
    id: 'prod-faq-1',
    isMock: true,
    question: 'Bệnh viện Thú y Lê Sơn có bán sản phẩm trực tuyến giao hàng tận nhà không?',
    answer:
      'Hiện tại, Bệnh viện Thú y Lê Sơn tập trung vào công tác khám chữa bệnh chuyên sâu và cung cấp sản phẩm dinh dưỡng, phụ kiện trực tiếp tại quầy cơ sở 101 Khuất Duy Tiến. Website không có chức năng đặt hàng hay thanh toán trực tuyến.',
  },
  {
    id: 'prod-faq-2',
    isMock: true,
    question: 'Làm thế nào để biết một loại thức ăn hoặc sản phẩm có phù hợp với bé không?',
    answer: `Mỗi thú cưng có thể trạng, độ tuổi và mức độ nhạy cảm đường ruột khác nhau. Quý khách có thể trao đổi trực tiếp với bác sĩ trong buổi khám hoặc liên hệ hotline ${HOSPITAL_CONTACT.hotlineDisplay} để được tư vấn dòng sản phẩm dinh dưỡng phù hợp nhất.`,
  },
  {
    id: 'prod-faq-3',
    isMock: true,
    question: 'Bệnh viện có bán các loại thuốc điều trị theo đơn trên website không?',
    answer:
      'Theo quy chuẩn y tế và đạo đức hành nghề thú y, toàn bộ thuốc điều trị và kháng sinh chỉ được kê đơn và xuất kho sau khi bác sĩ thăm khám lâm sàng trực tiếp cho thú cưng tại phòng khám. Bệnh viện tuyệt đối không kinh doanh thuốc kê đơn dưới dạng hàng hóa thương mại điện tử.',
  },
]
