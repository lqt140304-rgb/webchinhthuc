# ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01: XÁC MINH TÍNH NHẤT QUÁN CHÍNH SÁCH SEO THEO MÔI TRƯỜNG (F02 / 3B-H2-P2-2)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị:** CEO DIRECTIVE 058-A (Mục V)  
**Agent:** Antigravity — Architecture Implementation  
**Worktree:** `D:\webbvct-hardening-02-fix01`  
**Nhánh:** `spike/architecture-01-hardening-02-fix01`  

---

## I. TÁI HIỆN VÀ PHÂN TÍCH NGUYÊN NHÂN LỖI TRONG HARDENING 02

### 1. Hiện tượng do Claude phát hiện
Trong Hardening 02, khi thử nghiệm build ở chế độ Production giả lập (`$env:VERCEL_ENV="production"`):
- Quá trình prerender tại build-time chạy trong Node.js, đọc biến `process.env.VERCEL_ENV === 'production'`.
- Hàm `meta()` tại server render ra file HTML tĩnh `build/client/index.html` chứa thẻ:
  ```html
  <meta name="robots" content="index, follow">
  ```
- Tuy nhiên, khi mở trang trong trình duyệt, sau khi JavaScript nạp và quá trình React hydration diễn ra:
  Trình duyệt client thực thi lại hàm `meta()`. Tại client:
  - `process.env` là `undefined` (hoặc rỗng).
  - Biến `import.meta.env.VITE_VERCEL_ENV` không tồn tại do Vite không tự động chuyển tiếp biến không có tiền tố `VITE_`.
  - Hàm `getAppEnvironment()` tại client rơi vào fallback cuối cùng là `'local'`!
  - Trong môi trường `'local'`, chính sách SEO quy định bắt buộc trả về `'noindex, nofollow'`.
  - React Router component `<Meta />` lập tức chèn thêm hoặc ghi đè thẻ `<meta name="robots" content="noindex, nofollow">` vào `<head>`!
- **Hậu quả:** Tồn tại hai trạng thái mâu thuẫn giữa HTML gốc (`index, follow`) và DOM sau khi hydrate (`noindex, nofollow`), vi phạm nghiêm trọng tính nhất quán của máy tìm kiếm.

---

## II. GIẢI PHÁP ĐÃ THỰC THI TRONG FIX 01

Để giải quyết triệt để, Antigravity đã thống nhất đường truyền giá trị môi trường từ build-time sang client bundle bằng cơ chế **Compile-time Constant Replacement** của Vite:

### 1. Tại `vite.config.ts`:
Xác định môi trường duy nhất tại thời điểm build và tiêm trực tiếp vào cây mã nguồn thông qua `define`:
```ts
// vite.config.ts
const appEnv = process.env.VERCEL_ENV === 'production' || process.env.VITE_APP_ENV === 'production' || process.env.APP_ENV === 'production'
  ? 'production'
  : (process.env.VERCEL_ENV === 'preview' || process.env.VITE_APP_ENV === 'preview' || process.env.APP_ENV === 'preview'
      ? 'preview'
      : 'local')

export default defineConfig({
  // ...
  define: {
    '__APP_ENV__': JSON.stringify(appEnv),
  },
})
```

### 2. Tại `src/config/seo-policy.ts`:
Đọc hằng số `__APP_ENV__` làm nguồn ưu tiên số 1:
```ts
declare const __APP_ENV__: string | undefined

export function getAppEnvironment(): AppEnvironment {
  // 1. Hằng số được Vite thay thế tĩnh ngay khi biên dịch (giá trị giống hệt nhau giữa SSR và Client bundle)
  if (typeof __APP_ENV__ !== 'undefined' && __APP_ENV__) {
    if (__APP_ENV__ === 'production' || __APP_ENV__ === 'preview') {
      return __APP_ENV__ as AppEnvironment
    }
    return 'local'
  }

  // 2. Fallback cho môi trường Node.js standalone test
  if (typeof process !== 'undefined' && process?.env) {
    const envVal = process.env.VERCEL_ENV || process.env.VITE_APP_ENV || process.env.APP_ENV
    if (envVal === 'production') return 'production'
    if (envVal === 'preview') return 'preview'
  }

  // Mặc định an toàn tuyệt đối luôn là 'local'
  return 'local'
}
```

---

## III. BẰNG CHỨNG KIỂM THỬ THỰC TẾ TRÊN BROWSER (`test:seo-consistency`)

Script `tests/spike/test-seo-consistency.cjs` sử dụng Playwright Chromium để mở trang, đợi network idle và hydration hoàn tất, sau đó kiểm tra số lượng và nội dung của toàn bộ thẻ `<meta name="robots">` trên cả file HTML đĩa cứng và DOM thực tế của trình duyệt:

### Kịch bản A: Môi trường Local / Preview (Mặc định — An toàn)
```text
=== STARTING SEO ENVIRONMENT CONSISTENCY TEST ===
[1] Auditing Raw Prerendered HTML Files...
  Raw index.html robots directive: "noindex, nofollow"
  Raw gioi-thieu/index.html robots directive: "noindex, nofollow"
[2] Auditing Hydrated DOM in Browser (Direct URL)...
  Hydrated index.html robots tags count: 1
  Hydrated index.html robots content: ["noindex, nofollow"]
[3] Auditing Hydrated DOM after Browser Refresh...
  Refreshed index.html robots content: ["noindex, nofollow"] (PASS)
[4] Auditing Hydrated DOM on /gioi-thieu...
  Hydrated /gioi-thieu robots content: ["noindex, nofollow"] (PASS)
[5] Auditing Hydrated DOM on Private Route (/tai-khoan)...
  Hydrated /tai-khoan robots content: ["noindex, nofollow"] (PASS)

=== ALL SEO ENVIRONMENT CONSISTENCY TESTS PASSED! ===
```

### Kịch bản B: Môi trường Production Giả lập (`$env:VERCEL_ENV="production"`)
```text
=== STARTING SEO ENVIRONMENT CONSISTENCY TEST ===
[1] Auditing Raw Prerendered HTML Files...
  Raw index.html robots directive: "index, follow"
  Raw gioi-thieu/index.html robots directive: "noindex, nofollow"
[2] Auditing Hydrated DOM in Browser (Direct URL)...
  Hydrated index.html robots tags count: 1
  Hydrated index.html robots content: ["index, follow"]
[3] Auditing Hydrated DOM after Browser Refresh...
  Refreshed index.html robots content: ["index, follow"] (PASS)
[4] Auditing Hydrated DOM on /gioi-thieu...
  Hydrated /gioi-thieu robots content: ["noindex, nofollow"] (PASS)
[5] Auditing Hydrated DOM on Private Route (/tai-khoan)...
  Hydrated /tai-khoan robots content: ["noindex, nofollow"] (PASS)

=== ALL SEO ENVIRONMENT CONSISTENCY TESTS PASSED! ===
```

---

## IV. KẾT LUẬN VỀ AN TOÀN SEO

1. **Số lượng thẻ robots:** Luôn luôn là **ĐÚNG 1 THẺ DUY NHẤT** trên mọi trang, cả trước và sau khi hydrate. Không có hiện tượng nhân bản thẻ.
2. **Không xung đột:** Giá trị trong HTML gốc và giá trị DOM sau hydration đồng nhất 100%.
3. **Bảo vệ môi trường thử nghiệm:** Mọi bản build không gán cờ `production` đều mặc định trả về `noindex, nofollow`.
4. **Bảo vệ trang riêng tư:** Các trang `/tai-khoan/*` và Coming Soon luôn luôn giữ `noindex, nofollow` ngay cả khi chạy ở chế độ Production.
5. **Finding `3B-H2-P2-2` đã được GIẢI QUYẾT TRIỆT ĐỂ (CLOSED).**
