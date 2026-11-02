// ============================================================================
// PHASE 3 / BATCH 3B — DỮ LIỆU MINH HỌA GÓC THÚ CƯNG & BÀI VIẾT (/goc-thu-cung, /bai-viet/:slug)
// Tuân thủ: Master Prompt V2.0 & Baseline Kiến trúc 2026
// Mọi thông tin đều mang cờ isMock: true.
// Tuyệt đối không chứa hướng dẫn y khoa có thể thực hiện trực tiếp, liều lượng,
// quy trình điều trị hoặc khẳng định hiệu quả chữa bệnh chưa được duyệt.
// Nội dung trung tính về chuẩn bị thông tin khám, lựa chọn lịch khám và chăm sóc chung.
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
  'Các bài viết dưới đây là tài liệu cẩm nang tham khảo — đang hoàn thiện biên tập và thẩm định y khoa trước khi phát hành chính thức. Mọi thông tin mang tính chất định hướng chung, không thay thế cho chỉ định thăm khám lâm sàng trực tiếp từ bác sĩ thú y.'

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
    publishedDate: 'Tháng 10/2026',
    author: 'Biên tập viên y khoa Thú y Lê Sơn (Tham khảo)',
    isFeatured: true,
    excerpt:
      'Tìm hiểu cách phân bổ thức ăn, cung cấp đủ nước sạch và quan sát phản ứng của thú cưng ở từng giai đoạn phát triển mà không gây quá tải cho hệ tiêu hóa.',
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
          'Đối với thú cưng cao niên, việc kiểm soát năng lượng nạp vào giúp giảm tải áp lực cho xương khớp và các cơ quan nội tạng. Chủ nuôi nên thường xuyên theo dõi cân nặng định kỳ tại phòng khám để kịp thời điều chỉnh khẩu phần.',
        ],
        tipBox: {
          title: 'Lưu ý từ chuyên viên dinh dưỡng:',
          content:
            'Không nên thay đổi nhãn hiệu thức ăn hoặc loại thịt quá đột ngột trong một ngày. Việc chuyển đổi từ từ trong vòng 5 – 7 ngày giúp hệ vi sinh đường ruột của bé làm quen êm dịu.',
        },
      },
      {
        id: 'thuc-an-phu-hop',
        heading: '2. Lựa chọn dạng thức ăn phù hợp với sinh hoạt gia đình',
        paragraphs: [
          'Hiện nay, thức ăn hạt khô hoàn chỉnh, pate đóng hộp và thức ăn tự nấu là những lựa chọn phổ biến. Mỗi hình thức đều có ưu điểm riêng: hạt khô tiện lợi và dễ chia bữa; pate cung cấp độ ẩm dồi dào; thức ăn nấu tại nhà giúp chủ nuôi chủ động nguồn nguyên liệu tươi.',
          'Dù lựa chọn phương pháp nào, yếu tố an toàn thực phẩm, không nêm gia vị của người (như muối, đường, hành tỏi) luôn là nguyên tắc cốt lõi cần ghi nhớ.',
        ],
      },
      {
        id: 'nguon-nuoc-sach',
        heading: '3. Tầm quan trọng của nguồn nước sạch mỗi ngày',
        paragraphs: [
          'Nước uống sạch đóng vai trò sống còn trong việc hỗ trợ bài tiết và duy trì chức năng thận cho thú cưng, đặc biệt là các bé mèo có thói quen ít uống nước. Khay nước nên được rửa sạch và thay mới mỗi ngày.',
          'Đặt nhiều bát nước tại các góc yên tĩnh trong nhà hoặc sử dụng đài phun nước tuần hoàn có thể kích thích sự tò mò và khuyến khích bé uống đủ nước hơn.',
        ],
      },
      {
        id: 'khi-nao-can-gap-bac-si',
        heading: '4. Khi nào cần trao đổi trực tiếp cùng bác sĩ thú y?',
        paragraphs: [
          'Nếu thú cưng có biểu hiện bỏ ăn liên tục từ 24 giờ, uống nước nhiều bất thường hoặc có dấu hiệu nôn ói sau bữa ăn, chủ nuôi không nên tự ý đổi các loại thực phẩm bổ sung. Hãy liên hệ hotline hoặc đưa bé đến cơ sở thú y để được bác sĩ thăm khám lâm sàng chu đáo.',
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
    publishedDate: 'Tháng 10/2026',
    author: 'Biên tập viên y khoa Thú y Lê Sơn (Tham khảo)',
    isFeatured: false,
    excerpt:
      'Môi trường ẩm ướt là điều kiện thuận lợi cho nấm mốc và vi khuẩn phát triển. Những thói quen đơn giản giúp giữ môi trường khô thoáng và vệ sinh cho thú cưng.',
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
          'Độ ẩm không khí tăng cao trong mùa mưa khiến đệm nằm của thú cưng dễ bị ẩm mốc nếu đặt sát sàn nhà. Gia đình nên kê đệm lên kệ gỗ hoặc thảm cao su cách ẩm, phơi khô vỏ đệm định kỳ.',
          'Không gian ngủ ấm cúng, tránh luồng gió lùa trực tiếp giúp thú cưng duy trì thân nhiệt ổn định, hạn chế cảm lạnh.',
        ],
      },
      {
        id: 've-sinh-chan-long',
        heading: '2. Vệ sinh bàn chân và đệm lông sau khi ra ngoài',
        paragraphs: [
          'Sau mỗi lần đi dạo ngoài trời mưa, nước bẩn đọng lại giữa các kẽ ngón chân là nguyên nhân hàng đầu gây ngứa rát và viêm kẽ chân. Hãy dùng khăn bông khô lau sạch từng kẽ chân và sấy khô lông vùng bụng.',
          'Nếu bé bị dính bùn đất nhiều, có thể xả nhanh bằng nước ấm sạch rồi sấy khô hoàn toàn, tránh để lông ẩm tự nhiên.',
        ],
        tipBox: {
          title: 'Mẹo nhỏ mùa mưa:',
          content:
            'Chuẩn bị sẵn một chiếc khăn khô ngay cạnh cửa ra vào để thấm nhanh nước mưa trên lông trước khi bé chạy vào trong nhà.',
        },
      },
      {
        id: 'nhan-biet-bat-thuong',
        heading: '3. Nhận biết sớm các biểu hiện khó chịu ở da lông',
        paragraphs: [
          'Thường xuyên kiểm tra các vùng da dưới cổ, nách và kẽ tai. Nếu nhận thấy thú cưng liếm chân liên tục, da xuất hiện vệt đỏ hoặc có mùi lạ, hãy đưa bé đến gặp bác sĩ để kiểm tra lâm sàng kịp thời.',
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
    publishedDate: 'Tháng 09/2026',
    author: 'Biên tập viên y khoa Thú y Lê Sơn (Tham khảo)',
    isFeatured: false,
    excerpt:
      'Ghi nhớ lịch sử tiêm phòng, thói quen ăn uống và quay lại các biểu hiện bất thường giúp buổi thăm khám cùng bác sĩ diễn ra nhanh chóng, chính xác.',
    image: '/images/article-firstaid.webp',
    imageAlt: 'Sổ theo dõi sức khỏe và lịch trình thăm khám của thú cưng (Ảnh minh họa)',
    tableOfContents: [
      { id: 'so-theo-doi', title: '1. Mang theo sổ theo dõi và tiền sử thăm khám' },
      { id: 'ghi-nho-bieu-hien', title: '2. Tóm tắt biểu hiện sinh hoạt 48 giờ gần nhất' },
      { id: 'dung-cu-van-chuyen', title: '3. Chuẩn bị túi vận chuyển hoặc dây dắt an toàn' },
    ],
    sections: [
      {
        id: 'so-theo-doi',
        heading: '1. Mang theo sổ theo dõi và tiền sử thăm khám',
        paragraphs: [
          'Cuốn sổ tiêm phòng hoặc hình ảnh các đơn khám trước đây là tài liệu vô cùng giá trị đối với bác sĩ thú y. Nhờ đó, bác sĩ có thể nắm bắt lịch tiêm chủng, cân nặng qua các mốc thời gian và những lưu ý thể trạng riêng của bé.',
          'Nếu thú cưng từng có phản ứng nhạy cảm với bất kỳ loại thuốc nào, gia đình nên ghi chú rõ ràng ở trang đầu của sổ khám.',
        ],
      },
      {
        id: 'ghi-nho-bieu-hien',
        heading: '2. Tóm tắt biểu hiện sinh hoạt 48 giờ gần nhất',
        paragraphs: [
          'Những chi tiết như: bé ăn hết mấy phần thức ăn, uống nước nhiều hay ít, tần suất đi vệ sinh, và biểu hiện uể oải bắt đầu từ lúc nào đều cung cấp manh mối quý giá.',
          'Nếu bé có các biểu hiện ngắn như ho nhẹ, dáng đi khập khiễng thoáng qua, chủ nuôi có thể dùng điện thoại quay lại đoạn video ngắn để cho bác sĩ quan sát trực tiếp.',
        ],
        tipBox: {
          title: 'Kinh nghiệm hữu ích:',
          content:
            'Video quay lại tư thế dáng đi hoặc phản ứng lúc ở nhà thường tự nhiên hơn rất nhiều so với khi bé đến phòng khám trong trạng thái e dè.',
        },
      },
      {
        id: 'dung-cu-van-chuyen',
        heading: '3. Chuẩn bị túi vận chuyển hoặc dây dắt an toàn',
        paragraphs: [
          'Môi trường phòng khám có nhiều âm thanh lạ và sự hiện diện của các bạn thú cưng khác. Sử dụng túi vận chuyển thoáng khí cho mèo hoặc dây dắt có yếm ngực cho chó giúp bảo đảm an toàn cho chính bé và mọi người xung quanh.',
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
    publishedDate: 'Tháng 09/2026',
    author: 'Biên tập viên y khoa Thú y Lê Sơn (Tham khảo)',
    isFeatured: false,
    excerpt:
      'Nhiệt độ thay đổi đột ngột có thể khiến thú cưng mệt mỏi hoặc giảm khẩu phần ăn. Cách tạo môi trường ổn định nhiệt độ và theo dõi sức khỏe chủ động.',
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
          'Những đợt gió lạnh đầu mùa thường khiến các bé cún nhỏ, mèo con hoặc thú cưng lớn tuổi bị run rẩy. Gia đình nên dời chuồng hoặc đệm ngủ xa cửa sổ và nơi có gió lùa trực tiếp.',
          'Đối với thú cưng lông ngắn, có thể lót thêm một tấm chăn nỉ mềm để bé tự cuộn mình ủ ấm khi ngủ.',
        ],
      },
      {
        id: 'khau-phan-on-dinh',
        heading: '2. Duy trì khẩu phần ăn đều đặn, không đổi món đột ngột',
        paragraphs: [
          'Thời tiết lạnh có thể kích thích thú cưng muốn ăn nhiều hơn một chút, tuy nhiên không nên tăng lượng thức ăn ồ ạt. Hãy duy trì lịch ăn cố định và hâm ấm thức ăn ướt nếu bảo quản trong tủ lạnh trước đó.',
        ],
      },
      {
        id: 'chu-dong-lien-he',
        heading: '3. Chủ động liên hệ cơ sở y tế khi có dấu hiệu li bì',
        paragraphs: [
          'Chảy nước mũi trong, hắt hơi liên tục hoặc ngủ li bì không muốn dậy vận động là những tín hiệu nhắc nhở gia đình cần trao đổi với bác sĩ thú y để được tư vấn chăm sóc phù hợp.',
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
    publishedDate: 'Tháng 08/2026',
    author: 'Biên tập viên y khoa Thú y Lê Sơn (Tham khảo)',
    isFeatured: false,
    excerpt:
      'Tiêm phòng chỉ nên thực hiện khi thú cưng hoàn toàn khỏe mạnh. Cần kiểm tra thể trạng trước tiêm và lưu ý chế độ nghỉ ngơi sau khi tiêm vaccine.',
    image: '/images/service-exam.webp',
    imageAlt: 'Bác sĩ kiểm tra sức khỏe trước khi thực hiện tiêm phòng (Ảnh minh họa)',
    tableOfContents: [
      { id: 'dieu-kien-tiem', title: '1. Điều kiện thể trạng cần thiết trước khi tiêm' },
      { id: 'theo-doi-sau-tiem', title: '2. Theo dõi phản ứng sau tiêm tại nhà' },
      { id: 'lich-nhac-lai', title: '3. Duy trì lịch tiêm nhắc lại theo tư vấn' },
    ],
    sections: [
      {
        id: 'dieu-kien-tiem',
        heading: '1. Điều kiện thể trạng cần thiết trước khi tiêm',
        paragraphs: [
          'Vaccine chỉ phát huy hiệu quả bảo vệ tốt nhất khi hệ miễn dịch của thú cưng đang trong trạng thái khỏe mạnh. Trước khi tiêm, bác sĩ thú y sẽ kiểm tra thân nhiệt, nghe tim phổi và hỏi thăm về tình trạng phân, thói quen ăn uống trong 3 ngày gần nhất.',
          'Nếu thú cưng đang sốt nhẹ, tiêu chảy hoặc vừa chuyển nhà mới, bác sĩ sẽ tư vấn dời lịch tiêm để bé có thời gian thích nghi.',
        ],
      },
      {
        id: 'theo-doi-sau-tiem',
        heading: '2. Theo dõi phản ứng sau tiêm tại nhà',
        paragraphs: [
          'Sau khi tiêm, thú cưng nên được lưu lại cơ sở khoảng 15 – 30 phút để theo dõi phản ứng ban đầu. Khi về nhà, bé có thể hơi buồn ngủ hoặc giảm hoạt bát nhẹ trong 24 giờ đầu — đây là phản ứng thông thường.',
          'Hạn chế tắm gội hoặc cho bé vận động mạnh ngoài trời trong vòng 5 – 7 ngày sau khi tiêm chủng.',
        ],
      },
      {
        id: 'lich-nhac-lai',
        heading: '3. Duy trì lịch tiêm nhắc lại theo tư vấn chuyên môn',
        paragraphs: [
          'Ghi nhớ các mốc tiêm nhắc lại hằng năm giúp duy trì kháng thể bảo vệ bền vững. Chủ nuôi có thể nhờ nhân viên phòng khám ghi rõ lịch hẹn tiếp theo vào sổ sức khỏe của bé.',
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
    publishedDate: 'Tháng 08/2026',
    author: 'Biên tập viên y khoa Thú y Lê Sơn (Tham khảo)',
    isFeatured: false,
    excerpt:
      'Chải lông thường xuyên không chỉ giúp loại bỏ lông rụng mà còn là cơ hội phát hiện sớm các bất thường trên bề mặt da của thú cưng.',
    image: '/images/service-spa.webp',
    imageAlt: 'Chải chuốt lông mềm mại và vệ sinh nhẹ nhàng cho thú cưng (Ảnh minh họa)',
    tableOfContents: [
      { id: 'lua-chon-luoc', title: '1. Lựa chọn lược chải phù hợp với chất lông' },
      { id: 'thao-tac-nhe-nhang', title: '2. Thao tác chải êm ái, kiên nhẫn' },
      { id: 'phat-hien-som', title: '3. Đưa thú cưng đi khám khi thấy tổn thương da' },
    ],
    sections: [
      {
        id: 'lua-chon-luoc',
        heading: '1. Lựa chọn lược chải phù hợp với chất lông',
        paragraphs: [
          'Thú cưng lông dài cần các loại lược có răng thép không gỉ bo tròn đầu để dễ dàng gỡ các nút rối sát chân lông mà không làm trầy xước da. Với thú cưng lông ngắn, lược găng tay cao su mềm giúp gom lông rụng hiệu quả.',
        ],
      },
      {
        id: 'thao-tac-nhe-nhang',
        heading: '2. Thao tác chải êm ái, kiên nhẫn tạo sự tin tưởng',
        paragraphs: [
          'Bắt đầu chải từ các vùng bé thích như lưng hoặc dưới cằm, sau đó mới di chuyển đến các vùng nhạy cảm hơn như bụng và đuôi. Kết hợp vuốt ve khen ngợi để bé xem việc chải lông là khoảng thời gian gắn kết thú vị.',
        ],
      },
      {
        id: 'phat-hien-som',
        heading: '3. Đưa thú cưng đi khám khi thấy tổn thương da',
        paragraphs: [
          'Trong quá trình chải lông, nếu quan sát thấy các vảy gàu dày, đốm đỏ hoặc bé phản ứng giật mình đau đớn, gia đình nên đặt lịch khám để bác sĩ da liễu kiểm tra chi tiết.',
        ],
      },
    ],
    relatedSlugs: ['cham-soc-mua-mua', 'dinh-duong-an-toan-cho-thu-cung'],
  },
]
