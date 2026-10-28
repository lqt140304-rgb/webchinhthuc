import type { Config } from '@react-router/dev/config'

export default {
  // Pure static site generation: no runtime Node server is needed
  ssr: false,

  // Prerender all static public routes defined in 3A baseline
  async prerender() {
    return [
      '/',
      '/gioi-thieu',
      '/doi-ngu',
      '/co-so-vat-chat',
      '/dat-lich',
      '/dich-vu',
      '/dich-vu/kham-dieu-tri',
      '/dich-vu/noi-tru',
      '/dich-vu/spa',
      '/dich-vu/cap-cuu',
      '/bang-gia',
      '/cau-chuyen',
      '/goc-thu-cung',
      '/san-pham',
      '/lien-he',
      '/dang-nhap',
      '/dang-ky',
      '/tai-khoan',
      '/404',
    ]
  },
} satisfies Config
