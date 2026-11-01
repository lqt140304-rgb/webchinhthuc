/**
 * Centralized Hospital Contact Information & Confirmed Clinical Capabilities
 * Sourced from direct user confirmation on 26/10/2026 and 01/11/2026.
 */
export const HOSPITAL_CONTACT = {
  name: 'Bệnh viện Thú y Lê Sơn',
  shortName: 'Thú y Lê Sơn',
  tagline: 'Chăm Sóc Y Tế Thú Cưng Tận Tâm',
  address: '101 Khuất Duy Tiến, Thanh Xuân, Hà Nội',
  shortAddress: '101 Khuất Duy Tiến, Thanh Xuân, Hà Nội',
  hotlineDisplay: '097 355 51 05',
  hotlineRaw: '0973555105',
  hotlineTel: 'tel:0973555105',
  workingHours: '08:00 – 21:00 (Tất cả các ngày)',
  workingHoursDetail: '08:00 – 21:00 (Tất cả các ngày trong tuần)',
  emergencyHours: 'Tiếp nhận cấp cứu 24/24',
  mapsUrl: 'https://maps.google.com/?q=101+Khu%E1%BA%A5t+Duy+Ti%E1%BA%BFn+Thanh+Xu%C3%A2n+H%C3%A0+N%E1%BB%99i',
} as const

/**
 * 4 nhóm năng lực chuyên môn thuộc Khám & Điều trị đã được Chủ dự án xác nhận chính thức (01/11/2026).
 * Không tự suy diễn loại máy, công nghệ, tiêu chuẩn, danh mục phẫu thuật hoặc xét nghiệm cụ thể khi chưa được xác nhận.
 */
export const CONFIRMED_CLINICAL_SERVICES = [
  {
    id: 'x-quang',
    name: 'X-quang',
    summary: 'Chụp X-quang phục vụ chẩn đoán hình ảnh theo chỉ định lâm sàng của bác sĩ.',
  },
  {
    id: 'sieu-am',
    name: 'Siêu âm',
    summary: 'Siêu âm kiểm tra và đánh giá tình trạng sức khỏe theo chỉ định thăm khám.',
  },
  {
    id: 'xet-nghiem',
    name: 'Xét nghiệm',
    summary: 'Thực hiện xét nghiệm cận lâm sàng hỗ trợ chẩn đoán và theo dõi điều trị.',
  },
  {
    id: 'phau-thuat',
    name: 'Phẫu thuật',
    summary: 'Thực hiện phẫu thuật thú y theo chỉ định chuyên môn sau khi thăm khám trực tiếp.',
  },
] as const

