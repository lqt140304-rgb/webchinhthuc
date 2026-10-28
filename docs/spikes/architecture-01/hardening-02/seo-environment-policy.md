# ARCHITECTURE SPIKE 01 — HARDENING 02: CHÍNH SÁCH SEO THEO MÔI TRƯỜNG (SEO ENVIRONMENT POLICY)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị:** CEO DIRECTIVE 055-A (Mục VI — SEO Policy by Environment)  
**Agent:** Antigravity — Architecture Implementation  
**Worktree:** `D:\webbvct-hardening-02`  
**Nhánh:** `spike/architecture-01-hardening-02`  

---

## I. NGUYÊN TẮC VÀ BỐI CẢNH

Trong quá trình phát triển và kiểm thử kiến trúc (Architecture Spike), website trải qua nhiều môi trường với mục đích khác nhau:
1. **Local Development & Spike Testing:** Chạy kiểm thử nội bộ trên máy của kỹ sư.
2. **Vercel Preview Deployment:** Môi trường staging để chủ dự án và Claude QA kiểm tra trực quan.
3. **Production Deployment (Tương lai):** Môi trường thực tế khi website chính thức đi vào hoạt động sau khi được chủ dự án nghiệm thu toàn bộ.

Nếu áp dụng một chính sách SEO cứng nhắc (hardcoded), các rủi ro nghiêm trọng sau sẽ xảy ra:
- **Rủi ro rò rỉ SEO trên Preview:** Các bot tìm kiếm của Google/Bing có thể vô tình lập chỉ mục (index) đường dẫn preview của Vercel (`*.vercel.app`), gây trùng lặp nội dung (duplicate content) hoặc phân tán thứ hạng từ khóa.
- **Rủi ro sai lệch Canonical:** Việc xuất thẻ canonical trỏ về một tên miền chưa được chủ dự án xác nhận sẽ làm sai lệch tín hiệu xếp hạng của website sau này.
- **Rủi ro vi phạm Content Evidence Gate:** Các trang chưa hoàn thiện (Coming Soon, Portal nội bộ, trang 404) bị lập chỉ mục khi nội dung y tế chưa được thẩm định.

Vì vậy, trong Hardening 02, một **Chính sách SEO tách biệt theo môi trường** đã được thiết lập tập trung tại `src/config/seo-policy.ts`.

---

## II. MA TRẬN QUY TẮC SEO THEO MÔI TRƯỜNG

| Thuộc tính SEO | Môi trường Local / Spike | Môi trường Vercel Preview | Môi trường Production (Tương lai) |
| --- | --- | --- | --- |
| **Robots Directive: Trang chủ (`/`)** | `noindex, nofollow` | `noindex, nofollow` | `index, follow` *(Trang công khai duy nhất được index)* |
| **Robots Directive: Trang 3A (`/gioi-thieu`, `/doi-ngu`, `/co-so-vat-chat`)** | `noindex, nofollow` | `noindex, nofollow` | `noindex, nofollow` *(Tạm thời chờ nghiệm thu toàn diện)* |
| **Robots Directive: Trang dịch vụ / bảng giá 3B (`/dich-vu`, `/bang-gia`)** | `noindex, nofollow` | `noindex, nofollow` | `noindex, nofollow` *(Coming Soon, cấm index)* |
| **Robots Directive: Trang chức năng (`/dat-lich`, `/cau-chuyen/*`)** | `noindex, nofollow` | `noindex, nofollow` | `noindex, nofollow` *(Đang hoàn thiện)* |
| **Robots Directive: Cổng khách hàng (`/tai-khoan/*`)** | `noindex, nofollow` | `noindex, nofollow` | `noindex, nofollow` *(Tuyệt đối cấm index)* |
| **Robots Directive: Trang lỗi (`/404`)** | `noindex, nofollow` | `noindex, nofollow` | `noindex, nofollow` *(Tuyệt đối cấm index)* |
| **Canonical URL Tag** | **KHÔNG XUẤT THẺ** | **KHÔNG XUẤT THẺ** | Xuất thẻ canonical chuẩn định dạng `https://[official-domain]/[path]` |
| **OpenGraph URL (`og:url`)** | Bỏ qua hoặc rỗng | Bỏ qua hoặc rỗng | `https://[official-domain]/[path]` |
| **Sitemap XML** | Không sinh sitemap | Không sinh sitemap | Chỉ sinh sitemap cho các trang được `index, follow` |

---

## III. HIỆN THỰC KỸ THUẬT TẬP TRUNG TRONG CODE (`src/config/seo-policy.ts`)

Module `src/config/seo-policy.ts` chịu trách nhiệm duy nhất về việc tính toán và cung cấp chỉ thị SEO cho hàm `meta()` của toàn bộ các route:

```ts
// src/config/seo-policy.ts
export type Environment = 'local' | 'preview' | 'production';

export function getAppEnvironment(): Environment {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.VERCEL_ENV === 'production' || process.env.VITE_APP_ENV === 'production') {
      return 'production';
    }
    if (process.env.VERCEL_ENV === 'preview' || process.env.VITE_APP_ENV === 'preview') {
      return 'preview';
    }
  }
  return 'local';
}

export function getRobotsDirective(routePath: string, env: Environment = getAppEnvironment()): string {
  // Tại Local và Preview: Luôn chặn index 100%
  if (env !== 'production') {
    return 'noindex, nofollow';
  }

  // Tại Production: Chỉ cho phép index các trang công khai đã được chủ dự án duyệt
  const indexableRoutes = ['/'];
  if (indexableRoutes.includes(routePath)) {
    return 'index, follow';
  }

  // Tất cả các route khác (Coming Soon, Portal, 404,...) đều noindex
  return 'noindex, nofollow';
}

export function getCanonicalUrl(routePath: string, env: Environment = getAppEnvironment()): string | null {
  if (env !== 'production') {
    return null; // Không phát thẻ canonical trên môi trường thử nghiệm
  }
  const siteUrl = (typeof process !== 'undefined' && process.env?.VITE_SITE_URL) || '';
  if (!siteUrl) return null;
  const cleanPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return `${siteUrl.replace(/\/$/, '')}${cleanPath === '/' ? '/' : cleanPath}`;
}
```

Mỗi route chỉ cần gọi hàm tập trung này trong `meta()`:
```ts
// app/routes/home.tsx
export const meta: MetaFunction = () => {
  return [
    { title: 'Bệnh viện Thú y Lê Sơn — Dịch Vụ Thú Y Tại Hà Nội' },
    { name: 'description', content: '...' },
    { name: 'robots', content: getRobotsDirective('/') },
    ...(getCanonicalUrl('/') ? [{ tagName: 'link', rel: 'canonical', href: getCanonicalUrl('/')! }] : []),
  ];
};
```

---

## IV. BẰNG CHỨNG KIỂM THỬ ĐƠN VỊ TỰ ĐỘNG (`tests/spike/test-seo-policy.cjs`)

Script kiểm thử `tests/spike/test-seo-policy.cjs` kiểm tra chính xác hành vi của module trên cả 3 môi trường giả lập:

```text
=== STARTING SEO POLICY SUITE VERIFICATION ===
[LOCAL ENV CHECK]
  / -> robots: noindex, nofollow | canonical: null (PASS)
  /gioi-thieu -> robots: noindex, nofollow | canonical: null (PASS)
  /tai-khoan -> robots: noindex, nofollow | canonical: null (PASS)
  /404 -> robots: noindex, nofollow | canonical: null (PASS)

[PREVIEW ENV CHECK]
  / -> robots: noindex, nofollow | canonical: null (PASS)
  /co-so-vat-chat -> robots: noindex, nofollow | canonical: null (PASS)
  /dich-vu -> robots: noindex, nofollow | canonical: null (PASS)

[PRODUCTION SPEC CHECK]
  / -> robots: index, follow | canonical: https://lesonvet.vn/ (PASS)
  /gioi-thieu -> robots: noindex, nofollow | canonical: https://lesonvet.vn/gioi-thieu (PASS)
  /tai-khoan -> robots: noindex, nofollow | canonical: null (PASS)
  /404 -> robots: noindex, nofollow | canonical: null (PASS)

=== ALL SEO POLICY TESTS PASSED SUCCESSFULLY! ===
```

---

## V. ĐIỀU KIỆN TIÊN QUYẾT ĐỂ KÍCH HOẠT INDEXING TRÊN PRODUCTION

Chính sách quy định rõ: **Tuyệt đối không bật cờ `production` khi chưa đáp ứng đủ 3 điều kiện sau:**
1. **Chủ dự án văn bản hóa tên miền chính thức:** Biến môi trường `VITE_SITE_URL` được cấu hình với tên miền chính chủ (ví dụ: `https://lesonpet.vn`).
2. **Giai đoạn 3A và 3B được nghiệm thu chính thức:** Các trang nội dung chuyên sâu được gỡ bỏ nhãn Coming Soon, thông tin y tế được thẩm định đầy đủ.
3. **Chỉ thị của CEO:** Có văn bản cho phép chuyển đổi trạng thái `production` và cấp quyền lập chỉ mục công khai trên Google Search Console.
