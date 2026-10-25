# DESIGN SYSTEM & STYLING ARCHITECTURE
## Bệnh viện Thú y Lê Sơn (Art Direction: Vibrant Editorial Luxury)

Tài liệu này xác lập các nguyên tắc thiết kế, hệ thống Design Tokens đầy đủ và quy chuẩn kiến trúc CSS được áp dụng nhất quán trên toàn bộ dự án.

---

### 1. Chuẩn Hóa Styling Architecture (Phân Định Trách Nhiệm)

Để đảm bảo hiệu năng cao, tránh xung đột CSS, không dùng màu/khoảng cách tùy tiện và dễ dàng bảo trì mở rộng, kiến trúc styling được phân định thành 3 lớp rõ ràng:

```
[ tokens.css ]  <--- Nguồn chân lý duy nhất (Single Source of Truth) cho toàn bộ Tokens
      │
      ├───────────────────────────────┐
      ▼                               ▼
[ Tailwind CSS Utility ]    [ CSS Modules (*.module.css) ]
- Cấu trúc layout vĩ mô     - Component độc lập & cô lập phạm vi (Scoped UI)
- Flexbox, Grid, Responsive - Hiệu ứng chuyển động đặc thù (Clip Wipe, Mask)
- Spacing & Breakpoints     - Bố cục Editorial cắt khuyết nghệ thuật
```

#### Phân định cụ thể:
1. **`src/styles/tokens.css`:**
   - Định nghĩa toàn bộ CSS Custom Properties: Màu thương hiệu, Background/Foreground ngữ nghĩa, Spacing scale, Typography scale, Border radii, Box shadows và Motion easing.
   - Bất kỳ thành phần nào (dù dùng Tailwind hay CSS Modules) đều phải tham chiếu các giá trị này, nghiêm cấm viết cứng các mã màu `#...` hoặc khoảng cách ngẫu nhiên trong code.
2. **Tailwind CSS (`@tailwindcss/vite`):**
   - Đảm nhiệm việc xây dựng nhanh cấu trúc khung trang (Layout, Flex, Grid, Container sizing, Breakpoints).
   - Tối ưu hóa kích thước bundle thông qua quá trình quét utility tĩnh.
3. **CSS Modules (`[Component].module.css`):**
   - Đảm nhiệm các thành phần UI cao cấp mang đậm tính Editorial: Các khung ảnh bo góc cắt khuyết (asymmetric bento, custom clip-path), hiệu ứng chuyển cảnh trang chọn lọc (Clip Wipe Wipe), các animation tinh tế không thể biểu diễn sạch bằng inline utility class.
   - Đảm bảo tính đóng gói (encapsulation), không gây ô nhiễm global namespace.

> [!NOTE]
> **Đánh giá phương án CSS Modules thuần (nếu loại bỏ Tailwind):**  
> Nếu dự án không dùng Tailwind, ta hoàn toàn có thể dùng CSS Modules 100% kết hợp với `tokens.css`. Tuy nhiên, Tailwind v4 hiện tại được cấu hình siêu nhẹ (`@tailwindcss/vite` không cần file config cồng kềnh, build chỉ mất ~200ms) và hỗ trợ rất tốt cho việc dựng nhanh responsive layout mà không phải viết hàng trăm media query lặp lại. Do đó, việc phối hợp **Tailwind cho Layout/Responsive** + **CSS Modules cho Editorial Luxury Components** là phương án cân bằng tối ưu nhất.

---

### 2. Bảng Màu Ngữ Nghĩa & Thương Hiệu (Color Tokens)

#### Brand Palette:
- `--color-plum-deep`: `#421247` (Nền Header tối, Footer, Tiêu đề tương phản cao)
- `--color-plum-primary`: `#5A1E5E` (Nhận diện chính, Primary Buttons, Active States)
- `--color-plum-orchid`: `#824787` (Accent thứ cấp, Badges, Hover highlights)
- `--color-warm-orange`: `#C2560C` (Điểm nhấn Cấp cứu 24/24, Hotline callouts)
- `--color-warm-orange-hover`: `#A34507` (Hover trạng thái khẩn cấp)
- `--color-ivory`: `#FBF7F1` (Nền trang ấm áp Warm Paper Base)
- `--color-lavender`: `#F8F2F9` (Nền thẻ Bento, Gradient soft tints)

#### Semantic Background & Foreground:
- `--color-bg-primary`: `#FBF7F1` (Nền trang chính)
- `--color-bg-secondary`: `#F8F2F9` (Nền panel, Bento card phụ)
- `--color-bg-card`: `#FFFFFF` (Bề mặt thẻ nổi)
- `--color-bg-card-hover`: `#FCFAFD` (Màu hover thẻ nhẹ nhàng)
- `--color-bg-dark`: `#421247` (Deep Plum cho vùng tối)
- `--color-bg-dark-secondary`: `#310D35` (Deep Plum tối ưu tương phản)
- `--color-bg-overlay`: `rgba(26, 10, 28, 0.65)` (Lớp phủ modal)

- `--color-fg-primary`: `#1A0A1C` (Màu chữ chính - tối ưu độ tương phản văn bản dễ đọc trên nền Ivory)
- `--color-fg-secondary`: `#421247` (Tiêu đề nhấn ánh mận)
- `--color-fg-muted`: `#68546B` (Đoạn văn mô tả, phụ đề)
- `--color-fg-subtle`: `#9B879E` (Meta data, ngày tháng, placeholder)
- `--color-fg-inverse`: `#FFFFFF` (Chữ trắng trên nền tối)
- `--color-fg-accent`: `#C2560C` (Chữ điểm nhấn khẩn cấp)

---

### 3. Thang Đo Typography (Type Scale)

Hai font chính tối ưu tiếng Việt: **Be Vietnam Pro** (Sans-serif) & **Lora** (Serif Editorial).

| Token | Size (rem / px) | Line Height | Ứng Dụng |
| :--- | :--- | :--- | :--- |
| `--font-size-xs` | `0.75rem` (12px) | 1.35 | Nhãn phụ, badge nhỏ, footnote |
| `--font-size-sm` | `0.875rem` (14px) | 1.45 | Caption, meta data, input labels |
| `--font-size-base` | `1.0rem` (16px) | 1.60 | Body text tiêu chuẩn, button vừa |
| `--font-size-lg` | `1.125rem` (18px) | 1.65 | Đoạn mở đầu (Lead paragraph), menu |
| `--font-size-xl` | `1.25rem` (20px) | 1.40 | Tiêu đề card, tiểu mục nổi bật |
| `--font-size-2xl` | `1.5rem` (24px) | 1.35 | H3, tiêu đề section con |
| `--font-size-3xl` | `1.875rem` (30px) | 1.30 | H2 phụ, số liệu nổi bật |
| `--font-size-4xl` | `2.25rem` (36px) | 1.25 | H2 Section chính |
| `--font-size-5xl` | `3.0rem` (48px) | 1.20 | H1 trang con, banner |
| `--font-size-6xl` | `3.75rem` (60px) | 1.15 | Headline lớn |
| `--font-size-hero` | `4.25rem` (68px) | 1.10 | Editorial Hero Title ("Khi bé không khỏe...") |

---

### 4. Thang Đo Khoảng Cách (Spacing Scale)

Dựa trên hệ số chuẩn 4px:
- `--space-1`: 4px | `--space-2`: 8px | `--space-3`: 12px | `--space-4`: 16px
- `--space-5`: 20px | `--space-6`: 24px | `--space-8`: 32px | `--space-10`: 40px
- `--space-12`: 48px | `--space-16`: 64px | `--space-20`: 80px | `--space-24`: 96px | `--space-32`: 128px

---

### 5. Khung Chứa & Breakpoints (Containers & Responsive)

- **Container:**
  - `--container-sm`: 640px
  - `--container-md`: 768px
  - `--container-lg`: 1024px
  - `--container-xl`: 1280px (Chuẩn nội dung chính)
  - `--container-2xl`: 1440px (Chuẩn Hero & Asymmetric Bento)
- **Breakpoints:**
  - `sm`: 640px (Mobile xoay ngang / Tablet nhỏ)
  - `md`: 768px (Tablet dọc)
  - `lg`: 1024px (Tablet ngang / Laptop nhỏ)
  - `xl`: 1280px (Desktop tiêu chuẩn)
  - `2xl`: 1536px (Màn hình lớn)

---

### 6. Quy Chuẩn Trạng Thái Tương Tác (Component States)

1. **Button States:**
   - **Primary Button (Plum):**
     - Default: Nền `#5A1E5E`, chữ trắng, bo góc 10px (`--radius-md`).
     - Hover: Nền `#421247`, nâng nhẹ `--hover-lift-y: -2px`, bóng `--shadow-card`.
     - Active: Nền `#350F39`, hạ độ cao (`scale(0.98)`).
     - Focus-visible: Vòng viền kép chuẩn a11y (`outline: 2px solid #5A1E5E`, offset `2px`).
     - Disabled: Độ mờ `--opacity-disabled: 0.55`, con trỏ `not-allowed`, vô hiệu hover.
     - Loading: Con trỏ chờ, hiển thị spinner xoay mượt, nội dung chữ giữ nguyên độ rộng.
   - **Emergency Button (Warm Orange):**
     - Áp dụng riêng cho Cấp cứu 24/24 và Hotline khẩn cấp: Nền `#C2560C`, hover `#A34507`, bóng tỏa nhẹ `--shadow-warm-orange`.
2. **Form Input States:**
   - Default: Viền `--color-border-medium`, nền trắng, bo góc `--radius-md`.
   - Hover: Viền chuyển sang ánh mận nhạt.
   - Focus: Viền `--color-plum-primary`, bóng tỏa focus vòng mận thanh lịch.
   - Error: Nền `--color-status-error-bg`, viền `--color-status-error-border`, thông báo lỗi màu `--color-status-error-text`.
   - Disabled: Nền xám nhạt, con trỏ `not-allowed`.

---

### 7. Thang Đo Hiệu Ứng Chuyển Động (Motion Scale)

- **Thời lượng (Durations):**
  - `--motion-duration-instant`: 100ms (Micro-press, checkbox, toggle)
  - `--motion-duration-fast`: 200ms (Hover button, dropdown fade)
  - `--motion-duration-normal`: 300ms (Card lift, drawer mobile menu)
  - `--motion-duration-slow`: 450ms (Accordion expand, modal scale-in)
  - `--motion-duration-page`: 600ms (Chuyển trang Clip Wipe có chọn lọc)
- **Đường cong chuyển động (Easing):**
  - `--motion-ease-default`: `cubic-bezier(0.16, 1, 0.3, 1)` (Linear / Apple physics curve)
  - `--motion-ease-in-out`: `cubic-bezier(0.4, 0, 0.2, 1)` (Đóng mở mượt mà)
  - `--motion-ease-out-back`: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Bật nhẹ tự nhiên)
- **Quy tắc bắt buộc:** Tuân thủ triệt để `@media (prefers-reduced-motion: reduce)`, triệt tiêu toàn bộ thời lượng chuyển động đối với người dùng cài đặt giảm hiệu ứng.
