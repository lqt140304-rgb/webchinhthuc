// ============================================================================
// PHASE 3 / BATCH 3B — DỮ LIỆU MINH HỌA CÂU CHUYỆN ĐIỀU TRỊ (/cau-chuyen)
// Tuân thủ: Master Prompt V2.0 & Baseline Kiến trúc 2026
// Mọi thông tin đều mang cờ isMock: true.
// Toàn bộ ca bệnh demo được đánh dấu: "Câu chuyện minh họa — không phải hồ sơ điều trị thực tế".
// Tuyệt đối không tạo bệnh nhân giả, bác sĩ giả, chẩn đoán, phác đồ, liều thuốc hay kết quả điều trị giả.
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
    petName: 'Bé Milo (Corgi, 2 tuổi)',
    targetPet: 'Chó',
    date: 'Tháng 10/2026',
    isFeatured: true,
    summary:
      'Tình huống minh họa quy trình phối hợp chăm sóc tại viện: tiếp nhận thăm khám lâm sàng, thực hiện xét nghiệm và siêu âm kiểm tra theo chỉ định, kết hợp chăm sóc nội trú và cập nhật tình hình sức khỏe định kỳ cho gia đình.',
    image: '/images/story-recovery.webp',
    imageAlt: 'Chú cún tươi vui, phục hồi sức sống sau đợt chăm sóc (Ảnh minh họa)',
    overview: {
      condition: 'Biểu hiện mệt mỏi, kén ăn và giảm vận động sau khi sinh hoạt ngoài trời',
      initialApproach:
        'Thăm khám lâm sàng tổng quát, kiểm tra thân nhiệt và chỉ định xét nghiệm cận lâm sàng phù hợp',
      careHighlights:
        'Theo dõi lưu trú tại ô riêng biệt, duy trì bổ sung nước sạch và bữa ăn dễ tiêu hóa',
    },
    sections: [
      {
        heading: '1. Tiếp nhận ban đầu & Đánh giá thể trạng lâm sàng',
        paragraphs: [
          'Gia đình đưa bé Milo đến Bệnh viện Thú y Lê Sơn tại 101 Khuất Duy Tiến trong tình trạng bé giảm hứng thú với bữa ăn hằng ngày và có biểu hiện mệt mỏi kéo dài. Nhân viên tiếp đón lắng nghe chia sẻ từ chủ nuôi về thói quen ăn uống, môi trường sinh hoạt và các dấu hiệu bất thường trong 24 giờ qua.',
          'Bác sĩ phụ trách tiến hành thăm khám thể trạng: kiểm tra niêm mạc mắt miệng, đo nhịp tim phổi và sờ nắn ổ bụng. Để có cơ sở đánh giá chính xác, bác sĩ trao đổi cùng gia đình phương án thực hiện xét nghiệm huyết học và siêu âm tổng quát.',
        ],
      },
      {
        heading: '2. Phối hợp cận lâm sàng & Theo dõi tại khu lưu trú nội trú',
        paragraphs: [
          'Kết quả xét nghiệm máu và hình ảnh siêu âm được giải thích trực tiếp cho gia đình. Để bảo đảm thể trạng của bé được giám sát chu đáo, gia đình thống nhất gửi bé Milo lưu trú tại khu vực nội trú.',
          'Tại đây, bé được bố trí không gian nghỉ ngơi yên tĩnh, thông thoáng và sạch sẽ. Đội ngũ y tế theo dõi sát sao lượng nước uống, mức độ tiếp nhận thức ăn mềm và ghi nhận tiến triển thể trạng trong sổ theo dõi.',
        ],
      },
      {
        heading: '3. Phục hồi thể trạng & Hướng dẫn gia đình chăm sóc tại nhà',
        paragraphs: [
          'Sau quá trình theo dõi và hỗ trợ chăm sóc phù hợp, bé Milo dần tìm lại sự linh hoạt, ánh mắt tươi vui và chủ động ăn hết khẩu phần ăn được chuẩn bị. Bác sĩ kiểm tra lại các chỉ số lâm sàng trước khi bàn giao bé cho gia đình.',
          'Trước khi ra về, bác sĩ dành thời gian dặn dò gia đình về việc duy trì nguồn nước sạch, cách chia nhỏ bữa ăn trong những ngày đầu và lưu ý lịch hẹn tái khám định kỳ.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Tiếp nhận & Kiểm tra cận lâm sàng',
        description:
          'Khám lâm sàng ban đầu, thực hiện xét nghiệm và siêu âm theo chỉ định chuyên môn.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Theo dõi tại khu nội trú',
        description:
          'Lưu trú tại ô yên tĩnh, chăm sóc dinh dưỡng dịu nhẹ và cập nhật tình trạng định kỳ.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Đánh giá xuất viện & Dặn dò tại gia',
        description:
          'Kiểm tra thể trạng trước khi xuất viện, hướng dẫn chăm sóc và hẹn lịch tái khám.',
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
    title: 'Quy trình thăm khám và hỗ trợ chấn thương vận động cho bé Bông',
    categoryId: 'ngoai-khoa',
    categoryName: 'Ngoại khoa & X-quang',
    petName: 'Bé Bông (Poodle, 3 tuổi)',
    targetPet: 'Chó',
    date: 'Tháng 09/2026',
    isFeatured: false,
    summary:
      'Minh họa quy trình tiếp nhận ca vận động khó khăn: chụp X-quang khảo sát cấu trúc xương khớp, tư vấn hướng hỗ trợ vận động và chăm sóc giảm áp lực tại nhà.',
    image: '/images/service-exam.webp',
    imageAlt: 'Bác sĩ thú y thăm khám nhẹ nhàng cho thú cưng (Ảnh minh họa)',
    overview: {
      condition: 'Khập khiễng chi sau sau khi nhảy từ ghế cao xuống sàn cứng',
      initialApproach:
        'Chụp X-quang 2 tư thế để khảo sát ổ khớp, xương cẳng chân và các mô mềm liên quan',
      careHighlights:
        'Hạn chế vận động mạnh, hướng dẫn gia đình kê đệm êm và theo dõi tái khám',
    },
    sections: [
      {
        heading: '1. Kiểm tra phản xạ vận động & Chỉ định X-quang',
        paragraphs: [
          'Bé Bông được gia đình đưa đến viện sau khi nhận thấy bé nhấc một chân sau và ngần ngại bước đi. Bác sĩ kiểm tra mức độ co duỗi của các khớp, phản ứng đau và kiểm tra trục xương cẳng chân.',
          'Để loại trừ khả năng gãy xương kín hoặc trật khớp bánh chè, bác sĩ đề xuất chụp X-quang kỹ thuật. Kỹ thuật viên hỗ trợ cố định tư thế cho bé ân cần, giúp quá trình ghi hình diễn ra an toàn.',
        ],
      },
      {
        heading: '2. Phân tích hình ảnh X-quang cùng chủ nuôi',
        paragraphs: [
          'Hình ảnh phim chụp được bác sĩ phóng to và đối chiếu trực tiếp trên màn hình chuyên dụng cùng gia đình. Bác sĩ giải thích tình trạng khớp gối, hướng dẫn cách cố định nhẹ nhàng và bảo vệ chân bị đau.',
          'Gia đình được hướng dẫn không để bé leo cầu thang hoặc nhảy lên xuống sofa trong vòng 2 tuần để mô mềm xung quanh khớp có thời gian hồi phục tự nhiên.',
        ],
      },
      {
        heading: '3. Theo dõi hồi phục và dặn dò sinh hoạt',
        paragraphs: [
          'Sau một thời gian nghỉ ngơi hạn chế vận động theo dặn dò của bác sĩ, dáng đi của bé Bông dần cân bằng trở lại. Gia đình đưa bé đến tái khám đúng lịch hẹn để bác sĩ kiểm tra lại độ linh hoạt của khớp gối.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Kiểm tra phản xạ & Chụp X-quang',
        description: 'Đánh giá dáng đi, chụp X-quang kiểm tra chi tiết cấu trúc xương khớp.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Tư vấn chế độ hạn chế vận động',
        description: 'Giải thích phim chụp, hướng dẫn gia đình cách sắp xếp không gian sinh hoạt êm ái.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Tái khám kiểm tra biên độ vận động',
        description: 'Kiểm tra độ linh hoạt của chi và đánh giá mức độ ổn định của khớp.',
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
    petName: 'Bé Miu (Mèo Anh lông ngắn, 1.5 tuổi)',
    targetPet: 'Mèo',
    date: 'Tháng 09/2026',
    isFeatured: false,
    summary:
      'Minh họa tình huống thú cưng ngứa ngáy da lông: kiểm tra bề mặt da, xét nghiệm mẫu soi biểu bì và tư vấn sản phẩm tắm vệ sinh dịu nhẹ.',
    image: '/images/hero-happy-cat.webp',
    imageAlt: 'Bé mèo thư giãn và thoải mái khi được kiểm tra (Ảnh minh họa)',
    overview: {
      condition: 'Gãi nhiều vùng tai và rụng lông nhẹ từng mảng nhỏ quanh cổ',
      initialApproach:
        'Kiểm tra đèn soi chuyên dụng, lấy mẫu soi tươi bề mặt da và vành tai ngoài',
      careHighlights:
        'Vệ sinh tai ngoài dịu nhẹ, giữ môi trường sống khô ráo và bổ sung dinh dưỡng da lông',
    },
    sections: [
      {
        heading: '1. Thăm khám da lông & Soi mẫu biểu bì',
        paragraphs: [
          'Chủ nuôi nhận thấy bé Miu liên tục lắc đầu và dùng chân sau gãi vào vành tai. Khi thăm khám, bác sĩ quan sát thấy vùng da quanh cổ có dấu hiệu ửng đỏ và nhiều chất bẩn tích tụ trong nếp gấp vành tai.',
          'Bác sĩ tiến hành lấy mẫu cạo biểu bì và mẫu chất bẩn vành tai để soi trực tiếp dưới kính hiển vi quang học, giúp xác định nguyên nhân kích ứng da lông.',
        ],
      },
      {
        heading: '2. Tư vấn giải pháp vệ sinh và chăm sóc môi trường sống',
        paragraphs: [
          'Bác sĩ chia sẻ chi tiết kết quả soi mẫu cùng chủ nuôi, chỉ ra sự hiện diện của bụi bẩn và dầu nhờn tích tụ. Bác sĩ hướng dẫn kỹ thuật viên thực hiện vệ sinh vành tai ngoài dịu mát cho bé.',
          'Gia đình cũng được khuyến nghị giặt đệm nằm, hút bụi sofa thường xuyên và không dùng các loại xà phòng tắm có tính tẩy rửa mạnh.',
        ],
      },
      {
        heading: '3. Cải thiện lớp lông và duy trì vệ sinh định kỳ',
        paragraphs: [
          'Nhờ việc vệ sinh vành tai đúng cách và cải thiện môi trường ngủ, vùng da cổ của bé Miu dần hết đỏ, lông mọc lại đều và bé không còn gãi tai liên tục.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Khám da & Soi mẫu kính hiển vi',
        description: 'Quan sát tổn thương da lông và lấy mẫu kiểm tra chuyên môn.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Vệ sinh tai ngoài & Hướng dẫn môi trường',
        description: 'Làm sạch vành tai nhẹ nhàng, tư vấn cách khử khuẩn khu vực nằm của mèo.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Theo dõi mọc lông & Tái khám da liễu',
        description: 'Kiểm tra lại độ khô thoáng của tai và sự phát triển của lớp lông mới.',
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
    petName: 'Bé Lu (Golden Retriever, 4 tuổi)',
    targetPet: 'Chó',
    date: 'Tháng 08/2026',
    isFeatured: false,
    summary:
      'Minh họa quy trình phản ứng nhanh trong khung giờ tiếp nhận cấp cứu: đánh giá đường thở, nhịp tim, thông báo tiên lượng cùng gia đình trước khi can thiệp.',
    image: '/images/hero-vet-care.webp',
    imageAlt: 'Đội ngũ y tế thú y túc trực hỗ trợ khẩn cấp (Ảnh minh họa)',
    overview: {
      condition: 'Nôn khan liên tục và thở dốc sau bữa ăn tối tại nhà',
      initialApproach:
        'Ưu tiên cấp cứu đường thở, siêu âm cấp cứu kiểm tra ổ bụng và thông báo dự toán chi phí',
      careHighlights:
        'Theo dõi liên tục tại phòng cấp cứu cho đến khi các chỉ số sinh hiệu ổn định',
    },
    sections: [
      {
        heading: '1. Tiếp nhận ưu tiên cấp cứu khẩn cấp',
        paragraphs: [
          'Vào khung giờ tối muộn, gia đình liên hệ hotline cấp cứu và đưa bé Lu đến phòng cấp cứu Bệnh viện Thú y Lê Sơn. Đội ngũ y tế tiếp nhận bé ngay tại cửa, lập tức đưa vào bàn kiểm tra chuyên dụng.',
          'Bác sĩ kiểm tra màu sắc niêm mạc lợi, đo tần số thở và nhịp tim để đánh giá mức độ khẩn cấp, ưu tiên ổn định thể trạng trước khi tiến hành các thủ tục hành chính.',
        ],
      },
      {
        heading: '2. Siêu âm cấp cứu & Trao đổi minh bạch với gia đình',
        paragraphs: [
          'Bác sĩ thực hiện siêu âm nhanh vùng bụng để khảo sát dạ dày và ruột, loại trừ nguy cơ xoắn dạ dày cấp tính. Đồng thời, thông tin về tình trạng và các bước xử lý ban đầu được trao đổi thẳng thắn cùng chủ nuôi.',
          'Bé được theo dõi sát các phản ứng nôn, cung cấp nước điện giải an toàn và giữ ấm thân nhiệt.',
        ],
      },
      {
        heading: '3. Ổn định chỉ số sinh hiệu & Bàn giao theo dõi',
        paragraphs: [
          'Sau vài giờ được chăm sóc khẩn cấp và theo dõi chặt chẽ, nhịp thở của bé Lu trở lại đều đặn, cơ bụng thả lỏng và bé có thể nằm nghỉ yên tĩnh. Bác sĩ tư vấn chế độ ăn chia nhỏ cho những ngày kế tiếp.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Tiếp nhận cấp cứu & Đánh giá sinh hiệu',
        description: 'Kiểm tra đường thở, niêm mạc và nhịp tim khẩn cấp.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Siêu âm khảo sát & Trao đổi phương án',
        description: 'Khảo sát ổ bụng cấp cứu và thống nhất các bước hỗ trợ cùng gia đình.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Ổn định thể trạng & Bàn giao về gia đình',
        description: 'Chỉ số sinh hiệu trở về bình thường, hướng dẫn theo dõi ăn uống tại nhà.',
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
    title: 'Quy trình phẫu thuật triệt sản an toàn và hồi tỉnh cho bé Kem',
    categoryId: 'ngoai-khoa',
    categoryName: 'Ngoại khoa & X-quang',
    petName: 'Bé Kem (Mèo ta, 8 tháng tuổi)',
    targetPet: 'Mèo',
    date: 'Tháng 08/2026',
    isFeatured: false,
    summary:
      'Minh họa ca phẫu thuật triệt sản được chuẩn bị bài bản: kiểm tra xét nghiệm máu tiền phẫu, can thiệp ngoại khoa vô trùng và theo dõi hồi tỉnh tại phòng lưu trú.',
    image: '/images/hero-clinic-cuddle.webp',
    imageAlt: 'Bé mèo được ủ ấm trong giai đoạn hồi tỉnh sau phẫu thuật (Ảnh minh họa)',
    overview: {
      condition: 'Đủ điều kiện sức khỏe và độ tuổi thực hiện triệt sản theo nguyện vọng gia đình',
      initialApproach:
        'Xét nghiệm máu tiền phẫu đánh giá chức năng gan thận, đông máu và thể trạng',
      careHighlights:
        'Theo dõi hồi tỉnh trong ô ấm yên tĩnh, hướng dẫn đeo loa cổ chống liếm vết khâu',
    },
    sections: [
      {
        heading: '1. Khám tiền phẫu & Xét nghiệm máu sàng lọc',
        paragraphs: [
          'Chủ nuôi đặt lịch hẹn triệt sản cho bé Kem qua website. Khi đến viện, bác sĩ tiến hành kiểm tra cân nặng, nghe tim phổi và lấy mẫu máu xét nghiệm sàng lọc tiền phẫu để bảo đảm bé đủ sức khỏe cho can thiệp ngoại khoa.',
          'Khi các chỉ số xét nghiệm đều nằm trong ngưỡng an toàn, bác sĩ giải thích quy trình phẫu thuật và thời gian dự kiến cho gia đình.',
        ],
      },
      {
        heading: '2. Phẫu thuật ngoại khoa & Kiểm soát vô trùng',
        paragraphs: [
          'Bác sĩ ngoại khoa thực hiện thủ thuật triệt sản với dụng cụ phẫu thuật được hấp tiệt trùng chuẩn mực. Quá trình can thiệp diễn ra nhanh chóng, vết mổ nhỏ gọn và được khâu thẩm mỹ cẩn thận.',
          'Sau phẫu thuật, bé Kem được chuyển ngay về khu vực hồi tỉnh có đèn ủ ấm và trải đệm mềm.',
        ],
      },
      {
        heading: '3. Hồi tỉnh an toàn & Dặn dò chăm sóc vết mổ',
        paragraphs: [
          'Kỹ thuật viên túc trực theo dõi quá trình bé hồi tỉnh cho đến khi bé có thể ngẩng đầu và tự đứng vững. Gia đình được hướng dẫn cách vệ sinh vết khâu hằng ngày và hẹn lịch tái khám kiểm tra vết mổ sau 7 ngày.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Khám tiền phẫu & Xét nghiệm máu',
        description: 'Đánh giá toàn diện thể trạng trước khi tiến hành can thiệp ngoại khoa.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Phẫu thuật vô trùng & Theo dõi hồi tỉnh',
        description: 'Thực hiện thủ thuật ngoại khoa và ủ ấm trong khu vực theo dõi.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Bàn giao bé & Hướng dẫn vệ sinh vết khâu',
        description: 'Hướng dẫn gia đình bảo vệ vết mổ và hẹn lịch cắt chỉ/tái khám.',
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
    title: 'Kế hoạch theo dõi chỉ số huyết học định kỳ cho mèo Sim',
    categoryId: 'kham-dinh-ky',
    categoryName: 'Khám & Xét nghiệm định kỳ',
    petName: 'Bé Sim (Mèo Ba Tư, 5 tuổi)',
    targetPet: 'Mèo',
    date: 'Tháng 07/2026',
    isFeatured: false,
    summary:
      'Minh họa quy trình tầm soát sức khỏe cho thú cưng trung niên: xét nghiệm công thức máu và sinh hóa định kỳ nhằm phát hiện sớm các dấu hiệu suy giảm chức năng.',
    image: '/images/why-pet-companion.webp',
    imageAlt: 'Chủ nuôi cùng thú cưng lắng nghe bác sĩ giải thích kết quả (Ảnh minh họa)',
    overview: {
      condition: 'Khám sức khỏe tổng quát định kỳ hằng năm cho mèo trung niên',
      initialApproach:
        'Lấy mẫu máu xét nghiệm huyết học, sinh hóa máu và kiểm tra siêu âm ổ bụng',
      careHighlights:
        'Bác sĩ phân tích chi tiết từng chỉ số và tư vấn điều chỉnh chế độ nước uống',
    },
    sections: [
      {
        heading: '1. Khám tổng quát & Lấy mẫu xét nghiệm an toàn',
        paragraphs: [
          'Bước vào độ tuổi 5 năm, mèo cưng cần được quan tâm hơn về sức khỏe nội tạng. Chủ nuôi đưa bé Sim đến khám tầm soát định kỳ. Bác sĩ kiểm tra răng miệng, tuyến giáp và đo huyết áp cho bé.',
          'Kỹ thuật viên thao tác lấy mẫu máu nhẹ nhàng, hạn chế tối đa cảm giác căng thẳng cho mèo.',
        ],
      },
      {
        heading: '2. Phân tích kết quả sinh hóa & Siêu âm kiểm tra',
        paragraphs: [
          'Kết quả xét nghiệm sinh hóa máu cho thấy các chỉ số của bé Sim ổn định, tuy nhiên lượng nước nạp vào cơ thể cần được cải thiện để giảm tải cho thận. Bác sĩ kết hợp siêu âm ổ bụng kiểm tra cấu trúc thận và bàng quang.',
          'Bác sĩ trao đổi cùng gia đình các giải pháp bổ sung nước như dùng đài phun nước tự động hoặc tăng cường thức ăn ướt chất lượng.',
        ],
      },
      {
        heading: '3. Thiết lập hồ sơ theo dõi sức khỏe dài hạn',
        paragraphs: [
          'Kết quả khám và các chỉ số được lưu lại trong sổ theo dõi sức khỏe của bé Sim, làm cơ sở đối chiếu cho các lần kiểm tra định kỳ tiếp theo.',
        ],
      },
    ],
    timeline: [
      {
        phaseTitle: 'Giai đoạn 1: Khám lâm sàng & Lấy mẫu xét nghiệm',
        description: 'Kiểm tra tổng quát và thực hiện xét nghiệm công thức máu, sinh hóa.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 2: Siêu âm tạng phủ & Tư vấn chỉ số',
        description: 'Khảo sát hình ảnh ổ bụng và phân tích cặn kẽ từng chỉ số cùng chủ nuôi.',
        isCompleted: true,
      },
      {
        phaseTitle: 'Giai đoạn 3: Cập nhật sổ theo dõi sức khỏe',
        description: 'Lưu trữ thông tin tham chiếu và hẹn lịch tái khám định kỳ năm sau.',
        isCompleted: true,
      },
    ],
    relatedSlugs: ['ca-dieu-tri-03', 'ca-dieu-tri-05'],
  },
]
