export type BookingStatus =
  | 'idle'
  | 'submitting'
  | 'received'
  | 'awaiting_confirmation'
  | 'confirmed'
  | 'failed'

export interface HospitalInfo {
  name: string
  address: string
  hotline: string
  hotlineHref: string
  hoursReference: string
  emergency: string
}

export interface NavDropdownItem {
  title: string
  href: string
  description?: string
}

export interface NavItem {
  label: string
  href: string
  dropdown?: NavDropdownItem[]
}

export interface Doctor {
  id: string
  name: string
  role: string
  credentials: string[]
  bio: string
  image?: string
  isDirector?: boolean
  verified: boolean
}

export interface ServiceDetail {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  icon: string
  highlight?: boolean
  emergencyLink?: boolean
}

export interface TreatmentStory {
  slug: string
  title: string
  petName: string
  petType: 'chó' | 'mèo' | 'khác'
  diagnosis: string
  recoverySummary: string
  isSampleIllustrated: boolean
  hasOwnerConsent: boolean
  timelineSteps?: {
    stage: string
    description: string
  }[]
}

export interface EditorialArticle {
  slug: string
  title: string
  category: 'Chăm sóc' | 'Dinh dưỡng' | 'Phòng bệnh' | 'Bệnh viện'
  excerpt: string
  readTime: string
  publishedAt: string
}

export interface BookingFormData {
  ownerName: string
  phone: string
  petName: string
  petType: 'chó' | 'mèo' | 'khác'
  serviceType: string
  preferredDate: string
  preferredTimeSlot: string
  symptomsNote?: string
}

export interface RouteMeta {
  path: string
  title: string
  description: string
  canonical: string
  ogType?: 'website' | 'article'
}

/**
 * Cổng khách hàng (/tai-khoan/*) - Chỉ chứa các trường dữ liệu được phép công khai.
 * Tuyệt đối không chứa thuốc điều trị nội bộ, liều lượng, y lệnh hay nhật ký thao tác nội bộ.
 */
export interface CustomerPetProfile {
  id: string
  name: string
  species: 'chó' | 'mèo' | 'khác'
  breed: string
  ageApprox: string
  weightKg: number
  photoUrl?: string
}

export interface PublicHealthReport {
  id: string
  petId: string
  examinationDate: string
  generalConditionSummary: string
  homeCareGuidance: string
  nextAppointmentDate?: string
  nextAppointmentPurpose?: string
  isApprovedByDoctor: boolean
}
