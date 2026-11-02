// ============================================================================
// PHASE 3 / BATCH 3B — DỮ LIỆU MINH HỌA GÓC THÚ CƯNG & BÀI VIẾT (/goc-thu-cung, /bai-viet/:slug)
// Tuân thủ: Master Prompt V2.0 & Baseline Kiến trúc 2026
// Mọi thông tin đều mang cờ isMock: true.
// Tuyệt đối không chứa hướng dẫn y khoa có thể thực hiện trực tiếp, liều lượng,
// ngưỡng con số (ngày/giờ/phút), quy trình điều trị hoặc khẳng định hiệu quả chữa bệnh chưa được duyệt.
// Toàn bộ tác giả và ngày đăng đều dùng nhãn trung tính "Nội dung minh họa".
// ============================================================================

export interface MockArticleSection {
  readonly id: string
  readonly heading: string
  readonly paragraphs: readonly string[]
  readonly tipBox?: {
    readonly title: string
    readonly content: string
  }
}

export interface MockArticleItem {
  readonly id: string
  readonly slug: string
  readonly isMock: true
  readonly badgeLabel: string
  readonly title: string
  readonly categoryId: string
  readonly categoryName: string
  readonly targetPet: 'Chó & Mèo' | 'Mèo' | 'Chó'
  readonly excerpt: string
  readonly readTime: string
  readonly publishedDate: string
  readonly author: string
  readonly image: string
  readonly imageAlt: string
  readonly isFeatured?: boolean
  readonly tableOfContents: readonly {
    readonly id: string
    readonly title: string
  }[]
  readonly sections: readonly MockArticleSection[]
  readonly relatedSlugs: readonly string[]
}

export interface MockArticleCategory {
  readonly id: string
  readonly name: string
  readonly badgeLabel: string
}

export const MOCK_PET_CORNER_EDITORIAL_NOTICE =
  'Các bài viết dưới đây là tài liệu cẩm nang minh họa — đang hoàn thiện biên tập và thẩm định chuyên môn trước khi phát hành chính thức. Mọi thông tin mang tính chất định hướng chung, không thay thế cho chỉ định thăm khám lâm sàng trực tiếp từ bác sĩ thú y.'

export const MOCK_ARTICLE_CATEGORIES: readonly MockArticleCategory[] = [
  {
    id: 'dinh-duong',
    name: 'Dinh dưỡng',
    badgeLabel: 'Chế độ ăn & Nước uống',
  },
  {
    id: 'cham-soc',
    name: 'Chăm sóc hằng ngày',
    badgeLabel: 'Môi trường sống & Vệ sinh',
  },
  {
    id: 'phong-benh',
    name: 'Phòng bệnh & Tiêm phòng',
    badgeLabel: 'Dự phòng sức khỏe',
  },
  {
    id: 'chuan-bi-kham',
    name: 'Chuẩn bị đi khám',
    badgeLabel: 'Kinh nghiệm đi khám thú y',
  },
]

export const MOCK_ARTICLES: readonly MockArticleItem[] = [
  {
    id: 'art-01',
    slug: 'dinh-duong-an-toan-cho-thu-cung',
    isMock: true,
    badgeLabel: 'Bài viết minh họa — đang hoàn thiện biên tập',
    title: 'Xây dựng khẩu phần dinh dưỡng an toàn cho thú cưng theo từng lứa tuổi',
    categoryId: 'dinh-duong',
    categoryName: 'Dinh dưỡng',
    targetPet: 'Chó & Mèo',
    readTime: '5 phút đọc',
    publishedDate: 'Nội dung minh họa',
    author: 'Nội dung minh họa',
    isFeatured: true,
    excerpt:
      'Tìm hiểu cách quan sát thể trạng, cung cấp đủ nước sạch và trao đổi cùng bác sĩ thú y về nhu cầu dinh dưỡng của thú cưng ở từng giai đoạn phát triển.',
    image: '/images/article-nutrition.webp',
    imageAlt: 'Bát thức ăn đầy đặn dinh dưỡng lành mạnh cho thú cưng (Ảnh minh họa)',
    tableOfContents: [
      { id: 'nhu-cau-nang-luong', title: '1. Nhu cầu năng lượng ở từng giai đoạn' },
      { id: 'thuc-an-phu-hop', title: '2. Lựa chọn dạng thức ăn phù hợp' },
      { id: 'nguon-nuoc-sach', title: '3. Tầm quan trọng của nguồn nước sạch' },
      { id: 'khi-nao-can-gap-bac-si', title: '4. Khi nào cần trao đổi cùng bác sĩ?' },
    ],
    sections: [
      {
        id: 'nhu-cau-nang-luong',
        heading: '1. Nhu cầu năng lượng ở từng giai đoạn phát triển',
        paragraphs: [
          'Thú cưng ở các độ tuổi khác nhau có nhu cầu chuyển hóa năng lượng hoàn toàn khác biệt. Chó mèo con trong giai đoạn phát triển thể chất đòi hỏi lượng đạm và vi chất dễ hấp thu, trong khi thú cưng trưởng thành cần sự ổn định để duy trì cân nặng lý tưởng.',
          'Đối với thú cưng cao niên, việc kiểm soát năng lượng nạp vào giúp giảm tải áp lực cho xương khớp và các cơ quan nội tạng. Chủ nuôi nên thường xuyên đưa bé kiểm tra cân nặng định kỳ tại phòng khám để được bác sĩ tư vấn khẩu phần phù hợp.',
        ],
        tipBox: {
          title: 'Lưu ý dinh dưỡng chung:',
          content:
            'Khi có kế hoạch thay đổi chế độ ăn hoặc lựa chọn loại thức ăn mới cho thú cưng, gia đình nên trao đổi cùng bác sĩ thú y để được hướng dẫn phương án chuyển đổi an toàn, phù hợp với thể trạng của bé.',
        },
      },
      {
        id: 'thuc-an-phu-hop',
        heading: '2. Lựa chọn dạng thức ăn phù hợp với sinh hoạt gia đình',
        paragraphs: [
          'Hiện nay, thức ăn hạt khô hoàn chỉnh, pate đóng hộp và thức ăn tự nấu là những lựa chọn phổ biến trong sinh hoạt gia đình. Mỗi hình thức đều có ưu điểm riêng về độ tiện lợi, khả năng cung cấp độ ẩm hoặc nguồn nguyên liệu tươi.',
          'Khi lựa chọn hoặc phối hợp các dạng thức ăn, gia đình nên tham khảo ý kiến bác sĩ thú y để có kế hoạch dinh dưỡng phù hợp với thể trạng của thú cưng, tránh tự ý thay đổi khẩu phần đột ngột.',
        ],
      },
      {
        id: 'nguon-nuoc-sach',
        heading: '3. Tầm quan trọng của nguồn nước sạch',
        paragraphs: [
          'Nước uống sạch đóng vai trò quan trọng trong việc hỗ trợ sinh hoạt hằng ngày và sức khỏe đường tiết niệu của thú cưng. Gia đình nên duy trì nguồn nước sạch sẽ, bố trí tại vị trí thuận tiện để bé dễ dàng tiếp cận.',
          'Bố trí bát nước tại các góc yên tĩnh trong nhà hoặc sử dụng đài phun nước tuần hoàn có thể khuyến khích thú cưng uống nước đều đặn hơn.',
        ],
      },
      {
        id: 'khi-nao-can-gap-bac-si',
        heading: '4. Khi nào cần trao đổi trực tiếp cùng bác sĩ thú y?',
        paragraphs: [
          'Khi nhận thấy thú cưng có bất kỳ thay đổi nào trong thói quen ăn uống hoặc biểu hiện thể trạng bất thường, gia đình nên liên hệ cơ sở thú y để được bác sĩ thăm khám và tư vấn trực tiếp, tránh tự ý sử dụng các loại thực phẩm bổ sung.',
        ],
      },
    ],
    relatedSlugs: ['cham-soc-mua-mua', 'chuan-bi-truoc-khi-dua-thu-cung-di-kham'],
  },
  {
    id: 'art-02',
    slug: 'cham-soc-mua-mua',
    isMock: true,
    badgeLabel: 'Bài viết minh họa — đang hoàn thiện biên tập',
    title: 'Những lưu ý chăm sóc sức khỏe và môi trường sống của thú cưng mùa mưa',
    categoryId: 'cham-soc',
    categoryName: 'Chăm sóc hằng ngày',
    targetPet: 'Chó & Mèo',
    readTime: '4 phút đọc',
    publishedDate: 'Nội dung minh họa',
    author: 'Nội dung minh họa',
    isFeatured: false,
    excerpt:
      'Môi trường ẩm ướt là điều kiện thuận lợi cho ẩm mốc phát triển. Những thói quen vệ sinh đơn giản giúp duy trì không gian khô thoáng và an toàn cho thú cưng.',
    image: '/images/article-prevention.webp',
    imageAlt: 'Thú cưng được giữ ấm áp và khô ráo trong nhà (Ảnh minh họa)',
    tableOfContents: [
      { id: 'khu-vuc-nghi-ngoi', title: '1. Giữ khu vực nghỉ ngơi khô thoáng' },
      { id: 've-sinh-chan-long', title: '2. Vệ sinh bàn chân và đệm lông sau khi ra ngoài' },
      { id: 'nhan-biet-bat-thuong', title: '3. Nhận biết sớm biểu hiện ở da lông' },
    ],
    sections: [
      {
        id: 'khu-vuc-nghi-ngoi',
        heading: '1. Giữ khu vực nghỉ ngơi khô thoáng và ấm áp',
        paragraphs: [
          'Thời tiết mùa mưa với độ ẩm cao là thời điểm gia đình cần quan tâm nhiều hơn đến không gian nghỉ ngơi của thú cưng. Giữ khu vực nằm khô ráo và thoáng khí giúp bé có không gian sinh hoạt thoải mái.',
          'Không gian ngủ ấm cúng, tránh luồng gió lùa trực tiếp giúp thú cưng duy trì thể trạng ổn định khi thời tiết thay đổi.',
        ],
      },
      {
        id: 've-sinh-chan-long',
        heading: '2. Vệ sinh bàn chân và đệm lông sau khi ra ngoài',
        paragraphs: [
          'Sau khi thú cưng sinh hoạt ngoài trời mưa, việc quan sát và giữ cho bé khô ráo giúp hạn chế cảm giác ẩm ướt khó chịu.',
          'Gia đình có thể tham khảo ý kiến bác sĩ thú y về các lưu ý chăm sóc và bảo vệ da lông phù hợp cho từng giống thú cưng trong điều kiện thời tiết ẩm.',
        ],
        tipBox: {
          title: 'Kinh nghiệm mùa mưa:',
          content:
            'Gia đình nên tham vấn bác sĩ thú y về các phương pháp chăm sóc và vệ sinh lông da phù hợp với từng bé trong điều kiện thời tiết ẩm ướt.',
        },
      },
      {
        id: 'nhan-biet-bat-thuong',
        heading: '3. Nhận biết sớm các biểu hiện khó chịu ở da lông',
        paragraphs: [
          'Việc quan sát thói quen sinh hoạt và bề mặt lông da giúp phát hiện sớm các dấu hiệu cần quan tâm. Khi nhận thấy thú cưng có biểu hiện khó chịu hoặc thay đổi trên da, gia đình nên đưa bé đến cơ sở thú y để được bác sĩ kiểm tra và hướng dẫn chăm sóc đúng cách.',
        ],
      },
    ],
    relatedSlugs: ['dinh-duong-an-toan-cho-thu-cung', 'cham-soc-suc-khoe-thoi-tiet-giao-mua'],
  },
  {
    id: 'art-03',
    slug: 'chuan-bi-truoc-khi-dua-thu-cung-di-kham',
    isMock: true,
    badgeLabel: 'Bài viết minh họa — đang hoàn thiện biên tập',
    title: 'Chuẩn bị thông tin gì trước khi đưa thú cưng đi khám định kỳ?',
    categoryId: 'chuan-bi-kham',
    categoryName: 'Chuẩn bị đi khám',
    targetPet: 'Chó & Mèo',
    readTime: '6 phút đọc',
    publishedDate: 'Nội dung minh họa',
    author: 'Nội dung minh họa',
    isFeatured: false,
    excerpt:
      'Ghi nhớ lịch sử thăm khám, thói quen ăn uống và quay lại các biểu hiện khác thường giúp buổi thăm khám cùng bác sĩ diễn ra nhanh chóng, hiệu quả.',
    image: '/images/article-firstaid.webp',
    imageAlt: 'Sổ theo dõi sức khỏe và lịch trình thăm khám của thú cưng (Ảnh minh họa)',
    tableOfContents: [
      { id: 'so-theo-doi', title: '1. Mang theo sổ theo dõi và tiền sử thăm khám' },
      { id: 'ghi-nho-bieu-hien', title: '2. Ghi nhận thói quen sinh hoạt và biểu hiện gần đây' },
      { id: 'dung-cu-van-chuyen', title: '3. Chuẩn bị túi vận chuyển hoặc dây dắt an toàn' },
    ],
    sections: [
      {
        id: 'so-theo-doi',
        heading: '1. Mang theo sổ theo dõi và tiền sử thăm khám',
        paragraphs: [
          'Cuốn sổ tiêm phòng hoặc thông tin các lần thăm khám trước đây là tài liệu hữu ích đối với bác sĩ thú y. Nhờ đó, bác sĩ có thể nắm bắt lịch tiêm chủng và những lưu ý thể trạng riêng của bé.',
          'Nếu thú cưng từng có tiền sử nhạy cảm với bất kỳ yếu tố nào, gia đình nên chủ động chia sẻ cùng bác sĩ ngay từ đầu buổi thăm khám.',
        ],
      },
      {
        id: 'ghi-nho-bieu-hien',
        heading: '2. Ghi nhận thói quen sinh hoạt và biểu hiện gần đây',
        paragraphs: [
          'Những thông tin về thói quen sinh hoạt, lượng thức ăn nước uống hằng ngày và mức độ vận động đều là cơ sở tham khảo cho bác sĩ trong quá trình trao đổi.',
          'Nếu nhận thấy các biểu hiện khác thường trong sinh hoạt tại nhà, chủ nuôi có thể ghi chú lại hoặc ghi hình để chia sẻ cùng bác sĩ trong buổi thăm khám.',
        ],
        tipBox: {
          title: 'Kinh nghiệm hữu ích:',
          content:
            'Hình ảnh hoặc video ngắn ghi lại thói quen sinh hoạt lúc ở nhà giúp bác sĩ có thêm thông tin tham khảo trực quan trong quá trình thăm khám.',
        },
      },
      {
        id: 'dung-cu-van-chuyen',
        heading: '3. Chuẩn bị túi vận chuyển hoặc dây dắt an toàn',
        paragraphs: [
          'Môi trường phòng khám có nhiều âm thanh lạ và sự hiện diện của các bạn thú cưng khác. Sử dụng túi vận chuyển thoáng khí cho mèo hoặc dây dắt an toàn cho chó giúp bảo đảm sự thuận tiện cho bé và mọi người xung quanh.',
        ],
      },
    ],
    relatedSlugs: ['dinh-duong-an-toan-cho-thu-cung', 'luu-y-khi-dua-thu-cung-di-tiem-phong'],
  },
  {
    id: 'art-04',
    slug: 'cham-soc-suc-khoe-thoi-tiet-giao-mua',
    isMock: true,
    badgeLabel: 'Bài viết minh họa — đang hoàn thiện biên tập',
    title: 'Theo dõi thói quen sinh hoạt của thú cưng khi thời tiết giao mùa',
    categoryId: 'phong-benh',
    categoryName: 'Phòng bệnh & Tiêm phòng',
    targetPet: 'Chó & Mèo',
    readTime: '4 phút đọc',
    publishedDate: 'Nội dung minh họa',
    author: 'Nội dung minh họa',
    isFeatured: false,
    excerpt:
      'Nhiệt độ thay đổi đột ngột có thể khiến thú cưng mệt mỏi hoặc giảm khẩu phần ăn. Cách tạo môi trường sống ấm áp và theo dõi sức khỏe chủ động.',
    image: '/images/hero-happy-cat.webp',
    imageAlt: 'Mèo cưng cuộn tròn ấm áp trong mùa chuyển lạnh (Ảnh minh họa)',
    tableOfContents: [
      { id: 'nhiet-do-song', title: '1. Điều chỉnh không gian sống tránh gió lùa' },
      { id: 'khau-phan-on-dinh', title: '2. Duy trì khẩu phần ăn đều đặn' },
      { id: 'chu-dong-lien-he', title: '3. Chủ động liên hệ khi có dấu hiệu bất thường' },
    ],
    sections: [
      {
        id: 'nhiet-do-song',
        heading: '1. Điều chỉnh không gian sống tránh gió lùa',
        paragraphs: [
          'Thời điểm giao mùa với sự thay đổi nhiệt độ có thể ảnh hưởng đến thói quen sinh hoạt của thú cưng. Gia đình nên bố trí nơi ngủ xa cửa sổ và nơi có gió lùa trực tiếp.',
          'Duy trì không gian nghỉ ngơi ấm áp giúp thú cưng cảm thấy thoải mái và an tâm hơn trong sinh hoạt hằng ngày.',
        ],
      },
      {
        id: 'khau-phan-on-dinh',
        heading: '2. Duy trì khẩu phần ăn đều đặn, không đổi món đột ngột',
        paragraphs: [
          'Khi thời tiết chuyển mùa, gia đình nên duy trì chế độ dinh dưỡng ổn định và trao đổi cùng bác sĩ thú y trước khi có bất kỳ điều chỉnh nào về khẩu phần ăn.',
        ],
      },
      {
        id: 'chu-dong-lien-he',
        heading: '3. Chủ động liên hệ cơ sở y tế khi có dấu hiệu li bì',
        paragraphs: [
          'Khi nhận thấy thú cưng có biểu hiện mệt mỏi, giảm vận động hoặc thay đổi thể trạng, gia đình nên chủ động liên hệ cơ sở thú y để được bác sĩ thăm khám và tư vấn kịp thời.',
        ],
      },
    ],
    relatedSlugs: ['cham-soc-mua-mua', 'chuan-bi-truoc-khi-dua-thu-cung-di-kham'],
  },
  {
    id: 'art-05',
    slug: 'luu-y-khi-dua-thu-cung-di-tiem-phong',
    isMock: true,
    badgeLabel: 'Bài viết minh họa — đang hoàn thiện biên tập',
    title: 'Các mốc theo dõi quan trọng khi chuẩn bị tiêm phòng cho chó mèo',
    categoryId: 'phong-benh',
    categoryName: 'Phòng bệnh & Tiêm phòng',
    targetPet: 'Chó & Mèo',
    readTime: '5 phút đọc',
    publishedDate: 'Nội dung minh họa',
    author: 'Nội dung minh họa',
    isFeatured: false,
    excerpt:
      'Tiêm phòng chỉ nên thực hiện khi thú cưng hoàn toàn khỏe mạnh. Cần kiểm tra thể trạng trước tiêm và lưu ý chế độ nghỉ ngơi theo hướng dẫn của bác sĩ.',
    image: '/images/service-exam.webp',
    imageAlt: 'Bác sĩ kiểm tra sức khỏe trước khi thực hiện tiêm phòng (Ảnh minh họa)',
    tableOfContents: [
      { id: 'dieu-kien-tiem', title: '1. Điều kiện thể trạng cần thiết trước khi tiêm' },
      { id: 'theo-doi-sau-tiem', title: '2. Lắng nghe hướng dẫn theo dõi sau tiêm từ bác sĩ' },
      { id: 'lich-nhac-lai', title: '3. Duy trì lịch tiêm nhắc lại theo tư vấn' },
    ],
    sections: [
      {
        id: 'dieu-kien-tiem',
        heading: '1. Điều kiện thể trạng cần thiết trước khi tiêm',
        paragraphs: [
          'Tiêm chủng là biện pháp phòng ngừa quan trọng cần được thực hiện dựa trên đánh giá trực tiếp từ bác sĩ thú y. Trong buổi hẹn, bác sĩ sẽ tiến hành thăm khám lâm sàng tổng quát để xác định thú cưng có đủ điều kiện sức khỏe cho việc tiêm phòng hay không.',
          'Nếu nhận thấy thú cưng có dấu hiệu mệt mỏi hoặc thay đổi thể trạng, bác sĩ sẽ tư vấn kế hoạch tiêm phòng phù hợp nhất cho bé.',
        ],
      },
      {
        id: 'theo-doi-sau-tiem',
        heading: '2. Lắng nghe hướng dẫn theo dõi sau tiêm từ bác sĩ',
        paragraphs: [
          'Sau khi tiêm, chủ nuôi lắng nghe kỹ các dặn dò chuyên môn và chế độ chăm sóc từ bác sĩ thú y phụ trách. Nếu có bất kỳ băn khoăn nào về tình trạng của bé, hãy liên hệ trực tiếp với cơ sở thú y để được hỗ trợ kịp thời.',
          'Bác sĩ sẽ hướng dẫn gia đình các lưu ý theo dõi sinh hoạt phù hợp cho bé trong những ngày tiếp theo.',
        ],
      },
      {
        id: 'lich-nhac-lai',
        heading: '3. Duy trì lịch tiêm nhắc lại theo tư vấn chuyên môn',
        paragraphs: [
          'Việc duy trì lịch tiêm phòng định kỳ được thực hiện dựa trên tư vấn của bác sĩ thú y phù hợp với từng độ tuổi và lối sống của thú cưng. Gia đình nên lưu giữ sổ theo dõi sức khỏe để tiện đối chiếu các lịch hẹn tiếp theo.',
        ],
      },
    ],
    relatedSlugs: ['chuan-bi-truoc-khi-dua-thu-cung-di-kham', 've-sinh-long-da-cho-meo-dung-cach'],
  },
  {
    id: 'art-06',
    slug: 've-sinh-long-da-cho-meo-dung-cach',
    isMock: true,
    badgeLabel: 'Bài viết minh họa — đang hoàn thiện biên tập',
    title: 'Chăm sóc vệ sinh lông da định kỳ: Những điều chủ nuôi cần lưu ý',
    categoryId: 'cham-soc',
    categoryName: 'Chăm sóc hằng ngày',
    targetPet: 'Chó & Mèo',
    readTime: '4 phút đọc',
    publishedDate: 'Nội dung minh họa',
    author: 'Nội dung minh họa',
    isFeatured: false,
    excerpt:
      'Chải lông thường xuyên không chỉ giúp loại bỏ lông rụng mà còn là cơ hội phát hiện sớm các dấu hiệu bất thường trên bề mặt da của thú cưng.',
    image: '/images/service-spa.webp',
    imageAlt: 'Chải chuốt lông mềm mại và vệ sinh nhẹ nhàng cho thú cưng (Ảnh minh họa)',
    tableOfContents: [
      { id: 'lua-chon-luoc', title: '1. Lựa chọn lược chải phù hợp với chất lông' },
      { id: 'thao-tac-nhe-nhang', title: '2. Thao tác chải êm ái, kiên nhẫn' },
      { id: 'phat-hien-som', title: '3. Đưa thú cưng đi khám khi thấy biểu hiện bất thường trên da' },
    ],
    sections: [
      {
        id: 'lua-chon-luoc',
        heading: '1. Lựa chọn lược chải phù hợp với chất lông',
        paragraphs: [
          'Mỗi loại lông và thể trạng da của thú cưng đều có nhu cầu chăm sóc riêng biệt. Gia đình có thể tham khảo ý kiến chuyên môn từ bác sĩ thú y hoặc chuyên viên chăm sóc để lựa chọn dụng cụ chải lông phù hợp, an toàn cho thú cưng.',
        ],
      },
      {
        id: 'thao-tac-nhe-nhang',
        heading: '2. Thao tác chải êm ái, kiên nhẫn tạo sự tin tưởng',
        paragraphs: [
          'Chăm sóc lông da nên được thực hiện với thao tác êm ái, nhẹ nhàng để tạo cảm giác an tâm cho bé. Duy trì không khí thoải mái giúp thú cưng làm quen và hợp tác trong quá trình vệ sinh hằng ngày.',
        ],
      },
      {
        id: 'phat-hien-som',
        heading: '3. Đưa thú cưng đi khám khi thấy biểu hiện bất thường trên da',
        paragraphs: [
          'Nếu nhận thấy các dấu hiệu bất thường trên da hoặc bé có phản ứng khó chịu trong quá trình vệ sinh, gia đình nên liên hệ cơ sở thú y để bác sĩ kiểm tra và đưa ra lời khuyên chuyên môn.',
        ],
      },
    ],
    relatedSlugs: ['cham-soc-mua-mua', 'dinh-duong-an-toan-cho-thu-cung'],
  },
]
