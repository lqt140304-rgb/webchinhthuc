# FRONTEND ARCHITECTURE & DIRECTORY STRUCTURE
## Bệnh viện Thú y Lê Sơn (le-son-website 2026)

Tài liệu này xác lập các quyết định kỹ thuật cốt lõi, mô hình phân tách component, cỗ máy trạng thái (State Machine) của luồng đặt lịch khám và chiến lược quản lý route cho website.

---

### 1. Kiến Trúc Kỹ Thuật (Tech Stack Rationale)

1. **Core Framework:** `React 19` + `TypeScript 5.8+` + `Vite`.
   - Khởi động nhanh, build tối ưu theo chuẩn ESM hiện đại, kiểu dữ liệu an toàn.
2. **Styling Engine Phân Định:**
   - **`tokens.css`:** Chân lý duy nhất (Single Source of Truth) lưu trữ 100% Design Tokens.
   - **Tailwind CSS:** Dựng khung layout, flex, grid, spacing và responsive utility.
   - **CSS Modules:** Cô lập component độc lập, các đường cong cắt khuyết editorial đặc thù và các transition chuyển cảnh phức tạp.
3. **Icons & Assets:**
   - `lucide-react` (Bộ icon đồng nhất độ dày nét, tối ưu tree-shaking).
4. **Animation & Interaction:**
   - CSS Transitions & Web Animations API chuẩn trình duyệt.
   - Tuyệt đối không cài thư viện nặng tốn tài nguyên; tôn trọng triệt để `prefers-reduced-motion`.
5. **Kế hoạch Routing:**
   - **Được dời lên ngay ĐẦU GIAI ĐOẠN 2** (sử dụng `react-router-dom` hoặc router nhẹ chuẩn ESM).
   - Ngay từ đầu Giai đoạn 2, toàn bộ khung sườn ứng dụng đã có layout cha (`RootLayout`), hệ thống Header/Footer dùng chung, và các route con sẵn sàng nhận diện navigation.

---

### 2. Quản Lý Route Chưa Có Nội Dung (Dead-link Prevention)

Để đảm bảo người dùng và bot tìm kiếm không bao giờ gặp liên kết gãy hoặc mã lỗi 404 trong quá trình phát triển đa giai đoạn:
- Toàn bộ các route con thuộc Giai đoạn 3 (`/gioi-thieu`, `/doi-ngu`, `/dich-vu/*`, `/bang-gia`, `/cau-chuyen`, `/san-pham`...) khi chưa gắn nội dung chuyên sâu sẽ được trỏ về một component dùng chung: **`ComingSoonView.tsx`**.
- **Đặc điểm của `ComingSoonView`:**
  - Kế thừa 100% Header, Navigation và Footer chuẩn mực.
  - Hiển thị nhận diện thương hiệu, tiêu đề trang tương ứng và thông điệp: *"Chuyên mục đang được hoàn thiện nội dung chính thức theo tiêu chuẩn Bệnh viện Thú y Lê Sơn"*.
  - Cung cấp 2 nút hành động trực tiếp: `Quay lại Trang chủ` và `Gọi Hotline Cấp cứu 24/24 (097 355 51 05)`.
  - Không sinh lỗi console, không gây layout shift.

---

### 3. Cỗ Máy Trạng Thái Form Đặt Lịch Khám (Booking State Machine)

Hệ thống đặt lịch áp dụng chặt chẽ mô hình **Finite State Machine (FSM)** với 6 trạng thái bất biến:

```
               ┌───────────────┐
               │     idle      │  (Người dùng đang điền form)
               └───────┬───────┘
                       │ submit (Client validation PASS)
                       ▼
               ┌───────────────┐
               │  submitting   │  (Đang gửi payload tới tiếp nhận)
               └───────┬───────┘
          ┌────────────┴────────────┐
          │ Lỗi mạng / Validate lỗi │ Thành công (HTTP 200/201)
          ▼                         ▼
   ┌───────────────┐        ┌───────────────┐
   │    failed     │        │   received    │  (Đã tiếp nhận yêu cầu)
   └───────────────┘        └───────┬───────┘
                                    │ Hệ thống chuyển vào hàng chờ
                                    ▼
                            ┌────────────────────────┐
                            │ awaiting_confirmation  │  (Chờ nhân sự bệnh viện liên hệ)
                            └───────────┬────────────┘
                                        │ Backend / Webhook xác nhận sau khi
                                        │ nhân viên gọi điện chốt lịch thành công
                                        ▼
                            ┌────────────────────────┐
                            │       confirmed        │  (ĐÃ XÁC NHẬN CHÍNH THỨC)
                            └────────────────────────┘
```

#### Quy định nghiêm ngặt về phân định vai trò Client - Backend:
1. **Trạng thái `idle`:** Form sẵn sàng nhập liệu. Client thực hiện validate: Họ tên, Số điện thoại (chuẩn 10 số VN), Tên thú cưng, Loài, Dịch vụ yêu cầu, Ngày giờ hẹn.
2. **Trạng thái `submitting`:** Nút bấm chuyển sang loading, vô hiệu hóa nhập lại để tránh gửi trùng lặp (double submit).
3. **Trạng thái `failed`:** Phát sinh khi lỗi kết nối mạng hoặc lỗi định dạng dữ liệu; hiển thị thông báo lỗi rõ ràng và giữ nguyên nội dung form để khách hàng không phải nhập lại từ đầu.
4. **Trạng thái `received` & `awaiting_confirmation`:**
   - Khi client nhận phản hồi thành công từ API, giao diện **CHỈ ĐƯỢC PHÉP** hiển thị thông điệp chuẩn mực:
     > *"Bệnh viện Thú y Lê Sơn đã tiếp nhận yêu cầu đặt lịch. Nhân viên bệnh viện sẽ liên hệ để xác nhận thời gian khám phù hợp."*
   - Tuyệt đối không dùng vai trò "lễ tân" như một bộ phận nhân sự riêng bắt buộc, không đưa ra cam kết thời gian cố định chưa được phê duyệt.
5. **Trạng thái `confirmed` (QUY TẮC BẢO VỆ):**
   - **Tuyệt đối KHÔNG BAO GIỜ** được tự động gán ở phía Client ngay sau khi bấm nút gửi.
   - Trạng thái `confirmed` chỉ xuất hiện trên Cổng khách hàng (`/tai-khoan/lich-hen`) khi có xác nhận chính thức từ cơ sở dữ liệu backend (sau khi nhân viên bệnh viện đã kiểm tra và liên hệ chủ nuôi).

---

### 4. Cấu Trúc Thư Mục Chuẩn Hóa

```
d:/webbvct/
├── public/                     # Tài nguyên tĩnh (ảnh thật, font, icon)
├── src/
│   ├── app/                    # Providers, Contexts (BookingContext, ThemeContext)
│   ├── components/
│   │   ├── layout/             # Khung sườn website
│   │   │   ├── RootLayout.tsx  # Layout cha bao bọc Header, Outlet, Footer
│   │   │   ├── Header.tsx      # Desktop Header (Logo, Dropdown Nav, CTA Đặt lịch)
│   │   │   ├── MobileNav.tsx   # Mobile Drawer navigation & Quick call CTA
│   │   │   ├── Footer.tsx      # Thông tin 101 Khuất Duy Tiến, Hotline, Giờ khám
│   │   │   └── ComingSoonView.tsx # Component hiển thị an toàn cho route chưa có nội dung
│   │   ├── ui/                 # Atomic Reusable UI Components
│   │   │   ├── Button.tsx      # Các biến thể Plum Primary, Emergency Orange, Outline
│   │   │   ├── Card.tsx        # Base Card bo góc, đổ bóng tint mận
│   │   │   ├── Badge.tsx       # Tag nhãn chuyên khoa, cấp cứu 24/24
│   │   │   ├── Dropdown.tsx    # Dropdown menu có accessible keyboard support
│   │   │   └── Modal.tsx       # Dialog tiếp nhận lịch hẹn
│   │   └── sections/           # 6 Section chuyên biệt cho Trang chủ
│   │       ├── HeroSection.tsx         # Section 1: Editorial Hero ("Khi bé không khỏe...")
│   │       ├── ValueProposition.tsx    # Section 2: Vì sao chọn Lê Sơn (Bento + Immersive)
│   │       ├── FeaturedServices.tsx    # Section 3: Dịch vụ tiêu biểu (3 dịch vụ + Cấp cứu)
│   │       ├── HighlightStory.tsx      # Section 4: 1 Câu chuyện nổi bật (Minh họa rõ ràng)
│   │       ├── EditorialKnowledge.tsx  # Section 5: Góc kiến thức & Tin tức (2-3 bài viết)
│   │       └── BookingCTASection.tsx   # Section 6: Đặt lịch & Thông tin phòng khám
│   ├── pages/                  # Page Views (Home, About, Services, Booking...)
│   ├── features/               # Module nghiệp vụ (booking, stories, knowledge)
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # Service layer & Mock adapter có kiểm soát
│   ├── styles/
│   │   ├── tokens.css          # Design Tokens (Single Source of Truth)
│   │   └── globals.css         # Reset, font loading & base utilities
│   ├── types/                  # Type definitions (Doctor, Service, BookingStatus, Meta)
│   └── utils/                  # cn.ts, formatters, validation
├── docs/                       # Tài liệu kiến trúc & kế hoạch
├── package.json
├── tsconfig.json
└── vite.config.ts
```
