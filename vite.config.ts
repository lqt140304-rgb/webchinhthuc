import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// Determine environment for both server prerender and client bundle (CEO Directive 058-A F02)
const appEnv = process.env.VERCEL_ENV === 'production' || process.env.VITE_APP_ENV === 'production' || process.env.APP_ENV === 'production'
  ? 'production'
  : (process.env.VERCEL_ENV === 'preview' || process.env.VITE_APP_ENV === 'preview' || process.env.APP_ENV === 'preview'
      ? 'preview'
      : 'local')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  define: {
    '__APP_ENV__': JSON.stringify(appEnv),
  },
})
