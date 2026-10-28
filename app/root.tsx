import type { ReactNode } from 'react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import '@/styles/globals.css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* Preload critical self-hosted fonts for instant render */}
        <link
          rel="preload"
          href="/fonts/be-vietnam-pro-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/be-vietnam-pro-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/lora-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: { error: unknown }) {
  console.error('Root ErrorBoundary caught error:', error)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] p-8 text-center">
      <div>
        <h1 className="text-2xl font-serif text-[var(--color-plum-primary)] font-bold mb-4">
          Đã có lỗi xảy ra
        </h1>
        <p className="text-stone-600 mb-6">Hệ thống đang được kiểm tra. Vui lòng thử lại sau.</p>
        <a
          href="/"
          className="inline-block px-6 py-2.5 bg-[var(--color-plum-primary)] text-white rounded-xl font-medium"
        >
          Trở về Trang chủ
        </a>
      </div>
    </div>
  )
}
