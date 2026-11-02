// ============================================================================
// PHASE 3 / BATCH 3B — DỮ LIỆU MINH HỌA CÂU CHUYỆN ĐIỀU TRỊ (/cau-chuyen)
// Tuân thủ: Master Prompt V2.0 & Baseline Kiến trúc 2026
// Mọi thông tin đều mang cờ isMock: true.
// Toàn bộ ca bệnh demo được đánh dấu: "Câu chuyện minh họa — không phải hồ sơ điều trị thực tế".
// Tuyệt đối không tạo bệnh nhân giả, bác sĩ giả, chẩn đoán, phác đồ, liều thuốc hay kết quả điều trị giả.
// Toàn bộ nhân vật là mô phỏng minh họa, ngày đăng đều dùng nhãn trung tính "Nội dung minh họa".
// ============================================================================

export interface MockStoryItem {
  readonly id: string
  readonly slug: string
  readonly isMock: true
  readonly badgeLabel: string
  readonly title: string
  readonly categoryId: string
  readonly categoryName: string
  readonly petName: string
  readonly targetPet: 'Chó' | 'Mèo'
  readonly date: string
  readonly summary: string
  readonly image: string
  readonly imageAlt: string
  readonly isFeatured?: boolean
  readonly overview: {
    readonly condition: string
    readonly initialApproach: string
    readonly careHighlights: string
  }
  readonly sections: readonly {
    readonly heading: string
    readonly paragraphs: readonly string[]
  }[]
  readonly timeline: readonly {
    readonly phaseTitle: string
    readonly description: string
    readonly isCompleted?: boolean
  }[]
  readonly relatedSlugs: readonly string[]
}

export interface MockStoryCategory {
  readonly id: string
  readonly name: string
  readonly badgeLabel: string
}

export const MOCK_STORIES_EDITORIAL_NOTICE =
  'Toàn bộ các trường hợp dưới đây là dữ liệu minh họa quy trình thăm khám và chăm sóc tại cơ sở — không phải hồ sơ bệnh án thực tế của bệnh nhân. Bệnh viện Thú y Lê Sơn tôn trọng quyền riêng tư của khách hàng và chỉ chia sẻ thông tin khi có sự đồng thuận từ chủ nuôi. Mọi thông tin thuốc, liều lượng hoặc y lệnh nội bộ đều được bảo mật tuyệt đối.'

export const MOCK_STORY_CATEGORIES: readonly MockStoryCategory[] = [
  {
    id: 'phuc-hoi',
    name: 'Phục hồi thể trạng',
    badgeLabel: 'Chăm sóc nội trú & Phục hồi',
  },
  {
    id: 'ngoai-khoa',
    name: 'Ngoại khoa & X-quang',
    badgeLabel: 'Chẩn đoán hình ảnh & Can thiệp',
  },
  {
    id: 'cap-cuu',
    name: 'Tiếp nhận cấp cứu',
    badgeLabel: 'Ổn định thể trạng khẩn cấp',
  },
  {
    id: 'kham-dinh-ky',
    name: 'Khám & Xét nghiệm định kỳ',
    badgeLabel: 'Tầm soát & Đánh giá lâm sàng',
  },
]

export const MOCK_STORIES: readonly MockStoryItem[] = [
  {
    id: 'story-01',
    slug: 'ca-dieu-tri-01',
    isMock: true,
    badgeLabel: 'Câu chuyện minh họa — không phải hồ sơ điều trị thực tế',
    title: 'Hành trình theo dõi và phục hồi thể trạng của bé Milo',
    categoryId: 'phuc-hoi',
    categoryName: 'Phục hồi thể trạng',
    petName: 'Bé Milo (Nhân vật minh họa)',
    targetPet: 'Chó',
    date: 'Nội dung minh họa',
    isFeatured: true,
    summary:
      'Tình huống minh họa quy trình tiếp nhận và phối hợp chăm sóc tại viện: tiếp nhận ban đầu, lắng nghe chia sẻ từ gia đình, thăm khám thể trạng lâm sàng, cân nhắc kỹ thuật hỗ trợ theo chỉ định chuyên môn và cập nhật tiến trình cùng chủ nuôi.',
    image: '/images/story-recovery.webp',
    imageAlt: 'Chú cún tươi vui, phục hồi sức sống sau đợt chăm sóc (Ảnh minh họa)',
    overview: {
      condition: 'Biểu hiện mệt mỏi và giảm vận động sau khi sinh hoạt ngoài trời (Tình huống giả định)',
      initialApproach:
        'Tiếp nhận thông tin sinh hoạt từ gia đình và thăm khám thể trạng lâm sàng tổng quát',
      careHighlights:
        'Bố trí lưu trú theo dõi dịu nhẹ, duy trì nước sạch và trao đổi tiến triển cùng chủ nuôi',
    },
    sections: [
      {
        heading: '1. Tiếp nhận ban đầu & Lắng nghe thông tin từ gia đình',
        paragraphs: [
          'Gia đình đưa bé Milo đến Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến khi nhận thấy bé giảm hứng thú với bữa ăn hằng ngày và có biểu hiện mệt mỏi. Nhân viên tiếp đón lắng nghe chia sẻ từ chủ nuôi về thói quen ăn uống, môi trường sinh hoạt và các dấu hiệu bất thường gần đây.',
          'Bác sĩ phụ trách tiến hành thăm khám thể trạng lâm sàng tổng quát: kiểm tra niêm mạc, hô hấp và thể trạng chung, tạo sự thoải mái và an tâm cho bé trong suốt quá trình thăm khám.',
        ],
      },
      {
        heading: '2. Trao đổi chuyên môn & Cân nhắc kỹ thuật hỗ trợ theo chỉ định',
        paragraphs: [
          'Dựa trên kết quả thăm khám ban đầu, bác sĩ trao đổi cặn kẽ cùng gia đình về các phương án theo dõi và cận lâm sàng có thể cân nhắc theo chỉ định chuyên môn.',
          'Gia đình thống nhất gửi bé Milo lưu trú tại khu vực nội trú để đội ngũ y tế theo dõi sát sao thể trạng, duy trì dinh dưỡng dịu nhẹ và cập nhật tình hình sức khỏe thường xuyên cho gia đình.',
        ],
      },
      {
        heading: '3. Theo dõi tiến triển & Dặn dò gia đình kế hoạch chăm sóc',
        paragraphs: [
          'Trong thời gian lưu trú, bé Milo được chăm sóc trong không gian yên tĩnh, sạch sẽ và dần lấy lại sự linh hoạt. Bác sĩ đánh giá lại thể trạng tổng quát trước khi bàn giao bé cho gia đình.',
          'Trước khi ra về, bác sĩ dành thời gian dặn dò gia đình về chế độ sinh hoạt, dinh dưỡng phù hợp và hẹn lịch kiểm tra lại để bảo đảm sức khỏe của bé ổn định lâu dài.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Tiếp nhận ban đầu & Trao đổi thông tin',
        description:
          'Lắng nghe chia sẻ từ gia đình và thực hiện thăm khám lâm sàng tổng quát.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Cân nhắc kỹ thuật & Theo dõi nội trú',
        description:
          'Trao đổi phương án theo chỉ định, bố trí lưu trú yên tĩnh và cập nhật tình trạng.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Bàn giao & Dặn dò kế hoạch chăm sóc',
        description:
          'Đánh giá thể trạng trước xuất viện, hướng dẫn sinh hoạt và hẹn lịch kiểm tra lại.',
        isCompleted: true,
      },
    ],
    relatedSlugs: ['ca-dieu-tri-02', 'ca-dieu-tri-04'],
  },
  {
    id: 'story-02',
    slug: 'ca-dieu-tri-02',
    isMock: true,
    badgeLabel: 'Câu chuyện minh họa — không phải hồ sơ điều trị thực tế',
    title: 'Quy trình thăm khám và hỗ trợ vận động cho bé Bông',
    categoryId: 'ngoai-khoa',
    categoryName: 'Ngoại khoa & X-quang',
    petName: 'Bé Bông (Nhân vật minh họa)',
    targetPet: 'Chó',
    date: 'Nội dung minh họa',
    isFeatured: false,
    summary:
      'Minh họa quy trình tiếp nhận ca vận động khó khăn: ghi nhận biểu hiện từ gia đình, thăm khám lâm sàng vận động, cân nhắc kỹ thuật chẩn đoán hình ảnh theo chỉ định và tư vấn hướng chăm sóc giảm áp lực tại nhà.',
    image: '/images/service-exam.webp',
    imageAlt: 'Bác sĩ thú y thăm khám nhẹ nhàng cho thú cưng (Ảnh minh họa)',
    overview: {
      condition: 'Biểu hiện đi lại khó khăn sau khi vận động trên bề mặt cứng (Tình huống giả định)',
      initialApproach:
        'Thăm khám khả năng vận động và trao đổi phương án khảo sát hình ảnh theo chỉ định',
      careHighlights:
        'Tư vấn chế độ hạn chế vận động mạnh và hướng dẫn gia đình sắp xếp không gian an toàn',
    },
    sections: [
      {
        heading: '1. Tiếp nhận ban đầu & Ghi nhận biểu hiện vận động',
        paragraphs: [
          'Gia đình đưa bé Bông đến viện sau khi nhận thấy bé ngần ngại bước đi và có biểu hiện khó khăn khi di chuyển. Bác sĩ tiếp nhận, lắng nghe mô tả từ chủ nuôi về hoàn cảnh xuất hiện biểu hiện và quan sát dáng đi tự nhiên của bé.',
          'Bác sĩ tiến hành thăm khám nhẹ nhàng, kiểm tra biên độ cử động của các khớp và phản ứng chịu lực của các chi để xác định vị trí cần quan tâm.',
        ],
      },
      {
        heading: '2. Trao đổi chuyên môn & Cân nhắc kỹ thuật chẩn đoán hình ảnh',
        paragraphs: [
          'Để có cơ sở đánh giá cấu trúc xương khớp một cách khách quan, bác sĩ trao đổi cùng gia đình về việc cân nhắc kỹ thuật chụp X-quang theo chỉ định chuyên môn.',
          'Kết quả hình ảnh được bác sĩ giải thích trực tiếp trên màn hình chuyên dụng cùng gia đình, phân tích cấu trúc khớp và đề xuất kế hoạch chăm sóc bảo vệ chi đau.',
        ],
      },
      {
        heading: '3. Tư vấn kế hoạch sinh hoạt & Theo dõi tiến triển',
        paragraphs: [
          'Bác sĩ tư vấn gia đình cách sắp xếp không gian sinh hoạt êm ái, hạn chế để bé nhảy cao hoặc chạy nhảy trên bề mặt trơn trượt trong giai đoạn này.',
          'Gia đình đưa bé đến kiểm tra lại theo lịch hẹn để bác sĩ đánh giá mức độ thích ứng và độ linh hoạt của chi khi vận động.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Tiếp nhận & Thăm khám vận động',
        description:
          'Ghi nhận thông tin từ gia đình và kiểm tra phản xạ vận động ban đầu.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Cân nhắc kỹ thuật & Trao đổi kết quả',
        description:
          'Thực hiện kỹ thuật theo chỉ định chuyên môn và phân tích hình ảnh cùng chủ nuôi.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Tư vấn sinh hoạt & Hẹn lịch kiểm tra',
        description:
          'Hướng dẫn giảm áp lực vận động tại nhà và theo dõi tiến triển sức khỏe.',
        isCompleted: true,
      },
    ],
    relatedSlugs: ['ca-dieu-tri-01', 'ca-dieu-tri-05'],
  },
  {
    id: 'story-03',
    slug: 'ca-dieu-tri-03',
    isMock: true,
    badgeLabel: 'Câu chuyện minh họa — không phải hồ sơ điều trị thực tế',
    title: 'Hỗ trợ kiểm tra sức khỏe và chăm sóc da lông cho mèo Miu',
    categoryId: 'kham-dinh-ky',
    categoryName: 'Khám & Xét nghiệm định kỳ',
    petName: 'Bé Miu (Nhân vật minh họa)',
    targetPet: 'Mèo',
    date: 'Nội dung minh họa',
    isFeatured: false,
    summary:
      'Minh họa tình huống thú cưng có biểu hiện ngứa ngáy da lông: tiếp nhận thông tin từ chủ nuôi, thăm khám bề mặt da lông, cân nhắc kỹ thuật kiểm tra theo chỉ định và tư vấn giải pháp vệ sinh môi trường sống.',
    image: '/images/hero-happy-cat.webp',
    imageAlt: 'Bé mèo thư giãn và thoải mái khi được kiểm tra (Ảnh minh họa)',
    overview: {
      condition: 'Biểu hiện gãi nhiều vùng tai và rụng lông nhẹ (Tình huống giả định)',
      initialApproach:
        'Thăm khám bề mặt da lông và trao đổi phương án lấy mẫu kiểm tra theo chỉ định',
      careHighlights:
        'Tư vấn chế độ vệ sinh dịu nhẹ, giữ môi trường sống khô ráo và hẹn lịch tái khám',
    },
    sections: [
      {
        heading: '1. Tiếp nhận ban đầu & Thăm khám da lông',
        paragraphs: [
          'Chủ nuôi đưa bé Miu đến khám khi nhận thấy bé thường xuyên lắc đầu và dùng chân gãi vào vành tai. Bác sĩ lắng nghe chia sẻ về thói quen sinh hoạt, vị trí nằm ngủ và các biểu hiện gần đây của bé.',
          'Bác sĩ tiến hành quan sát bề mặt da lông tổng quát, kiểm tra các nếp gấp vành tai ngoài và ghi nhận tình trạng thực tế.',
        ],
      },
      {
        heading: '2. Cân nhắc kỹ thuật kiểm tra & Trao đổi kết quả',
        paragraphs: [
          'Để làm rõ nguyên nhân gây khó chịu cho thú cưng, bác sĩ trao đổi cùng gia đình phương án lấy mẫu kiểm tra chuyên môn theo chỉ định.',
          'Bác sĩ giải thích cặn kẽ kết quả kiểm tra cho chủ nuôi, đồng thời hướng dẫn kỹ thuật viên thực hiện các bước làm sạch dịu nhẹ và tạo cảm giác thoải mái cho bé.',
        ],
      },
      {
        heading: '3. Tư vấn vệ sinh môi trường sống & Kế hoạch theo dõi',
        paragraphs: [
          'Bác sĩ chia sẻ các lưu ý về việc giữ không gian ngủ khô thoáng, vệ sinh đệm nằm định kỳ và lựa chọn các dung dịch chăm sóc lông da an toàn.',
          'Gia đình duy trì theo dõi thói quen của bé tại nhà và đưa bé quay lại kiểm tra theo lịch hẹn để bảo đảm da lông phát triển khỏe mạnh.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Tiếp nhận & Khám da lông ban đầu',
        description: 'Ghi nhận biểu hiện từ chủ nuôi và quan sát tình trạng bề mặt da lông.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Cân nhắc kỹ thuật & Trao đổi chuyên môn',
        description: 'Thực hiện kiểm tra theo chỉ định và giải thích kết quả chi tiết cùng gia đình.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Tư vấn môi trường sống & Hẹn lịch kiểm tra',
        description: 'Hướng dẫn vệ sinh không gian nghỉ ngơi và theo dõi phục hồi lông da.',
        isCompleted: true,
      },
    ],
    relatedSlugs: ['ca-dieu-tri-06', 'ca-dieu-tri-01'],
  },
  {
    id: 'story-04',
    slug: 'ca-dieu-tri-04',
    isMock: true,
    badgeLabel: 'Câu chuyện minh họa — không phải hồ sơ điều trị thực tế',
    title: 'Quy trình tiếp nhận cấp cứu và ổn định thể trạng ban đầu của bé Lu',
    categoryId: 'cap-cuu',
    categoryName: 'Tiếp nhận cấp cứu',
    petName: 'Bé Lu (Nhân vật minh họa)',
    targetPet: 'Chó',
    date: 'Nội dung minh họa',
    isFeatured: false,
    summary:
      'Minh họa quy trình phản ứng nhanh trong khung giờ tiếp nhận cấp cứu: tiếp đón khẩn cấp, đánh giá thể trạng ban đầu, cân nhắc kỹ thuật kiểm tra theo chỉ định chuyên môn và trao đổi minh bạch cùng gia đình.',
    image: '/images/hero-vet-care.webp',
    imageAlt: 'Đội ngũ y tế thú y túc trực hỗ trợ khẩn cấp (Ảnh minh họa)',
    overview: {
      condition: 'Biểu hiện mệt mỏi đột ngột và nôn khan sau bữa ăn (Tình huống giả định)',
      initialApproach:
        'Tiếp nhận khẩn cấp, đánh giá các chỉ số sinh hiệu và trao đổi phương án hỗ trợ cùng gia đình',
      careHighlights:
        'Theo dõi thể trạng tại khu vực trực cấp cứu và hướng dẫn gia đình kế hoạch theo dõi tiếp theo',
    },
    sections: [
      {
        heading: '1. Tiếp nhận ưu tiên trong khung giờ trực cấp cứu',
        paragraphs: [
          'Vào khung giờ tối, gia đình liên hệ hotline cấp cứu và đưa bé Lu đến Bệnh viện Thú y Lê Sơn. Đội ngũ y tế tiếp nhận bé ngay tại khu vực đón tiếp và nhanh chóng đưa vào phòng trực chuyên dụng.',
          'Bác sĩ khẩn trương thăm khám thể trạng lâm sàng tổng quát, kiểm tra các chỉ số sinh hiệu cơ bản để nắm bắt tình hình thể trạng của thú cưng trước khi tiến hành các thủ tục hành chính.',
        ],
      },
      {
        heading: '2. Cân nhắc kỹ thuật hỗ trợ & Trao đổi minh bạch cùng gia đình',
        paragraphs: [
          'Bác sĩ trao đổi nhanh chóng, rõ ràng cùng gia đình về các phương án hỗ trợ và kỹ thuật kiểm tra có thể cân nhắc theo chỉ định chuyên môn để khảo sát tình trạng thể trạng.',
          'Trong suốt quá trình này, đội ngũ y tế theo dõi sát sao biểu hiện của bé Lu, áp dụng các biện pháp chăm sóc dịu nhẹ để giúp bé an tâm và giảm bớt căng thẳng.',
        ],
      },
      {
        heading: '3. Ổn định thể trạng & Bàn giao hướng dẫn theo dõi',
        paragraphs: [
          'Sau quá trình theo dõi chặt chẽ tại viện, các chỉ số sinh hiệu của bé Lu dần ổn định, cơ thể thả lỏng và bé có thể nằm nghỉ thoải mái.',
          'Bác sĩ trao đổi cùng gia đình các lưu ý về việc cho bé uống nước, chế độ dinh dưỡng dễ tiêu trong những ngày tới và cung cấp đầu mối liên hệ hỗ trợ khi cần thiết.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Tiếp nhận cấp cứu & Đánh giá thể trạng',
        description: 'Tiếp đón khẩn cấp, kiểm tra chỉ số sinh hiệu và trấn an thú cưng.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Cân nhắc kỹ thuật & Trao đổi phương án',
        description: 'Khảo sát thể trạng theo chỉ định chuyên môn và thống nhất hướng hỗ trợ cùng gia đình.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Ổn định thể trạng & Dặn dò theo dõi',
        description: 'Thể trạng ổn định, bàn giao cho gia đình và hướng dẫn chế độ chăm sóc tại nhà.',
        isCompleted: true,
      },
    ],
    relatedSlugs: ['ca-dieu-tri-01', 'ca-dieu-tri-02'],
  },
  {
    id: 'story-05',
    slug: 'ca-dieu-tri-05',
    isMock: true,
    badgeLabel: 'Câu chuyện minh họa — không phải hồ sơ điều trị thực tế',
    title: 'Quy trình chuẩn bị phẫu thuật và chăm sóc sau can thiệp cho bé Kem',
    categoryId: 'ngoai-khoa',
    categoryName: 'Ngoại khoa & X-quang',
    petName: 'Bé Kem (Nhân vật minh họa)',
    targetPet: 'Mèo',
    date: 'Nội dung minh họa',
    isFeatured: false,
    summary:
      'Minh họa quy trình can thiệp ngoại khoa theo lịch hẹn: kiểm tra sàng lọc thể trạng ban đầu, thực hiện thủ thuật an toàn vô trùng, theo dõi hồi tỉnh tại phòng lưu trú và dặn dò chu đáo cho chủ nuôi.',
    image: '/images/hero-clinic-cuddle.webp',
    imageAlt: 'Bé mèo được ủ ấm trong giai đoạn hồi tỉnh sau phẫu thuật (Ảnh minh họa)',
    overview: {
      condition: 'Chuẩn bị phẫu thuật triệt sản theo nguyện vọng của gia đình (Tình huống giả định)',
      initialApproach:
        'Thăm khám lâm sàng và trao đổi các hạng mục kiểm tra sàng lọc tiền phẫu theo chỉ định',
      careHighlights:
        'Theo dõi hồi tỉnh tại khu vực yên tĩnh, hướng dẫn bảo vệ thể trạng và hẹn lịch tái khám',
    },
    sections: [
      {
        heading: '1. Tiếp nhận & Thăm khám sàng lọc tiền phẫu',
        paragraphs: [
          'Gia đình đặt lịch hẹn hỗ trợ triệt sản cho bé Kem qua website bệnh viện. Khi đến viện, bác sĩ tiếp nhận và kiểm tra thể trạng tổng quát của bé để đánh giá điều kiện sức khỏe ban đầu.',
          'Bác sĩ trao đổi cùng gia đình về quy trình can thiệp, các hạng mục kiểm tra sàng lọc cần thiết theo chỉ định chuyên môn và thời gian dự kiến đón bé.',
        ],
      },
      {
        heading: '2. Can thiệp vô trùng & Chăm sóc giai đoạn hồi tỉnh',
        paragraphs: [
          'Thủ thuật được thực hiện trong môi trường kiểm soát vô trùng theo quy chuẩn chuyên môn. Đội ngũ y tế theo sát tình trạng của bé trong suốt quá trình can thiệp.',
          'Sau can thiệp, bé Kem được chuyển về không gian lưu trú ấm áp, yên tĩnh để theo dõi quá trình hồi tỉnh cho đến khi bé có thể cử động tự nhiên và tỉnh táo hoàn toàn.',
        ],
      },
      {
        heading: '3. Bàn giao bé & Dặn dò kế hoạch chăm sóc sau can thiệp',
        paragraphs: [
          'Bác sĩ gặp trực tiếp gia đình, thông báo kết quả can thiệp tốt đẹp và hướng dẫn cách bảo vệ, chăm sóc bé an toàn khi về nhà.',
          'Gia đình được hẹn lịch kiểm tra lại để bác sĩ đánh giá tiến trình hồi phục và bảo đảm sức khỏe của bé trở lại trạng thái tốt nhất.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Tiếp nhận & Kiểm tra sàng lọc tiền phẫu',
        description: 'Thăm khám thể trạng ban đầu và thống nhất kế hoạch can thiệp cùng chủ nuôi.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Can thiệp vô trùng & Theo dõi hồi tỉnh',
        description: 'Thực hiện thủ thuật an toàn và theo dõi sát quá trình hồi tỉnh tại khu lưu trú.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Bàn giao bé & Hướng dẫn kế hoạch chăm sóc',
        description: 'Bàn giao bé cho gia đình, dặn dò lưu ý sinh hoạt và hẹn lịch tái khám kiểm tra.',
        isCompleted: true,
      },
    ],
    relatedSlugs: ['ca-dieu-tri-03', 'ca-dieu-tri-02'],
  },
  {
    id: 'story-06',
    slug: 'ca-dieu-tri-06',
    isMock: true,
    badgeLabel: 'Câu chuyện minh họa — không phải hồ sơ điều trị thực tế',
    title: 'Kế hoạch theo dõi sức khỏe và kiểm tra định kỳ cho mèo Sim',
    categoryId: 'kham-dinh-ky',
    categoryName: 'Khám & Xét nghiệm định kỳ',
    petName: 'Bé Sim (Nhân vật minh họa)',
    targetPet: 'Mèo',
    date: 'Nội dung minh họa',
    isFeatured: false,
    summary:
      'Minh họa quy trình tầm soát sức khỏe cho thú cưng: tiếp nhận thông tin từ gia đình, thăm khám lâm sàng tổng quát, cân nhắc các kỹ thuật kiểm tra theo chỉ định chuyên môn và cập nhật sổ theo dõi sức khỏe định kỳ.',
    image: '/images/why-pet-companion.webp',
    imageAlt: 'Chủ nuôi cùng thú cưng lắng nghe bác sĩ giải thích kết quả (Ảnh minh họa)',
    overview: {
      condition: 'Kiểm tra sức khỏe và tầm soát thể trạng định kỳ (Tình huống giả định)',
      initialApproach:
        'Thăm khám lâm sàng tổng quát và trao đổi các hạng mục kiểm tra theo chỉ định chuyên môn',
      careHighlights:
        'Phân tích thông tin sức khỏe cùng gia đình và cập nhật dữ liệu vào sổ theo dõi',
    },
    sections: [
      {
        heading: '1. Tiếp nhận ban đầu & Thăm khám lâm sàng định kỳ',
        paragraphs: [
          'Chủ nuôi đưa bé Sim đến bệnh viện để kiểm tra sức khỏe tổng quát định kỳ. Bác sĩ tiếp nhận và trao đổi cùng chủ nuôi về các thói quen ăn uống, mức độ vận động và hành vi sinh hoạt hằng ngày của bé.',
          'Bác sĩ tiến hành thăm khám lâm sàng tổng quát một cách nhẹ nhàng, hạn chế tối đa cảm giác căng thẳng cho thú cưng.',
        ],
      },
      {
        heading: '2. Cân nhắc kỹ thuật kiểm tra & Phân tích thông tin cùng gia đình',
        paragraphs: [
          'Dựa trên thể trạng của bé, bác sĩ trao đổi cùng gia đình về các hạng mục kiểm tra cận lâm sàng có thể cân nhắc theo chỉ định chuyên môn để có bức tranh toàn diện về sức khỏe.',
          'Các thông tin kiểm tra được bác sĩ phân tích chu đáo cùng chủ nuôi, qua đó đưa ra những gợi ý phù hợp về chế độ chăm sóc và sinh hoạt hằng ngày.',
        ],
      },
      {
        heading: '3. Cập nhật hồ sơ theo dõi & Lên kế hoạch kiểm tra tiếp theo',
        paragraphs: [
          'Mọi thông tin trong buổi khám được lưu lại cẩn thận trong sổ theo dõi sức khỏe của thú cưng, tạo cơ sở đối chiếu cho các đợt kiểm tra định kỳ trong tương lai.',
          'Gia đình được tư vấn về các mốc kiểm tra sức khỏe định kỳ tiếp theo để chủ động bảo vệ thể trạng cho bé.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Tiếp nhận & Thăm khám lâm sàng',
        description: 'Ghi nhận thông tin sinh hoạt và tiến hành khám lâm sàng tổng quát.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Cân nhắc kỹ thuật & Trao đổi thông tin',
        description: 'Thực hiện kiểm tra theo chỉ định và giải thích kết quả chi tiết cùng chủ nuôi.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Cập nhật sổ theo dõi sức khỏe',
        description: 'Lưu trữ dữ liệu tham chiếu và hướng dẫn kế hoạch kiểm tra định kỳ.',
        isCompleted: true,
      },
    ],
    relatedSlugs: ['ca-dieu-tri-03', 'ca-dieu-tri-05'],
  },
]
