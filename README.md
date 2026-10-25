# Website Bệnh viện Thú y Lê Sơn 2026

Website chính thức của **Bệnh viện Thú y Lê Sơn** — Đơn vị y tế thú cưng chuyên nghiệp tại 101 Khuất Duy Tiến, Phường Nhân Chính, Quận Thanh Xuân, Hà Nội.

---

## 1. Công nghệ & Kiến trúc

- **Framework:** React 19 + TypeScript (Strict Mode)
- **Bundler:** Vite 6
- **Styling Architecture:**
  - `tokens.css`: Single Source of Truth cho toàn bộ Design Tokens (Deep Plum, Warm Orange, Ivory, v.v.). Prefix `--ls-*` cho container/radius/space để tránh xung đột namespace với Tailwind CSS v4.
  - Tailwind CSS v4: Utility-first cho grid layout, flexbox, responsive breakpoints.
  - CSS Modules: Cô lập kiểu dáng cho các section nghệ thuật (`*.module.css`).
- **Icons:** Lucide React
- **Router:** React Router v7 (`react-router-dom`)
- **Linting & Code Quality:** Oxlint + TypeScript Compiler (`tsc -b`)

---

## 2. Cấu trúc thư mục

```
le-son-website/
├── public/
│   ├── images/               # Logo và hình ảnh tư liệu bệnh viện
│   ├── robots.txt            # Cấu hình bot thu thập dữ liệu
│   ├── sitemap.xml           # XML sitemap chuẩn SEO
│   └── 404.html              # Fallback định tuyến SPA cho static hosting
├── src/
│   ├── app/
│   │   └── routes.tsx        # Định tuyến tập trung toàn bộ website
│   ├── components/
│   │   ├── layout/           # RootLayout, Header, Footer, MobileNav, ComingSoonView
│   │   └── sections/         # 6 Section nghệ thuật của Trang chủ
│   ├── config/
│   │   └── contact.ts        # Thông tin địa chỉ, hotline, giờ khám tập trung
│   ├── hooks/
│   │   └── useRouteSeo.ts    # Quản lý title, description, canonical, robots & a11y announcer
│   ├── pages/                # HomePage, NotFoundPage
│   └── styles/
│       ├── tokens.css        # Hệ thống Design Tokens chính thức
│       └── globals.css       # Global styles & Tailwind v4 theme mapping
├── docs/                     # Tài liệu kiến trúc, sitemap, SEO & kế hoạch triển khai
├── scripts/                  # Script kiểm thử tự động headless Chrome
└── package.json
```

---

## 3. Lệnh vận hành

```bash
# Cài đặt phụ thuộc
npm install

# Chạy môi trường phát triển (Hot Module Replacement)
npm run dev

# Kiểm tra kiểu dữ liệu TypeScript
npm run typecheck # hoặc: npx tsc -b

# Kiểm tra tĩnh mã nguồn
npm run lint      # hoặc: npx oxlint

# Đóng gói xuất bản (Production Build)
npm run build

# Xem trước bản đóng gói
npm run preview
```

---

## 4. Kiểm thử tự động Mốc 2A & 2B

Dự án tích hợp script headless Chrome đo đạc chính xác tràn ngang và chụp ảnh màn hình đa kích thước (320px, 390px, 768px, 1366px, 1440px):

```bash
node scripts/test-and-capture-2b.mjs
```

Bảo lưu mọi quyền © 2026 Bệnh viện Thú y Lê Sơn.
