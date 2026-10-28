import type { Config } from '@react-router/dev/config'

export default {
  // Architecture Spike 01: Testing Framework Mode with ssr: false (Client-side app with Build-time Prerendering)
  ssr: false,
  async prerender() {
    return [
      '/',
      '/gioi-thieu',
      '/doi-ngu',
      '/co-so-vat-chat',
      '/spike-seo-test',
      '/dat-lich',
      '/404',
    ]
  },
} satisfies Config
