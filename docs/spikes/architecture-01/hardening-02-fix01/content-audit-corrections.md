# ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01: ĐÍNH CHÍNH & HOÀN THIỆN CONTENT AUDIT REGISTER (F03 / 3B-H2-P2-3, 3B-H2-P2-4)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị:** CEO DIRECTIVE 058-A (Mục VI)  
**Agent:** Antigravity — Architecture Implementation  
**Worktree:** `D:\webbvct-hardening-02-fix01`  
**Nhánh:** `spike/architecture-01-hardening-02-fix01`  

---

## I. CÁC ĐIỂM SAI SÓT ĐÃ ĐƯỢC CLAUDE CHỈ RA & ĐÍNH CHÍNH CHI TIẾT

Trong bản báo cáo Hardening 02 trước đây, bảng Content Audit Register mắc phải 7 sai lệch nghiêm trọng về dữ liệu nguồn đối chiếu:

1. **Ghi sai nguồn gốc claim "Vô trùng":**
   - *Bản cũ:* Ghi rằng "vô trùng" là claim nằm trong mã nguồn của baseline 3A (`facilities.tsx`).
   - *Thực tế:* Từ "vô trùng" **hoàn toàn không tồn tại** trong mã nguồn baseline 3A. Từ này do Antigravity tự ý đưa vào metadata của `facilities.tsx` trong quá trình thực hiện Hardening 01, sau đó đã bị Claude phát hiện (Finding H07) và gỡ bỏ trong Hardening 02.
   - *Đính chính:* Phân loại rõ "Vô trùng" là **Claim do Spike tự sinh (Spike-introduced metadata)** và hiện đã bị **REJECTED / REMOVED** khỏi toàn bộ mã nguồn.

2. **Ghi sai vị trí của "Khử khuẩn" và "Trực đêm":**
   - *Bản cũ:* Ghi "khử khuẩn" và "trực đêm" nằm tại `facilities.tsx` (Khu vệ sinh công cụ, khu lưu trú ban đêm).
   - *Thực tế:*
     - "Khử khuẩn" nằm tại `src/components/sections/FeaturedServices.tsx` (Dòng 31): `"Khu vực nội trú chuyên biệt được vệ sinh khử khuẩn định kỳ, theo dõi chỉ số sức khỏe liên tục và chế độ dinh dưỡng phục hồi."`
     - "Trực đêm" nằm tại `src/components/sections/FeaturedServices.tsx` (Dòng 141): `"Đội ngũ y tế trực đêm tại 101 Khuất Duy Tiến, Thanh Xuân, Hà Nội luôn sẵn sàng tiếp nhận ngay lập tức."`
   - Cả hai đều thuộc phần nội dung của **Trang chủ (`/`)** và được prerender vào `build/client/index.html`.

3. **Ghi nhận claim "Cách ly" không có thật trong mã nguồn:**
   - *Bản cũ:* Ghi claim "buồng cách ly" tại `facilities.tsx`.
   - *Thực tế:* Trong toàn bộ repository baseline 3A, không có chuỗi nào chứa "buồng cách ly". Đã xóa bỏ hoàn toàn dòng này khỏi bảng kiểm toán.

4. **Ghi sai giờ tiếp nhận khám bệnh:**
   - *Bản cũ:* Ghi giờ tiếp nhận là `08:00 - 20:00`.
   - *Thực tế:* Cấu hình chính thức duy nhất tại `src/config/contact.ts` (`HOSPITAL_CONTACT`) quy định:
     - `workingHours`: `'08:00 – 21:00 (Tất cả các ngày)'`
     - `workingHoursDetail`: `'08:00 – 21:00 (Tất cả các ngày trong tuần)'`
     - `emergencyHours`: `'Tiếp nhận cấp cứu 24/24'`
   - *Đính chính:* Giờ tiếp nhận chuẩn là **08:00 – 21:00**.

5. **Ghi nhận sai lệch về trạng thái của "24/7":**
   - *Bản cũ:* Ghi "24/7 đã loại bỏ khỏi Header/Footer theo quyết định Vòng sửa 02".
   - *Thực tế:* Vòng sửa 02 chỉ đơn giản hóa số điện thoại trên thanh Header/TopBar. Chuỗi "24/7" và "24/24" **vẫn tồn tại nguyên vẹn** trong rất nhiều vị trí cốt lõi của baseline 3A:
     - `src/components/layout/Footer.tsx` (Dòng 30, 105)
     - `src/components/layout/Header.tsx` (Dòng 38 — Menu dịch vụ)
     - `src/components/layout/MobileNav.tsx` (Dòng 272)
     - `src/components/sections/FeaturedServices.tsx` (Dòng 29)
     - `src/pages/AboutPage.tsx` (Dòng 276)
     - `src/pages/BookingPage.tsx` (Dòng 455)
     - `src/pages/FacilitiesPage.tsx` (Dòng 15, 34, 101, 108, 111, 204, 216, 219)
     - `app/routes/service-inpatient.tsx` (Dòng 6, 13, 26)

6. **Bỏ sót claim "Theo dõi chỉ số sức khỏe liên tục":**
   - Nằm tại `src/components/sections/FeaturedServices.tsx` (Dòng 31). Bổ sung ngay vào register.

7. **Bổ sung cột Thẩm quyền xác minh và Trạng thái chuẩn hóa:**
   - Đưa vào các vai trò chịu trách nhiệm: **Chủ dự án (Project Owner)**, **Giám đốc chuyên môn / Bác sĩ có thẩm quyền (Medical Director / Authorized Doctor)**, **Pháp chế (Legal)**.
   - Sử dụng chuẩn 4 trạng thái: `VERIFIED` (Đã có văn bản chứng minh), `PENDING` (Đang chờ xác minh), `REJECTED` (Đã loại bỏ), `NOT APPLICABLE` (Không áp dụng).

---

## II. BẢNG CONTENT AUDIT REGISTER ĐÍNH CHÍNH TOÀN DIỆN

| Nhóm nội dung | Tuyên bố / Claim | Nguồn gốc | Vị trí chính xác trong Code | Trạng thái hiện tại | Thẩm quyền xác minh | Điều kiện bắt buộc để được phép Public Index trên Production |
| --- | --- | --- | --- | --- | --- | --- |
| **Spike Metadata** | "Vô trùng" / "Chuẩn y khoa" | Spike Hardening 01 | Từng xuất hiện trong `app/routes/facilities.tsx` (meta) | **REJECTED / REMOVED** | Bác sĩ thẩm quyền / Chủ dự án | Đã bị loại bỏ 100% khỏi metadata. Không sử dụng trong bất kỳ tài liệu public nào nếu chưa có giấy kiểm định vi sinh áp lực dương. |
| **Spike Metadata** | "Cơ sở vật chất hiện đại" | Spike Hardening 01 | Từng xuất hiện trong `app/routes/home.tsx` (meta) | **REJECTED / REMOVED** | Chủ dự án | Đã bị loại bỏ 100% khỏi metadata. |
| **Thời gian vận hành** | "Giờ tiếp nhận: 08:00 – 21:00" | Baseline 3A (Xác nhận từ User 26/10) | `src/config/contact.ts` (Dòng 14-15), `src/pages/BookingPage.tsx` (Dòng 202) | **VERIFIED** | Chủ dự án (Đã xác nhận ngày 26/10/2026) | Được phép xuất hiện trong nội dung và metadata. |
| **Thời gian vận hành** | "Tiếp nhận cấp cứu 24/24" | Baseline 3A | `src/config/contact.ts` (Dòng 16), `src/components/layout/Footer.tsx` (Dòng 30) | **PENDING** | Chủ dự án / Giám đốc chuyên môn | Cần văn bản quy định quy trình thường trực cấp cứu ngoài giờ và bảng phụ phí dịch vụ ban đêm. |
| **Lưu trú y tế** | "Chăm sóc nội trú 24/7" | Baseline 3A | `src/components/layout/Header.tsx:38`, `Footer.tsx:105`, `MobileNav.tsx:272`, `FeaturedServices.tsx:29`, `FacilitiesPage.tsx:101, 204`, `service-inpatient.tsx:6, 26` | **PENDING** | Giám đốc chuyên môn / Chủ dự án | Cần văn bản phê duyệt quy chế nội trú 24/7 và giấy phép bố trí nhân sự chăm sóc thú cưng qua đêm. |
| **Vệ sinh y tế** | "Vệ sinh khử khuẩn định kỳ" | Baseline 3A | `src/components/sections/FeaturedServices.tsx` (Dòng 31 — Thẻ dịch vụ nội trú trên Trang chủ) | **PENDING** | Giám đốc chuyên môn / Bác sĩ có thẩm quyền | Cung cấp quy trình kiểm soát nhiễm khuẩn và danh mục hóa chất khử trùng chuyên dụng có đăng ký lưu hành. |
| **Chăm sóc y tế** | "Theo dõi chỉ số sức khỏe liên tục" | Baseline 3A | `src/components/sections/FeaturedServices.tsx` (Dòng 31 — Thẻ dịch vụ nội trú trên Trang chủ) | **PENDING** | Giám đốc chuyên môn / Bác sĩ có thẩm quyền | Quy định rõ quy trình ghi chép bệnh án nội trú, tần suất đo sinh hiệu (nhiệt độ, nhịp tim, hô hấp) và thiết bị theo dõi. |
| **Nhân sự trực** | "Đội ngũ y tế trực đêm" | Baseline 3A | `src/components/sections/FeaturedServices.tsx` (Dòng 141 — Khung cấp cứu trên Trang chủ) | **PENDING** | Giám đốc chuyên môn / Chủ dự án | Cung cấp danh sách ca trực đêm, chứng chỉ hành nghề của bác sĩ phụ trách ca trực đêm tại 101 Khuất Duy Tiến. |
| **Chẩn đoán y khoa**| "Chẩn đoán hình ảnh kỹ thuật số" | Baseline 3A | `src/components/sections/FeaturedServices.tsx` (Dòng 22), `src/pages/FacilitiesPage.tsx` (Dòng 15, 34) | **PENDING** | Bác sĩ có thẩm quyền / Pháp chế | Giấy phép an toàn bức xạ (đối với máy chụp X-quang) và số lưu hành thiết bị siêu âm/chẩn đoán hình ảnh. |
| **Sản phẩm thương mại** | "Sản phẩm chính hãng chọn lọc" | Baseline 3A | `app/routes/products.tsx` (Dòng 10, 17, 27), `src/app/routes.tsx` (Dòng 159) | **PENDING** | Chủ dự án / Bộ phận kho vận | Hợp đồng phân phối hoặc hóa đơn chứng từ chứng minh nguồn gốc xuất xứ của các dòng hạt, thuốc thú y và phụ kiện. |

---

## III. TÁC ĐỘNG ĐỐI VỚI PRERENDER VÀ HƯỚNG XỬ LÝ TRƯỚC KHI LÊN PRODUCTION

1. **Thực trạng Prerender:**
   Do kiến trúc React Router 7 Framework Mode thực hiện prerender tĩnh toàn bộ HTML của các trang công khai (Homepage `/`, `/gioi-thieu`, `/co-so-vat-chat`, `/san-pham`), các chuỗi văn bản nêu trên nằm trực tiếp trong file HTML tĩnh tại `build/client/index.html` và `build/client/san-pham/index.html`.
2. **Cơ chế bảo vệ hiện tại:**
   Tất cả các trang này hiện được gắn thẻ `<meta name="robots" content="noindex, nofollow" />` và máy chủ phát header `X-Robots-Tag: noindex, nofollow`, ngăn chặn hoàn toàn việc Google bot thu thập các claim này trong giai đoạn thử nghiệm.
3. **Kế hoạch hành động trước Production:**
   Trước khi bật cờ `production` để mở index cho công chúng:
   - Các claim mang trạng thái **PENDING** phải được Chủ dự án và Bác sĩ có thẩm quyền duyệt văn bản.
   - Nếu claim nào không đủ chứng từ xác minh, nội dung trên giao diện baseline 3A phải được sửa đổi trực tiếp ở file nguồn trước khi build bản Production chính thức.
