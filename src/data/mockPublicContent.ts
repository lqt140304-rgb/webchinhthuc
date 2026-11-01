/**
 * Centralized Mock & Illustrative Data Module
 *
 * Theo chính sách Dữ liệu mẫu của Chủ dự án (01/11/2026):
 * - Dùng để hoàn thiện bố cục giao diện trong khi chờ dữ liệu thật / CMS / Backend.
 * - Tách biệt rõ ràng với dữ liệu thật đã xác nhận tại `src/config/contact.ts`.
 * - Mọi mục dữ liệu mẫu đều phải gắn nhãn hiển thị rõ ràng (`mockLabel` / `isMock: true`).
 * - Không tạo bác sĩ giả, khách hàng giả, đánh giá giả, ca điều trị thật giả mạo,
 *   hoặc hướng dẫn sơ cứu / phác đồ y khoa chưa được bác sĩ phê duyệt.
 */

export interface MockHighlightStoryData {
  readonly isMock: true
  readonly badgeLabel: string
  readonly editorialNotice: string
  readonly petMeta: string
  readonly diagnosisSummary: string
  readonly title: string
  readonly summary: string
  readonly image: string
  readonly imageAlt: string
  readonly footnote: string
  readonly timeline: readonly {
    readonly stepTitle: string
    readonly stepDescription: string
    readonly isSuccess?: boolean
  }[]
}

export interface MockKnowledgeArticleItem {
  readonly id: string
  readonly isMock: true
  readonly title: string
  readonly category: 'Dinh dưỡng' | 'Phòng bệnh' | 'Chăm sóc'
  readonly excerpt: string
  readonly readTime: string
  readonly image: string
  readonly imageBadgeLabel: string
  readonly referenceLabel: string
  readonly slug: string
}

export interface MockServiceDetailItem {
  readonly id: string
  readonly isMock: true
  readonly mockLabel: string
  readonly items: readonly string[]
}

export const MOCK_HIGHLIGHT_STORY: MockHighlightStoryData = {
  isMock: true,
  badgeLabel: 'Câu chuyện minh họa',
  editorialNotice:
    'Nội dung minh họa quy trình điều trị — Chưa xuất bản ca bệnh thực tế khi chưa có xác nhận từ chủ nuôi',
  petMeta: 'Bé: Milo (Corgi, 2 tuổi — Minh họa)',
  diagnosisSummary: 'Tình huống minh họa: Rối loạn tiêu hóa & Mất nước',
  title: '72 giờ vượt qua cơn nguy kịch của bé Milo',
  summary:
    'Tình huống minh họa quy trình phối hợp chăm sóc tại viện: tiếp nhận thăm khám lâm sàng, thực hiện xét nghiệm và siêu âm kiểm tra theo chỉ định, kết hợp chăm sóc nội trú và cập nhật tình hình sức khỏe định kỳ cho gia đình.',
  image: '/images/story-recovery.webp',
  imageAlt: 'Chú cún tươi vui, phục hồi sức sống sau ca điều trị (Hình ảnh minh họa)',
  footnote: '* Dữ liệu mẫu minh họa bố cục câu chuyện hồi phục — chờ cập nhật ca bệnh thực tế được chủ nuôi đồng thuận',
  timeline: [
    {
      stepTitle: 'Giai đoạn 1: Tiếp nhận thăm khám & Kiểm tra cận lâm sàng',
      stepDescription:
        'Khám lâm sàng, thực hiện xét nghiệm và chẩn đoán hình ảnh theo chỉ định bác sĩ.',
    },
    {
      stepTitle: 'Giai đoạn 2: Theo dõi nội trú & Cập nhật tình hình',
      stepDescription:
        'Chăm sóc tại khu vực lưu trú nội trú và thông báo tiến triển sức khỏe định kỳ cho gia đình.',
    },
    {
      stepTitle: 'Giai đoạn 3: Ổn định sức khỏe & Hướng dẫn chăm sóc tại nhà',
      stepDescription:
        'Kiểm tra lại trước khi xuất viện và trao đổi lịch tái khám, chế độ dinh dưỡng tại gia.',
      isSuccess: true,
    },
  ],
}

export const MOCK_KNOWLEDGE_EDITORIAL_NOTICE =
  'Các bài viết dưới đây là dữ liệu mẫu minh họa cấu trúc chuyên đề — Đang hoàn thiện biên tập và thẩm định trước khi xuất bản chính thức.'

export const MOCK_KNOWLEDGE_ARTICLES: readonly MockKnowledgeArticleItem[] = [
  {
    id: 'art-1',
    isMock: true,
    title: 'Xây dựng khẩu phần dinh dưỡng an toàn cho thú cưng theo từng lứa tuổi',
    category: 'Dinh dưỡng',
    excerpt:
      'Bài viết mẫu minh họa chuyên mục dinh dưỡng: tìm hiểu cách lựa chọn thức ăn phù hợp cho từng giai đoạn phát triển của chó mèo.',
    readTime: '5 phút đọc',
    image: '/images/article-nutrition.webp',
    imageBadgeLabel: 'Ảnh minh họa',
    referenceLabel: 'Bài viết mẫu',
    slug: 'dinh-duong-an-toan-cho-thu-cung',
  },
  {
    id: 'art-2',
    isMock: true,
    title: 'Những lưu ý chăm sóc sức khỏe thú cưng khi thời tiết giao mùa',
    category: 'Phòng bệnh',
    excerpt:
      'Bài viết mẫu minh họa chuyên mục phòng bệnh: quan sát thói quen sinh hoạt và chủ động đưa bé đi khám khi có biểu hiện bất thường.',
    readTime: '4 phút đọc',
    image: '/images/article-prevention.webp',
    imageBadgeLabel: 'Ảnh minh họa',
    referenceLabel: 'Bài viết mẫu',
    slug: 'cham-soc-suc-khoe-thoi-tiet-giao-mua',
  },
  {
    id: 'art-3',
    isMock: true,
    title: 'Chuẩn bị thông tin gì trước khi đưa thú cưng đi khám định kỳ?',
    category: 'Chăm sóc',
    excerpt:
      'Bài viết mẫu minh họa chuyên mục chăm sóc: ghi chú lịch sử tiêm chủng, khẩu phần ăn và các biểu hiện của bé để trao đổi cùng bác sĩ.',
    readTime: '6 phút đọc',
    image: '/images/article-firstaid.webp',
    imageBadgeLabel: 'Ảnh minh họa',
    referenceLabel: 'Bài viết mẫu',
    slug: 'chuan-bi-truoc-khi-dua-thu-cung-di-kham',
  },
]

export const MOCK_SERVICE_SUPPLEMENT_NOTES: Record<string, MockServiceDetailItem> = {
  'kham-dieu-tri': {
    id: 'kham-dieu-tri',
    isMock: true,
    mockLabel: 'Dữ liệu minh họa danh mục chi tiết — chờ cập nhật bảng danh mục chính thức',
    items: [
      'Khám lâm sàng tổng quát và tư vấn theo dõi sức khỏe định kỳ',
      'Xét nghiệm, siêu âm và chụp X-quang theo chỉ định thăm khám của bác sĩ',
      'Phẫu thuật thú y được tư vấn trực tiếp sau khi kiểm tra thể trạng',
    ],
  },
  'noi-tru': {
    id: 'noi-tru',
    isMock: true,
    mockLabel: 'Dữ liệu minh họa quy cách lưu trú — chờ cập nhật thông tin chi tiết',
    items: [
      'Khu vực lưu trú phân chia theo nhu cầu theo dõi của thú cưng',
      'Trao đổi chế độ ăn uống và lịch sinh hoạt của bé khi tiếp nhận',
    ],
  },
  spa: {
    id: 'spa',
    isMock: true,
    mockLabel: 'Dữ liệu minh họa gói chăm sóc — chờ cập nhật bảng thông số dịch vụ',
    items: [
      'Tắm vệ sinh, sấy khô và chải lông cơ bản',
      'Cắt tỉa gọn gàng và vệ sinh tai, móng theo nhu cầu chủ nuôi',
    ],
  },
}

// ============================================================================
// PHASE 3 / BATCH 2 — DỮ LIỆU MẪU CHO 3 TRANG CHI TIẾT DỊCH VỤ
// (/dich-vu/kham-dieu-tri, /dich-vu/noi-tru, /dich-vu/spa)
// ============================================================================

export interface MockProcessStepItem {
  readonly id: string
  readonly isMock: true
  readonly stepNumber: string
  readonly title: string
  readonly summary: string
  readonly detailNote: string
}

export interface MockFaqItem {
  readonly id: string
  readonly isMock: true
  readonly question: string
  readonly answer: string
}

export interface MockInpatientSpaceItem {
  readonly id: string
  readonly isMock: true
  readonly badgeLabel: string
  readonly zoneTitle: string
  readonly subtitle: string
  readonly description: string
  readonly points: readonly string[]
  readonly image: string
  readonly imageAlt: string
}

export interface MockInpatientTimelineItem {
  readonly id: string
  readonly isMock: true
  readonly phaseCode: string
  readonly timeSlot: string
  readonly title: string
  readonly description: string
  readonly ownerNote: string
}

export interface MockCustomerPortalPreview {
  readonly isMock: true
  readonly badgeLabel: string
  readonly editorialNotice: string
  readonly title: string
  readonly subtitle: string
  readonly sharedItems: readonly {
    readonly id: string
    readonly label: string
    readonly sampleValue: string
    readonly description: string
  }[]
  readonly restrictedNoticeTitle: string
  readonly restrictedItems: readonly string[]
}

export interface MockSpaServiceGroupItem {
  readonly id: string
  readonly isMock: true
  readonly code: string
  readonly title: string
  readonly tagline: string
  readonly description: string
  readonly highlights: readonly string[]
}

export interface MockSpaGalleryItem {
  readonly id: string
  readonly isMock: true
  readonly badgeLabel: string
  readonly title: string
  readonly caption: string
  readonly image: string
  readonly imageAlt: string
  readonly aspect: '4/5' | '4/3'
}

export interface MockSpaPricingRow {
  readonly id: string
  readonly isMock: true
  readonly packageTitle: string
  readonly weightRange: string
  readonly referencePrice: string
  readonly durationEstimate: string
  readonly includesSummary: string
}

// --- 1. TRANG KHÁM & ĐIỀU TRỊ (/dich-vu/kham-dieu-tri) ---

export const MOCK_EXAM_EDITORIAL_NOTICE =
  'Trình tự các bước dưới đây là dữ liệu minh họa cấu trúc thăm khám tham khảo — không phải quy trình vận hành chính thức hoặc phác đồ điều trị cố định của bệnh viện.'

export const MOCK_EXAM_PROCESS_STEPS: readonly MockProcessStepItem[] = [
  {
    id: 'exam-step-1',
    isMock: true,
    stepNumber: '01',
    title: 'Tiếp nhận thông tin & Ghi nhận biểu hiện ban đầu',
    summary:
      'Ghi nhận thông tin cơ bản của thú cưng, lịch sử sinh hoạt, khẩu phần ăn và những dấu hiệu khiến chủ nuôi lo lắng khi đưa bé đến cơ sở 101 Khuất Duy Tiến.',
    detailNote: 'Bước tham khảo: Tiếp đón & ghi nhận',
  },
  {
    id: 'exam-step-2',
    isMock: true,
    stepNumber: '02',
    title: 'Khám lâm sàng tổng quát cùng bác sĩ',
    summary:
      'Bác sĩ kiểm tra thể trạng chung, quan sát niêm mạc, nghe tim phổi, kiểm tra vùng bụng, da lông và đánh giá các phản xạ cơ bản của bé.',
    detailNote: 'Bước tham khảo: Thăm khám lâm sàng',
  },
  {
    id: 'exam-step-3',
    isMock: true,
    stepNumber: '03',
    title: 'Chỉ định X-quang, Siêu âm hoặc Xét nghiệm khi cần thiết',
    summary:
      'Tùy theo biểu hiện lâm sàng, bác sĩ trao đổi với chủ nuôi trước khi thực hiện chụp X-quang, siêu âm hoặc xét nghiệm cận lâm sàng để có cơ sở đánh giá chính xác.',
    detailNote: 'Bước tham khảo: Chỉ định cận lâm sàng',
  },
  {
    id: 'exam-step-4',
    isMock: true,
    stepNumber: '04',
    title: 'Tư vấn hướng điều trị, phẫu thuật hoặc chăm sóc theo dõi',
    summary:
      'Giải thích kết quả kiểm tra cho gia đình, trao đổi phương án chăm sóc ngoại trú, lưu trú theo dõi hoặc chỉ định phẫu thuật phù hợp với thể trạng của bé.',
    detailNote: 'Bước tham khảo: Kế hoạch chăm sóc & tái khám',
  },
]

export const MOCK_EXAM_FAQS: readonly MockFaqItem[] = [
  {
    id: 'exam-faq-1',
    isMock: true,
    question: 'Cần chuẩn bị gì trước khi đưa thú cưng đến khám tại 101 Khuất Duy Tiến?',
    answer:
      'Chủ nuôi nên mang theo sổ sức khỏe hoặc lịch sử tiêm chủng (nếu có), ghi nhớ các biểu hiện bất thường, thời điểm bắt đầu triệu chứng và thói quen ăn uống gần đây của bé để trao đổi cùng bác sĩ.',
  },
  {
    id: 'exam-faq-2',
    isMock: true,
    question: 'Khi nào thú cưng cần thực hiện X-quang, siêu âm hoặc xét nghiệm?',
    answer:
      'Các hạng mục X-quang, siêu âm và xét nghiệm được bác sĩ đề xuất sau khi khám lâm sàng trực tiếp và luôn trao đổi, thống nhất với chủ nuôi trước khi tiến hành.',
  },
  {
    id: 'exam-faq-3',
    isMock: true,
    question: 'Đặt lịch hẹn trước có giúp giảm thời gian chờ đợi không?',
    answer:
      'Việc đặt lịch trực tuyến qua trang Đặt lịch hoặc liên hệ trước qua hotline 097 355 51 05 giúp bộ phận tiếp đón chủ động sắp xếp khung giờ phù hợp cho bé. Với tình huống khẩn cấp, cơ sở tiếp nhận cấp cứu 24/24.',
  },
]

// --- 2. TRANG CHĂM SÓC NỘI TRÚ (/dich-vu/noi-tru) ---

export const MOCK_INPATIENT_EDITORIAL_NOTICE =
  'Mô tả không gian lưu trú, lịch trình sinh hoạt và khung thông tin Cổng khách hàng dưới đây là dữ liệu minh họa giao diện. Vui lòng liên hệ hotline 097 355 51 05 để được tư vấn điều kiện tiếp nhận thực tế.'

export const MOCK_INPATIENT_CARE_SPACES: readonly MockInpatientSpaceItem[] = [
  {
    id: 'inpatient-space-1',
    isMock: true,
    badgeLabel: 'Mô tả không gian tham khảo',
    zoneTitle: 'Khu vực lưu trú phân tách theo loài & tính cách',
    subtitle: 'Giảm căng thẳng âm thanh và mùi hương lạ cho chó & mèo',
    description:
      'Mô hình bố trí không gian lưu trú minh họa hướng tới sự yên tĩnh, hạn chế tiếp xúc chéo giữa các bé nhạy cảm và duy trì độ thông thoáng trong suốt thời gian lưu lại cơ sở.',
    points: [
      'Ô lưu trú cá nhân có lót đệm êm và khay vệ sinh riêng',
      'Hạn chế tầm nhìn trực diện giữa chó và mèo để giảm tâm lý sợ hãi',
      'Vệ sinh khay và bề mặt ô lưu trú theo lịch sinh hoạt hằng ngày',
    ],
    image: '/images/service-inpatient.webp',
    imageAlt: 'Không gian lưu trú nội trú sạch sẽ và yên tĩnh (Hình ảnh minh họa)',
  },
  {
    id: 'inpatient-space-2',
    isMock: true,
    badgeLabel: 'Mô tả chăm sóc tham khảo',
    zoneTitle: 'Theo dõi sinh hoạt & Chăm sóc sau thăm khám',
    subtitle: 'Ghi nhận thói quen ăn uống, vận động và tinh thần của bé',
    description:
      'Nội dung minh họa quy trình nhân sự chăm sóc quan sát mức độ ăn uống, đi vệ sinh và biểu hiện tinh thần của thú cưng để phối hợp cùng bác sĩ trong khung giờ làm việc.',
    points: [
      'Ghi chép bữa ăn và lượng nước uống theo khẩu phần gia đình dặn dò',
      'Quan sát biểu hiện tinh thần, mức độ thích nghi với môi trường mới',
      'Liên hệ ngay với chủ nuôi qua điện thoại khi cần trao đổi phát sinh',
    ],
    image: '/images/hero-clinic-cuddle.webp',
    imageAlt: 'Nhân viên chăm sóc ân cần quan sát thú cưng (Hình ảnh minh họa)',
  },
]

export const MOCK_INPATIENT_TIMELINE: readonly MockInpatientTimelineItem[] = [
  {
    id: 'inpatient-tl-1',
    isMock: true,
    phaseCode: 'BUỔI SÁNG',
    timeSlot: 'Buổi sáng (Khung giờ tham khảo)',
    title: 'Kiểm tra buổi sáng, vệ sinh không gian & Bữa ăn sáng',
    description:
      'Quan sát tinh thần của bé khi bắt đầu ngày mới, làm sạch khu vực lưu trú và phục vụ bữa sáng theo chế độ ăn đã thống nhất lúc tiếp nhận.',
    ownerNote: 'Ghi nhận mức độ ăn uống và vệ sinh buổi sáng',
  },
  {
    id: 'inpatient-tl-2',
    isMock: true,
    phaseCode: 'BUỔI TRƯA',
    timeSlot: 'Buổi trưa (Khung giờ tham khảo)',
    title: 'Nghỉ ngơi yên tĩnh & Theo dõi thể trạng giữa ngày',
    description:
      'Giữ không gian dịu nhẹ để thú cưng nghỉ trưa, hạn chế tiếng ồn lớn và kiểm tra nước uống trong từng ô lưu trú.',
    ownerNote: 'Đảm bảo không gian yên tĩnh giúp bé giảm căng thẳng',
  },
  {
    id: 'inpatient-tl-3',
    isMock: true,
    phaseCode: 'BUỔI CHIỀU',
    timeSlot: 'Buổi chiều (Khung giờ tham khảo)',
    title: 'Tương tác nhẹ nhàng, kiểm tra sức khỏe & Bữa chiều',
    description:
      'Kiểm tra lại tình trạng chung, cho bé ăn bữa chiều và tổng hợp ghi chú sinh hoạt để phản hồi cho chủ nuôi khi liên hệ.',
    ownerNote: 'Tổng hợp thông tin sinh hoạt trong ngày của bé',
  },
  {
    id: 'inpatient-tl-4',
    isMock: true,
    phaseCode: 'BUỔI TỐI',
    timeSlot: 'Buổi tối & Ban đêm (Khung giờ tham khảo)',
    title: 'Chăm sóc buổi tối & Ổn định không gian nghỉ đêm',
    description:
      'Vệ sinh khay đệm, chuẩn bị chỗ ngủ ấm cúng và duy trì môi trường yên tĩnh, thông thoáng để thú cưng an tâm nghỉ ngơi suốt đêm.',
    ownerNote: 'Duy trì không gian an toàn, theo dõi sự thoải mái của bé qua đêm',
  },
]

export const MOCK_INPATIENT_FUTURE_PORTAL_PREVIEW: MockCustomerPortalPreview = {
  isMock: true,
  badgeLabel: 'Bản xem trước chức năng tương lai — Cổng khách hàng (Giai đoạn 4)',
  editorialNotice:
    'Khung giao diện dưới đây là bản xem trước chức năng dự kiến trên Cổng khách hàng (/tai-khoan) ở giai đoạn phát triển tiếp theo, tuân thủ nguyên tắc bảo mật dữ liệu nội bộ.',
  title: 'Chủ nuôi sẽ nhận được thông tin gì trên hệ thống tương lai?',
  subtitle:
    'Thiết kế hướng tới sự an tâm cho gia đình thông qua các bản tin sinh hoạt dễ hiểu, đồng thời tách biệt nghiêm ngặt với dữ liệu y khoa nội bộ của bệnh viện.',
  sharedItems: [
    {
      id: 'portal-share-1',
      label: 'Trạng thái sinh hoạt & Tinh thần hằng ngày',
      sampleValue: 'Minh họa: Bé ăn hết khẩu phần sáng, tinh thần tỉnh táo, ngủ ngoan',
      description: 'Tóm tắt ngắn gọn bằng ngôn ngữ thân thiện sau khi được duyệt chia sẻ cho chủ nuôi.',
    },
    {
      id: 'portal-share-2',
      label: 'Ghi chú khẩu phần ăn & Chăm sóc chung',
      sampleValue: 'Minh họa: Đã dùng bữa sáng lúc 08:30 và bữa chiều lúc 16:30 theo thức ăn gia đình gửi',
      description: 'Giúp chủ nuôi nắm được nếp ăn uống và sinh hoạt của bé tại cơ sở.',
    },
    {
      id: 'portal-share-3',
      label: 'Lịch hẹn kiểm tra & Thông báo xuất viện',
      sampleValue: 'Minh họa: Dự kiến đón bé lúc 17:30 • Lịch tái khám định kỳ sau 5 ngày',
      description: 'Chủ động sắp xếp thời gian đón bé và theo dõi lịch hẹn tiếp theo.',
    },
  ],
  restrictedNoticeTitle: 'Nguyên tắc bảo mật & Giới hạn hiển thị trên Cổng khách hàng:',
  restrictedItems: [
    'Không hiển thị tên thuốc điều trị, liều lượng tiêm truyền hoặc công thức pha chế nội bộ.',
    'Không hiển thị y lệnh chi tiết, phác đồ chuyên môn nội bộ hoặc ghi chú nghiệp vụ riêng của bác sĩ.',
    'Mọi tư vấn điều trị chuyên sâu đều được bác sĩ trao đổi trực tiếp với chủ nuôi tại phòng khám hoặc qua điện thoại.',
  ],
}

export const MOCK_INPATIENT_FAQS: readonly MockFaqItem[] = [
  {
    id: 'inpatient-faq-1',
    isMock: true,
    question: 'Khi gửi thú cưng lưu trú nội trú, gia đình cần mang theo những gì?',
    answer:
      'Chủ nuôi nên mang theo thức ăn quen thuộc của bé (nếu bé có chế độ ăn riêng), sổ tiêm chủng và thông báo rõ các thói quen hoặc dị ứng thức ăn tại quầy tiếp đón 101 Khuất Duy Tiến.',
  },
  {
    id: 'inpatient-faq-2',
    isMock: true,
    question: 'Làm thế nào để hỏi thăm tình hình của bé trong thời gian lưu trú?',
    answer:
      'Gia đình có thể liên hệ trực tiếp qua hotline 097 355 51 05 hoặc trao đổi trong khung giờ hoạt động 08:00 – 21:00 để nhận thông tin cập nhật về bữa ăn và sinh hoạt của bé.',
  },
  {
    id: 'inpatient-faq-3',
    isMock: true,
    question: 'Thú cưng lưu trú sau phẫu thuật hoặc điều trị được tiếp nhận như thế nào?',
    answer:
      'Trước khi lưu trú, bác sĩ sẽ khám lâm sàng và tư vấn trực tiếp phương án theo dõi phù hợp với tình trạng thực tế của từng bé.',
  },
]

// --- 3. TRANG SPA & GROOMING (/dich-vu/spa) ---

export const MOCK_SPA_EDITORIAL_NOTICE =
  'Quy trình chăm sóc, bộ sưu tập hình ảnh và bảng giá dưới đây là dữ liệu minh họa bố cục giao diện — không phải biểu phí niêm yết chính thức. Vui lòng liên hệ 097 355 51 05 để được tư vấn theo cân nặng và tình trạng lông thực tế của bé.'

export const MOCK_SPA_SERVICE_GROUPS: readonly MockSpaServiceGroupItem[] = [
  {
    id: 'spa-group-bath',
    isMock: true,
    code: 'GROOMING 01',
    title: 'Tắm vệ sinh & Sấy chải mềm mượt',
    tagline: 'Làm sạch dịu nhẹ, khử mùi và chải tơi lông rối cơ bản',
    description:
      'Hạng mục chăm sóc vệ sinh định kỳ giúp làm sạch bụi bẩn trên da lông, kết hợp sấy khô ấm áp và chải lông gọn gàng cho chó mèo.',
    highlights: [
      'Làm ướt ấm, tắm làm sạch toàn thân và xả kỹ',
      'Sấy khô kết hợp chải tơi hạn chế vón cục cơ bản',
      'Lau sạch vùng mắt, mũi và bàn chân sau khi tắm',
    ],
  },
  {
    id: 'spa-group-hygiene',
    isMock: true,
    code: 'GROOMING 02',
    title: 'Vệ sinh tai, Cắt mài móng & Cạo lông bàn chân',
    tagline: 'Chăm sóc chi tiết các vùng dễ bám bẩn hằng ngày',
    description:
      'Gói vệ sinh chi tiết các vùng nhạy cảm giúp thú cưng di chuyển thoải mái, giữ tai thông thoáng và hạn chế móng dài gây vướng víu.',
    highlights: [
      'Cắt bấm gọn móng và dũa đầu móng hạn chế trầy xước',
      'Lau vệ sinh vành tai và kiểm tra độ sạch cơ bản',
      'Tỉa gọn lông đệm bàn chân và vùng bụng dưới',
    ],
  },
  {
    id: 'spa-group-styling',
    isMock: true,
    code: 'GROOMING 03',
    title: 'Cắt tỉa gọn gàng & Tạo hình thẩm mỹ',
    tagline: 'Tạo kiểu phù hợp sinh hoạt gia đình và thời tiết',
    description:
      'Thực hiện cắt tỉa độ dài lông hoặc tạo phom dáng gọn gàng theo mong muốn của chủ nuôi, ưu tiên sự thoải mái và dễ vận động cho bé.',
    highlights: [
      'Trao đổi kiểu dáng mong muốn cùng chủ nuôi trước khi cắt',
      'Cắt tỉa gọn vùng mặt, tai, thân và đuôi cân đối',
      'Kiểm tra lại độ gọn gàng trước khi bàn giao bé cho gia đình',
    ],
  },
]

export const MOCK_SPA_WORKFLOW_STEPS: readonly MockProcessStepItem[] = [
  {
    id: 'spa-step-1',
    isMock: true,
    stepNumber: '01',
    title: 'Đón bé & Kiểm tra tình trạng da lông ban đầu',
    summary:
      'Tiếp nhận thú cưng tại 101 Khuất Duy Tiến, quan sát độ dày lông, các điểm lông rối và lắng nghe yêu cầu của chủ nuôi.',
    detailNote: 'Bước tham khảo 01 • Tiếp nhận & trao đổi',
  },
  {
    id: 'spa-step-2',
    isMock: true,
    stepNumber: '02',
    title: 'Chải gỡ rối sơ bộ, vệ sinh tai & cắt móng',
    summary:
      'Chải tơi các vùng lông bết nhẹ, bấm gọn móng và làm sạch vùng tai, đệm chân trước khi bước vào khâu tắm ấm.',
    detailNote: 'Bước tham khảo 02 • Vệ sinh chi tiết',
  },
  {
    id: 'spa-step-3',
    isMock: true,
    stepNumber: '03',
    title: 'Tắm sạch dịu nhẹ & Sấy khô chải phồng',
    summary:
      'Thực hiện tắm làm sạch với thao tác nhẹ nhàng để bé không hoảng sợ, sau đó sấy khô và chải mượt toàn bộ lớp lông.',
    detailNote: 'Bước tham khảo 03 • Tắm ấm & sấy chải',
  },
  {
    id: 'spa-step-4',
    isMock: true,
    stepNumber: '04',
    title: 'Cắt tỉa tạo kiểu & Bàn giao bé cho gia đình',
    summary:
      'Tỉa gọn hoặc tạo hình theo thỏa thuận ban đầu, kiểm tra lại tổng thể và mời chủ nuôi đón bé tại quầy tiếp đón.',
    detailNote: 'Bước tham khảo 04 • Tạo kiểu & bàn giao',
  },
]

export const MOCK_SPA_GALLERY: readonly MockSpaGalleryItem[] = [
  {
    id: 'spa-gal-1',
    isMock: true,
    badgeLabel: 'Ảnh minh họa • Lookbook 01',
    title: 'Chăm sóc tắm sấy & chải mượt định kỳ',
    caption: 'Hình ảnh minh họa phong cách chăm sóc nhẹ nhàng, giữ bộ lông sạch thơm cho thú cưng.',
    image: '/images/service-spa.webp',
    imageAlt: 'Thú cưng được chăm sóc lông sạch sẽ tại khu vực Spa (Ảnh minh họa)',
    aspect: '4/5',
  },
  {
    id: 'spa-gal-2',
    isMock: true,
    badgeLabel: 'Ảnh minh họa • Lookbook 02',
    title: 'Trải nghiệm thư giãn cho mèo cưng',
    caption: 'Hình ảnh minh họa thao tác ân cần giúp các bé mèo giảm căng thẳng khi vệ sinh cá nhân.',
    image: '/images/hero-happy-cat.webp',
    imageAlt: 'Mèo cưng thư giãn với bộ lông mềm mượt (Ảnh minh họa)',
    aspect: '4/3',
  },
  {
    id: 'spa-gal-3',
    isMock: true,
    badgeLabel: 'Ảnh minh họa • Lookbook 03',
    title: 'Vẻ ngoài gọn gàng sau khi cắt tỉa',
    caption: 'Hình ảnh minh họa diện mạo năng động, sạch sẽ sau buổi làm đẹp cơ bản.',
    image: '/images/why-pet-companion.webp',
    imageAlt: 'Chú cún gọn gàng và rạng rỡ bên chủ nuôi (Ảnh minh họa)',
    aspect: '4/3',
  },
]

export const MOCK_SPA_PRICING_TABLE: readonly MockSpaPricingRow[] = [
  {
    id: 'spa-price-1',
    isMock: true,
    packageTitle: 'Tắm vệ sinh & Sấy chải cơ bản',
    weightRange: 'Cỡ nhỏ (Dưới 5 kg — Tham khảo)',
    referencePrice: 'Giá tham khảo — Liên hệ báo giá',
    durationEstimate: 'Khoảng 45 – 60 phút (Tham khảo)',
    includesSummary: 'Tắm sạch, sấy khô, chải lông, vệ sinh tai & bấm móng cơ bản',
  },
  {
    id: 'spa-price-2',
    isMock: true,
    packageTitle: 'Tắm vệ sinh & Sấy chải cơ bản',
    weightRange: 'Cỡ vừa (5 – 12 kg — Tham khảo)',
    referencePrice: 'Giá tham khảo — Liên hệ báo giá',
    durationEstimate: 'Khoảng 60 – 75 phút (Tham khảo)',
    includesSummary: 'Tắm sạch, sấy khô, chải tơi lông dày, vệ sinh tai & bấm móng',
  },
  {
    id: 'spa-price-3',
    isMock: true,
    packageTitle: 'Combo Tắm vệ sinh & Cắt tỉa gọn gàng',
    weightRange: 'Cỡ nhỏ – vừa (Theo độ dày lông — Tham khảo)',
    referencePrice: 'Giá tham khảo — Liên hệ báo giá',
    durationEstimate: 'Khoảng 90 – 120 phút (Tham khảo)',
    includesSummary: 'Trọn gói tắm vệ sinh kết hợp cắt tỉa tạo phom gọn gàng theo yêu cầu',
  },
  {
    id: 'spa-price-4',
    isMock: true,
    packageTitle: 'Vệ sinh lẻ (Tai, móng, cạo bàn chân/bụng)',
    weightRange: 'Áp dụng chung (Tham khảo)',
    referencePrice: 'Giá tham khảo — Liên hệ báo giá',
    durationEstimate: 'Khoảng 15 – 25 phút (Tham khảo)',
    includesSummary: 'Chăm sóc nhanh các vùng vệ sinh cơ bản không bao gồm tắm sấy',
  },
]

export const MOCK_SPA_FAQS: readonly MockFaqItem[] = [
  {
    id: 'spa-faq-1',
    isMock: true,
    question: 'Có nên đặt lịch hẹn trước khi đưa bé đến làm Spa & Grooming không?',
    answer:
      'Chủ nuôi nên đặt lịch trước qua trang Đặt lịch trực tuyến hoặc gọi 097 355 51 05 để cơ sở sắp xếp khung giờ phù hợp, hạn chế việc bé phải chờ đợi lâu.',
  },
  {
    id: 'spa-faq-2',
    isMock: true,
    question: 'Thời gian tắm sấy và cắt tỉa thường mất bao lâu?',
    answer:
      'Thời gian thực tế phụ thuộc vào kích thước, độ dày và mức độ rối của lông cũng như sự hợp tác của từng bé. Nhân viên tiếp đón sẽ trao đổi thời gian dự kiến khi nhận bé tại 101 Khuất Duy Tiến.',
  },
  {
    id: 'spa-faq-3',
    isMock: true,
    question: 'Thú cưng có biểu hiện mệt mỏi hoặc đang điều trị bệnh có nên tắm ngay không?',
    answer:
      'Nếu thú cưng đang có dấu hiệu mệt mỏi, sốt, tiêu chảy hoặc vừa thực hiện phẫu thuật, gia đình nên trao đổi với bác sĩ thú y để kiểm tra sức khỏe trước khi sử dụng dịch vụ tắm sấy.',
  },
]

