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
    mockLabel: 'Dữ liệu mẫu minh họa danh mục chi tiết — chờ cập nhật bảng danh mục chính thức',
    items: [
      '[Danh mục mẫu]: Khám lâm sàng tổng quát và tư vấn theo dõi sức khỏe định kỳ',
      '[Danh mục mẫu]: Xét nghiệm, siêu âm và chụp X-quang theo chỉ định thăm khám của bác sĩ',
      '[Danh mục mẫu]: Phẫu thuật thú y được tư vấn trực tiếp sau khi kiểm tra thể trạng',
    ],
  },
  'noi-tru': {
    id: 'noi-tru',
    isMock: true,
    mockLabel: 'Dữ liệu mẫu minh họa quy cách lưu trú — chờ cập nhật thông tin chi tiết',
    items: [
      '[Thông tin mẫu]: Khu vực lưu trú phân chia theo nhu cầu theo dõi của thú cưng',
      '[Thông tin mẫu]: Trao đổi chế độ ăn uống và lịch sinh hoạt của bé khi tiếp nhận',
    ],
  },
  spa: {
    id: 'spa',
    isMock: true,
    mockLabel: 'Dữ liệu mẫu minh họa gói chăm sóc — chờ cập nhật bảng thông số dịch vụ',
    items: [
      '[Gói mẫu]: Tắm vệ sinh, sấy khô và chải lông cơ bản',
      '[Gói mẫu]: Cắt tỉa gọn gàng và vệ sinh tai, móng theo nhu cầu chủ nuôi',
    ],
  },
}
