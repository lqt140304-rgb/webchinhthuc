export interface NavItem {
  label: string
  href: string
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
  badge?: string
}

export interface ContactFormData {
  name: string
  phone: string
  email?: string
  service: string
  note?: string
}
