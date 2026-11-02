import { HOSPITAL_CONTACT } from '@/config/contact'

// ============================================================================
// PHASE 3 / BATCH 3A — DỮ LIỆU MINH HỌA SẢN PHẨM & DINH DƯỠNG (/san-pham)
// Tuân thủ: Master Prompt V2.0 & Baseline Kiến trúc 2026
// Mọi thông tin đều mang cờ isMock: true.
// Tuyệt đối không đưa thuốc kê đơn/kháng sinh vào danh mục bán trực tiếp.
// Không tuyên bố sản phẩm thực sự đang kinh doanh tại bệnh viện.
// Không giả lập giỏ hàng, thanh toán, đánh giá ảo hoặc đưa ra chỉ dẫn y khoa.
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
  'Danh mục sản phẩm minh họa — chưa xác nhận hàng hóa đang kinh doanh. Bệnh viện Thú y Lê Sơn chưa triển khai bán hàng hoặc nhận thanh toán trực tuyến qua website, đồng thời chưa xác nhận danh mục hàng hóa kinh doanh thực tế tại quầy. Mọi thông tin hình ảnh và mô tả dưới đây là dữ liệu minh họa giao diện. Quý khách vui lòng liên hệ hotline 097 355 51 05 để được hỗ trợ thông tin chính xác.'

export const MOCK_PRODUCT_CATEGORIES: readonly MockProductCategory[] = [
  {
    id: 'dinh-duong',
    isMock: true,
    name: 'Dinh dưỡng & Thức ăn',
    description: 'Thức ăn hạt cân bằng, pate và dinh dưỡng hỗ trợ cho chó mèo',
    countLabel: '3 sản phẩm minh họa',
  },
  {
    id: 'cham-soc-ve-sinh',
    isMock: true,
    name: 'Vệ sinh & Chăm sóc lông da',
    description: 'Sữa tắm dịu nhẹ, dung dịch vệ sinh và dụng cụ chải lông chuyên dụng',
    countLabel: '3 sản phẩm minh họa',
  },
  {
    id: 'phu-kien',
    isMock: true,
    name: 'Phụ kiện & Đồ dùng tiện ích',
    description: 'Bát ăn nâng độ cao, đệm nằm êm ái và túi vận chuyển thông thoáng an toàn',
    countLabel: '3 sản phẩm minh họa',
  },
  {
    id: 'bo-sung-suc-khoe',
    isMock: true,
    name: 'Bổ sung vi chất & Răng miệng',
    description: 'Gel dinh dưỡng bổ sung, men vi sinh và sản phẩm chăm sóc men răng cho thú cưng',
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
    summary: 'Dòng sản phẩm thức ăn ướt dạng pate, cung cấp dinh dưỡng bổ sung cho khẩu phần ăn của chó và mèo.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo cần bổ sung dinh dưỡng',
    isFeatured: true,
    highlights: [
      'Dạng thức ăn ướt mềm xốp, thích hợp cho khẩu phần ăn của thú cưng',
      'Được chế biến từ nguồn nguyên liệu chọn lọc dành cho chó và mèo',
      'Hương vị tự nhiên, dễ kết hợp trong bữa ăn hằng ngày của bé',
    ],
    usageGuide: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn chế độ dinh dưỡng phù hợp.',
    consultationNote: 'Vui lòng tham khảo ý kiến bác sĩ thú y trước khi thay đổi chế độ dinh dưỡng cho thú cưng.',
  },
  {
    id: 'prod-dd-02',
    isMock: true,
    name: 'Hạt dinh dưỡng cân bằng cho mèo trưởng thành',
    categoryId: 'dinh-duong',
    categoryName: 'Dinh dưỡng & Thức ăn',
    image: '/images/hero-happy-cat.webp',
    imageAlt: 'Hạt dinh dưỡng cân bằng cho mèo trưởng thành (Ảnh minh họa)',
    summary: 'Dòng sản phẩm hạt khô hoàn chỉnh, phục vụ nhu cầu dinh dưỡng hằng ngày của mèo trưởng thành.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Mèo trưởng thành',
    isFeatured: true,
    highlights: [
      'Thành phần nguyên liệu được chọn lọc cho nhu cầu dinh dưỡng của mèo',
      'Hàm lượng khoáng chất được tính toán cân bằng cho cơ thể',
      'Dạng hạt khô tiện lợi cho việc bảo quản và sử dụng hằng ngày',
    ],
    usageGuide: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn khẩu phần ăn phù hợp thể trạng.',
    consultationNote: 'Nên duy trì sẵn nước sạch cho mèo và kiểm soát lượng ăn theo tư vấn của bác sĩ.',
  },
  {
    id: 'prod-dd-03',
    isMock: true,
    name: 'Hạt dinh dưỡng chăm sóc da lông cho chó cưng',
    categoryId: 'dinh-duong',
    categoryName: 'Dinh dưỡng & Thức ăn',
    image: '/images/why-pet-companion.webp',
    imageAlt: 'Hạt dinh dưỡng chăm sóc da lông cho chó cưng (Ảnh minh họa)',
    summary: 'Dòng sản phẩm hạt dinh dưỡng cho chó, hỗ trợ cung cấp dưỡng chất và năng lượng trong khẩu phần ăn.',
    priceStatus: 'Đang cập nhật',
    targetPet: 'Chó cần chăm sóc lông da',
    isFeatured: false,
    highlights: [
      'Nguồn đạm và chất béo chọn lọc dành cho thú cưng',
      'Thành phần dinh dưỡng cân đối theo tiêu chuẩn thức ăn thú cưng',
      'Kích thước hạt phù hợp, dễ ăn và thuận tiện chia bữa',
    ],
    usageGuide: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn chế độ ăn phù hợp.',
    consultationNote: 'Nếu thú cưng có biểu hiện ngứa rát hoặc nhạy cảm tiêu hóa, vui lòng đưa bé đi thăm khám lâm sàng.',
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
    summary: 'Dòng sản phẩm sữa tắm vệ sinh cho chó mèo, chiết xuất từ thành phần thảo mộc dịu nhẹ.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo theo nhu cầu vệ sinh',
    isFeatured: true,
    highlights: [
      'Công thức dịu nhẹ, không chứa cồn hay hóa chất tẩy rửa nồng gắt',
      'Hỗ trợ làm sạch bụi bẩn trên lông và da thú cưng nhẹ nhàng',
      'Hương thảo mộc thoang thoảng mang lại cảm giác thoải mái khi tắm',
    ],
    usageGuide: 'Vui lòng trao đổi trực tiếp với chuyên viên hoặc bác sĩ thú y để được tư vấn chăm sóc phù hợp.',
    consultationNote: 'Tránh để bọt xà phòng tiếp xúc trực tiếp vào mắt và ống tai của thú cưng.',
  },
  {
    id: 'prod-vs-02',
    isMock: true,
    name: 'Dung dịch vệ sinh vành tai dịu nhẹ cho thú cưng',
    categoryId: 'cham-soc-ve-sinh',
    categoryName: 'Vệ sinh & Chăm sóc lông da',
    image: '/images/hero-clinic-cuddle.webp',
    imageAlt: 'Dung dịch vệ sinh vành tai dịu nhẹ cho thú cưng (Ảnh minh họa)',
    summary: 'Sản phẩm hỗ trợ vệ sinh vành tai ngoài cho chó mèo trong quy trình chăm sóc định kỳ.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo cần vệ sinh tai',
    isFeatured: false,
    highlights: [
      'Dạng dung dịch dịu mát, dễ sử dụng cho vành tai ngoài',
      'Thành phần làm sạch nhẹ nhàng, không gây nhờn rít sau khi dùng',
      'Phù hợp dùng trong quy trình vệ sinh định kỳ cho thú cưng',
    ],
    usageGuide: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y hoặc chuyên viên để được hướng dẫn thao tác an toàn.',
    consultationNote: 'Vui lòng đưa thú cưng đi thăm khám lâm sàng nếu vùng tai có biểu hiện sưng đỏ, mùi lạ hoặc khó chịu.',
  },
  {
    id: 'prod-vs-03',
    isMock: true,
    name: 'Lược chải lông và gỡ rối chuyên dụng',
    categoryId: 'cham-soc-ve-sinh',
    categoryName: 'Vệ sinh & Chăm sóc lông da',
    image: '/images/service-spa.webp',
    imageAlt: 'Lược chải lông và gỡ rối chuyên dụng (Ảnh minh họa)',
    summary: 'Dụng cụ lược chải lông chuyên dụng cho chó mèo, hỗ trợ chải tơi lông và gỡ rối nhẹ nhàng.',
    priceStatus: 'Đang cập nhật',
    targetPet: 'Chó & Mèo lông vừa đến dài',
    isFeatured: false,
    highlights: [
      'Đầu răng lược bằng thép không gỉ, được mài nhẵn bề mặt',
      'Tay cầm bọc cao su chống trượt tạo cảm giác cầm nắm chắc chắn',
      'Hỗ trợ gom lớp lông rụng trong sinh hoạt hằng ngày',
    ],
    usageGuide: 'Vui lòng tham khảo hướng dẫn chải lông phù hợp với từng giống thú cưng.',
    consultationNote: 'Nếu lông bé có hiện tượng bết rối sát da, vui lòng liên hệ nhân viên chuyên môn để được hỗ trợ.',
  },

  // 3. Phụ kiện & Đồ dùng tiện ích
  {
    id: 'prod-pk-01',
    isMock: true,
    name: 'Bát ăn inox đôi nâng góc nghiêng thoải mái',
    categoryId: 'phu-kien',
    categoryName: 'Phụ kiện & Đồ dùng tiện ích',
    image: '/images/article-nutrition.webp',
    imageAlt: 'Bát ăn inox đôi nâng góc nghiêng thoải mái (Ảnh minh họa)',
    summary: 'Bộ bát ăn đôi chất liệu inox, thiết kế độ cao và góc nghiêng thuận tiện cho thú cưng trong bữa ăn.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó nhỏ & Mèo',
    isFeatured: true,
    highlights: [
      'Lòng bát inox không gỉ, dễ tháo rời để vệ sinh sạch sẽ',
      'Khung chân đế chắc chắn kèm đệm chống xô lệch trên mặt sàn',
      'Góc nghiêng hợp lý giúp thú cưng có tư thế thoải mái khi ăn',
    ],
    usageGuide: 'Đặt khay tại vị trí bằng phẳng, cố định và vệ sinh bát ăn sạch sẽ sau khi sử dụng.',
    consultationNote: 'Lựa chọn kích cỡ khay bát phù hợp với vóc dáng của từng bé thú cưng.',
  },
  {
    id: 'prod-pk-02',
    isMock: true,
    name: 'Đệm nằm ấm áp êm ái chống thấm đáy',
    categoryId: 'phu-kien',
    categoryName: 'Phụ kiện & Đồ dùng tiện ích',
    image: '/images/service-inpatient.webp',
    imageAlt: 'Đệm nằm ấm áp êm ái chống thấm đáy (Ảnh minh họa)',
    summary: 'Đệm nằm chất liệu êm ái, tạo không gian nghỉ ngơi ấm áp và thư giãn cho thú cưng.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo thể trạng nhỏ đến vừa',
    isFeatured: false,
    highlights: [
      'Mặt đáy có hạt chống trượt và chống thấm ẩm từ bề mặt sàn',
      'Thành đệm êm nhô cao tạo điểm tựa đầu thoải mái cho thú cưng',
      'Vỏ ngoài tiện lợi, dễ dàng tháo rời để giặt giũ vệ sinh định kỳ',
    ],
    usageGuide: 'Đặt đệm ở vị trí bằng phẳng, yên tĩnh và khô ráo trong nhà.',
    consultationNote: 'Vệ sinh đệm định kỳ để giữ môi trường nghỉ ngơi luôn sạch sẽ cho thú cưng.',
  },
  {
    id: 'prod-pk-03',
    isMock: true,
    name: 'Túi vận chuyển thú cưng thông thoáng an toàn',
    categoryId: 'phu-kien',
    categoryName: 'Phụ kiện & Đồ dùng tiện ích',
    image: '/images/why-pet-companion.webp',
    imageAlt: 'Túi vận chuyển thú cưng thông thoáng an toàn (Ảnh minh họa)',
    summary: 'Túi vận chuyển thú cưng với khung giữ phom vững chãi, lưới thoáng khí và quai xách tiện dụng.',
    priceStatus: 'Đang cập nhật',
    targetPet: 'Thú cưng thể trọng nhỏ',
    isFeatured: false,
    highlights: [
      'Lưới chịu lực thông thoáng, hỗ trợ lưu thông không khí khi di chuyển',
      'Móc khóa giữ bên trong giúp thú cưng cố định an toàn',
      'Thiết kế gọn gàng, có thể gấp gọn tiện lợi khi không sử dụng',
    ],
    usageGuide: 'Lựa chọn túi vận chuyển phù hợp kích thước cơ thể để tạo sự thoải mái cho thú cưng khi di chuyển.',
    consultationNote: 'Luôn kiểm tra khóa và chốt cài cẩn thận trước khi đưa thú cưng ra ngoài.',
  },

  // 4. Bổ sung vi chất & Răng miệng
  {
    id: 'prod-bs-01',
    isMock: true,
    name: 'Gel dinh dưỡng bổ sung vi chất & năng lượng',
    categoryId: 'bo-sung-suc-khoe',
    categoryName: 'Bổ sung vi chất & Răng miệng',
    image: '/images/article-prevention.webp',
    imageAlt: 'Gel dinh dưỡng bổ sung vi chất & năng lượng (Ảnh minh họa)',
    summary: 'Dòng sản phẩm gel dinh dưỡng bổ sung, cung cấp các vitamin và khoáng chất thiết yếu cho chó mèo.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo theo tư vấn bác sĩ',
    isFeatured: true,
    highlights: [
      'Dạng gel mềm mịn, dễ trộn cùng thức ăn hoặc cho ăn trực tiếp',
      'Hương vị thơm ngon giúp thú cưng dễ tiếp nhận',
      'Bổ sung vi chất dinh dưỡng thiết yếu cho thú cưng',
    ],
    usageGuide: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn sản phẩm phù hợp với thể trạng của bé.',
    consultationNote: 'Sản phẩm mang tính chất minh họa dinh dưỡng bổ sung, không thay thế chế độ ăn chính hoặc chỉ định điều trị y khoa.',
  },
  {
    id: 'prod-bs-02',
    isMock: true,
    name: 'Gel chăm sóc răng miệng hương vị tự nhiên',
    categoryId: 'bo-sung-suc-khoe',
    categoryName: 'Bổ sung vi chất & Răng miệng',
    image: '/images/hero-happy-cat.webp',
    imageAlt: 'Gel chăm sóc răng miệng hương vị tự nhiên (Ảnh minh họa)',
    summary: 'Sản phẩm gel hỗ trợ chăm sóc và vệ sinh răng miệng định kỳ cho chó và mèo.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo theo tư vấn bác sĩ',
    isFeatured: false,
    highlights: [
      'Công thức dịu nhẹ hỗ trợ vệ sinh khoang miệng thú cưng',
      'Hương vị hấp dẫn tự nhiên giúp thú cưng dễ hợp tác khi chăm sóc',
      'Phù hợp dùng trong quy trình chăm sóc vệ sinh răng miệng định kỳ',
    ],
    usageGuide: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn sản phẩm phù hợp.',
    consultationNote: 'Vui lòng đưa thú cưng đi thăm khám lâm sàng định kỳ để được bác sĩ đánh giá tình trạng răng miệng.',
  },
  {
    id: 'prod-bs-03',
    isMock: true,
    name: 'Men vi sinh bổ sung cho đường ruột thú cưng',
    categoryId: 'bo-sung-suc-khoe',
    categoryName: 'Bổ sung vi chất & Răng miệng',
    image: '/images/article-firstaid.webp',
    imageAlt: 'Men vi sinh bổ sung cho đường ruột thú cưng (Ảnh minh họa)',
    summary: 'Sản phẩm men vi sinh dạng bột hòa tan, hỗ trợ bổ sung lợi khuẩn cho đường ruột thú cưng.',
    priceStatus: 'Liên hệ để biết giá',
    targetPet: 'Chó & Mèo cần hỗ trợ tiêu hóa',
    isFeatured: false,
    highlights: [
      'Chứa thành phần lợi khuẩn bổ sung dành cho chó mèo',
      'Dạng bột mịn dễ hòa tan hoặc trộn cùng thức ăn hằng ngày',
      'Phù hợp tham khảo cho khẩu phần dinh dưỡng của thú cưng',
    ],
    usageGuide: 'Vui lòng trao đổi trực tiếp với bác sĩ thú y để được tư vấn sản phẩm phù hợp.',
    consultationNote: 'Vui lòng tham khảo ý kiến bác sĩ thú y trước khi bổ sung bất kỳ sản phẩm nào cho thú cưng.',
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
      'Hiện tại, Bệnh viện Thú y Lê Sơn tập trung vào công tác chuyên môn khám chữa bệnh. Toàn bộ danh mục sản phẩm trên website là dữ liệu minh họa giao diện — chưa xác nhận hàng hóa đang kinh doanh và không có tính năng đặt mua hay thanh toán trực tuyến.',
  },
  {
    id: 'prod-faq-2',
    isMock: true,
    question: 'Làm thế nào để biết một sản phẩm có phù hợp với thể trạng của thú cưng?',
    answer: `Mỗi thú cưng có thể trạng, nhu cầu và tình trạng sức khỏe khác nhau. Quý khách vui lòng trao đổi trực tiếp với bác sĩ trong buổi khám hoặc liên hệ hotline ${HOSPITAL_CONTACT.hotlineDisplay} để được tư vấn chuyên môn phù hợp nhất.`,
  },
  {
    id: 'prod-faq-3',
    isMock: true,
    question: 'Bệnh viện có bán các loại thuốc điều trị theo đơn trên website không?',
    answer:
      'Theo quy chuẩn y tế và đạo đức hành nghề thú y, toàn bộ thuốc điều trị và kháng sinh chỉ được kê đơn sau khi bác sĩ thăm khám lâm sàng trực tiếp cho thú cưng tại phòng khám. Bệnh viện tuyệt đối không kinh doanh thuốc kê đơn dưới dạng hàng hóa thương mại điện tử.',
  },
]
