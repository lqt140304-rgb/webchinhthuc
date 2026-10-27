# Design QA 3A-01: Giới thiệu, Đội ngũ, Cơ sở vật chất (Claude)

| Mục | Giá trị |
|---|---|
| Người kiểm tra | Claude (Independent QA Lead) |
| Căn cứ | CEO Directive 017-B; `AGENTS.md` (Architecture Baseline V1); `PROJECT_BRIEF.md`; `docs/phase-3a-design-blueprint.md` |
| Phạm vi | **Chỉ review thiết kế.** Chưa có code 3A để QA |
| Tài liệu đã nhận | `docs/phase-3a-design-blueprint.md` trên `fix/milestone-2a-qa`, commit `249c5c4` (v2.0). Gồm Content và UX Blueprint, wireframe dạng ASCII cho desktop và mobile, đặc tả visual, component, animation, a11y, rủi ro |
| **Tài liệu chưa nhận** | **Mockup trực quan `phase-3a-interactive-mockups.html`.** Blueprint ghi file này nằm "trong thư mục Artifacts của phiên làm việc", nhưng repo và mọi nhánh đều không có. **CEO Directive 017-A** và văn bản quyết định của chủ dự án về trang Đội ngũ cũng chưa đến tay Claude. Claude dùng nội dung quyết định được trích lại trong Blueprint mục 2.2 |
| Ngày | 27/10/2026 |

## 1. Kết luận: **DESIGN PASS WITH FIXES**

Phần review visual trên mockup đang ở trạng thái **BLOCKED**.

- **Đạt:** Blueprint và wireframe có cấu trúc tốt, bám sát Architecture Baseline V1 và nhận diện Vibrant Editorial Luxury.
  - Ranh giới giữa dữ liệu đã xác minh và nội dung chờ duyệt được xác định rõ.
  - Typography tôn trọng phương án C, và không dùng Lora in nghiêng.
  - Bố cục đa dạng, hạn chế card lặp.
- **Phải sửa trước khi duyệt thiết kế: 2 lỗi P1.** Cả hai đều ở trang Đội ngũ:
  - **3A-P1-1:** dùng ảnh stock gắn với tên người thật.
  - **3A-P1-2:** wireframe tự đặt ra cơ cấu nhân sự chưa được xác minh.
- **Có 10 lỗi P2** cần cải thiện, và một số lỗi P3.
- **Không có lỗi P0.**
- **Chưa đánh giá được bằng mắt** màu, khoảng trắng, nhịp ảnh và độ cân đối responsive, vì chưa nhận được mockup. Chủ dự án chỉ nên duyệt thiết kế sau khi mockup được đưa vào repo (hoặc gửi link) và Claude review xong.

## 2. Trang `/gioi-thieu`

**Điểm đạt:**

- Thông điệp tạo niềm tin mà không khoa trương. H1 "Nơi sự cẩn trọng y khoa song hành cùng lòng thấu cảm" và đoạn dẫn không có con số, giải thưởng hay năm thành lập tự đặt.
- Ba giá trị cốt lõi khớp nội dung `WhyChooseUs` đã nghiệm thu ở Mốc 2B (`src/components/sections/WhyChooseUs.tsx`).
- Câu chuyện sáng lập được đặt vào **Owner Story Slot**, không tự điền.
- Bố cục editorial nhất quán với trang chủ: Hero 7/5, khung ảnh bo góc AURA lấy từ `HeroSection.module.css`, Ivory xen kẽ Lavender, triptych có số 01–03 thay cho 3 card.
- Điều hướng hợp lý: CTA Đặt lịch và Hotline ở Hero và cuối trang; hai pathway dẫn sang Đội ngũ và Cơ sở vật chất. Trên mobile, CTA đặt trước ảnh.

**Phát hiện:**

| ID | Mức | Vấn đề | Bằng chứng | Đề xuất |
|---|---|---|---|---|
| 3A-P2-1 | P2 | Bốn "nguyên tắc phục vụ" là cam kết vận hành chưa được xác minh, nhưng viết như sự thật: "vệ sinh khử khuẩn định kỳ khu lưu trú", "cập nhật tình hình cho gia đình", "chỉ chia sẻ báo cáo đã được bác sĩ duyệt" | Blueprint mục 2.1, Khu vực 4. Deliverable 6, A.1 vẫn đang chờ chủ dự án xác nhận | Giữ ở trạng thái slot "chờ xác nhận" trong mockup, và chỉ dùng câu trung tính cho tới khi chủ dự án duyệt |
| 3A-P2-2 | P2 | Khung ảnh Hero là "sự gắn kết giữa bác sĩ và thú cưng". Ảnh stock có người mặc blouse dễ bị hiểu là bác sĩ của Lê Sơn, kể cả khi có nhãn | Mục 2.1, Khu vực 1, quy tắc ảnh | Chọn ảnh minh họa không có người mặc đồng phục y tế nhận diện được, hoặc chỉ dùng ảnh thú cưng và không gian |
| 3A-P3-1 | P3 | Dải thông tin (địa chỉ, giờ khám, cấp cứu) xuất hiện cả ở Hero lẫn dải CTA cuối trang, trên một trang ngắn | Wireframe 3.1 | Giữ một chỗ, hoặc rút gọn dải CTA cuối trang |
| 3A-P3-2 | P3 | Breadcrumb "Về Lê Sơn" là nhóm menu, không có trang riêng | Mục 2.1 | Render dạng text, không đặt link, để tránh 404 hoặc soft 404 |

## 3. Trang `/doi-ngu`

Đối chiếu với quyết định của chủ dự án, theo phần Blueprint trích lại:

| Tiêu chí của Directive 017-B | Kết quả |
|---|---|
| Phân nhóm theo bộ phận thực tế | **Đạt về nguyên tắc.** Có hai nhóm: Bác sĩ thú y; Spa & Grooming và Điều dưỡng. Riêng việc **gom nhóm để cân đối lưới** cần xem 3A-P2-4 |
| Không đặt riêng hay làm nổi bật cá nhân vì chức vụ | **Đạt.** Không có section dành riêng cho Bác sĩ trưởng, không viền vàng hay card to, chức danh nằm ở dòng tiêu chuẩn. Cần quy định thứ tự sắp xếp (3A-P2-3) |
| Card và ảnh đồng đều | **Đạt ở desktop.** Dùng chung `UniformTeamCard`, ảnh 4:5. **Chưa đạt ở tablet khi N = 5** (3A-P2-5) |
| Xử lý nhân sự kiêm nhiệm | **Đạt.** Mỗi người có `id` duy nhất, xuất hiện 1 lần, kèm tag "Kiêm nhiệm" |
| Không tạo hồ sơ giả hay chứng chỉ chưa xác minh | **Chưa đạt** (3A-P1-1, 3A-P1-2) |
| Bố cục mobile cân đối | Đạt theo đặc tả (1 cột). Chưa xem được trên mockup |

**Phát hiện:**

| ID | Mức | Vấn đề | Bằng chứng | Đề xuất |
|---|---|---|---|---|
| **3A-P1-1** | **P1** | Card mang **tên thật "BS. Lê Thái Sơn"** lại dùng ảnh stock 4:5 gắn nhãn "Ảnh minh họa mẫu". Đặt một khuôn mặt stock dưới tên của một người thật là trình bày sai danh tính, dù đã có nhãn. Chính bảng 2B-06 đã ghi: "không có bác sĩ hay người chăm sóc nào trong ảnh được gán danh tính là bác sĩ thật" | Mục 2.2, Khu vực 2, Thẻ 1; wireframe 3.2 B | Card có tên thật mà chưa có ảnh thật thì dùng **placeholder trung tính** (monogram hoặc khung trống "Ảnh chân dung chờ cập nhật"), **không dùng ảnh người**. Ảnh stock chỉ dùng cho card ẩn danh, và cũng không nên là ảnh người mặc đồ y tế |
| **3A-P1-2** | **P1** | Wireframe đã ấn định **cơ cấu nhân sự chưa xác minh**: 3 bác sĩ, chức danh cụ thể ("Khám & Điều trị lâm sàng", "Ngoại khoa & Cấp cứu"), kiêm nhiệm ("BS. Lê Thái Sơn — Kiêm nhiệm: Nội trú 24/7", "Kiêm nhiệm: Chẩn đoán"), pill chuyên môn ("Ngoại khoa", "Cấp cứu"). Đây là thông tin về người thật và năng lực chuyên môn, chưa có nguồn | Wireframe 3.2 B, Section 2 và 3 | Trong mockup chỉ hiển thị **slot trung tính** ("[Chức danh — chờ hồ sơ]", "[Kiêm nhiệm — nếu có]"), không đặt số lượng hay chuyên khoa mẫu. Riêng card BS. Lê Thái Sơn chỉ ghi tên và chức danh đã có trong tài liệu ("Phụ trách chuyên môn"), kèm xác nhận của chủ dự án |
| 3A-P2-3 | P2 | "Thẻ 1 hiển thị BS. Lê Thái Sơn": luôn đặt người phụ trách đầu tiên vẫn là một dạng thứ bậc ngầm | Mục 2.2, Khu vực 2 | Quy định thứ tự trung tính (theo tên, hoặc theo danh sách chủ dự án cung cấp) và ghi rõ quy tắc này trong blueprint |
| 3A-P2-4 | P2 | Gộp "Spa & Grooming và Điều dưỡng" thành một section **để cân đối lưới** có thể mô tả sai cơ cấu bộ phận thực tế. Quy tắc N = 1 ("gộp với bộ phận gần nhất") đặt yếu tố thẩm mỹ lên trên tính chính xác | Mục 2.2, quy tắc 6; ma trận 3.2 A; Quyết định 2 | Mặc định theo bộ phận thực tế. Nếu bộ phận chỉ có 1 người, dùng **một card căn giữa có cùng kích thước** (vẫn cân đối), không gộp nhãn bộ phận. Để chủ dự án quyết định ở Quyết định 2 |
| 3A-P2-5 | P2 | Ma trận lưới: ở tablet khi N = 5 dùng "2 cột cho 4 card đầu + 1 thẻ ngang". Thẻ ngang khác dạng card, trái với quy tắc "cùng kích thước card". Ma trận cũng chưa định nghĩa N ≥ 7 | Bảng 3.2 A | Tablet N = 5: dùng 3 + 2 căn giữa với cùng card dọc (giống desktop), hoặc cả 5 card cùng dạng ngang. Bổ sung quy tắc tổng quát cho N ≥ 7 (ví dụ: hàng cuối căn giữa) |
| 3A-P2-6 | P2 | Bộ lọc bộ phận "làm mờ" các card không thuộc nhóm đang lọc. Card bị làm mờ vẫn đọc được và vẫn Tab tới được, gây nhiễu cho trình đọc màn hình | Mục 6, dòng 3; mục 8.2 | Dùng **link nhảy tới anchor** của từng section (đơn giản và dễ tiếp cận hơn). Nếu giữ bộ lọc thì ẩn hẳn bằng `hidden` và thông báo số kết quả qua `aria-live` |
| 3A-P2-7 | P2 | Thông tin "Bác sĩ trưởng Lê Thái Sơn" ở nhiều nơi trái với quyết định "không theo cấp bậc". Blueprint mới nêu Header; còn sót `src/app/routes.tsx:31`, `docs/seo-strategy.md:18`, `docs/sitemap.md:11` ("nổi bật BST Lê Thái Sơn"), `docs/implementation-plan.md:70` ("Nổi bật BST Lê Thái Sơn") | `git grep` trên `fix/milestone-2a-qa` | Đưa toàn bộ danh sách này vào Quyết định 1, và cập nhật đồng loạt khi triển khai code |
| 3A-P2-8 | P2 | Quy trình phối hợp 4 bước có cam kết vận hành chưa xác minh: "ưu tiên ngay ca cấp cứu khẩn cấp", "bàn giao giữa các ca trực 24/24", "hội chẩn" | Mục 2.2, Khu vực 4; wireframe Section 4 | Đánh dấu chờ chủ dự án xác nhận. Chỉ giữ những điểm đã có nguồn (tiếp nhận cấp cứu 24/24) |
| 3A-P3-3 | P3 | Yêu cầu "cùng số dòng mô tả" dễ dẫn tới cắt chữ (line-clamp) làm mất nội dung thật | Mục 2.2, quy tắc 2 | Cân chiều cao bằng CSS grid hoặc `min-height`, không cắt nội dung |
| 3A-P3-4 | P3 | Dòng "[Bằng cấp / Chứng chỉ hành nghề: Chờ xác minh]" ổn trong mockup, nhưng không nên hiển thị công khai | Mục 2.2, dòng 4 | Khi publish, ẩn trường nếu chưa có dữ liệu (`verified: false`) |

## 4. Trang `/co-so-vat-chat`

| Tiêu chí của Directive 017-B | Kết quả |
|---|---|
| Ảnh ghi rõ thật hay minh họa | **Đạt.** Mọi khung có nhãn "Ảnh minh họa bố cục — Không phải ảnh thực tế tại bệnh viện", có banner chính sách ảnh, có hậu tố trong `alt` |
| Không dùng ảnh stock như ảnh bệnh viện | **Đạt** trong thiết kế. Xem thêm 3A-P2-9 về việc khi nào được công bố |
| Thiết bị mô tả đúng phạm vi đã xác minh | **Đạt một phần.** Đã có Equipment Verification Slot; nhưng xem 3A-P2-10 và 3A-P2-11 |
| Gallery dễ duyệt trên mobile | Đạt theo đặc tả: 1 cột, Zone Jump Bar cuộn ngang, vùng chạm 44 px. Chưa xem được mockup |
| Không công khai bệnh án hay ảnh bệnh nhân thiếu đồng ý | Đạt. Không có. Xem 3A-P3-5 |

**Phát hiện:**

| ID | Mức | Vấn đề | Bằng chứng | Đề xuất |
|---|---|---|---|---|
| 3A-P2-9 | P2 | Một trang "Cơ sở vật chất" mà toàn ảnh stock gắn nhãn "không phải ảnh bệnh viện" thì không đạt mục đích của trang, và có thể làm giảm niềm tin | Mục 2.3; Deliverable 6, C.1 | Đặt quy tắc phát hành: **chỉ đưa trang vào menu công khai hoặc cho index khi có đủ ít nhất 4 ảnh thật đã được duyệt**. Trên preview vẫn có thể dùng ảnh minh họa |
| 3A-P2-10 | P2 | H1 "Không gian thăm khám **sạch khuẩn**" là tuyên bố mạnh, gần với "vô khuẩn", chưa được xác minh | Mục 2.3, Khu vực 1 | Dùng cách nói đúng mức, ví dụ "không gian thăm khám sạch sẽ, được vệ sinh định kỳ", và chờ chủ dự án xác nhận |
| 3A-P2-11 | P2 | Slot thiết bị vẫn ghi thương hiệu "(VD: Mindray)" trong nội dung hiển thị. Ở dạng xem trước, người đọc vẫn có thể hiểu là bệnh viện có thiết bị này. Ngoài ra, "Khu vực Thủ thuật & **Phẫu thuật ngoại khoa**" là một **phòng hoặc khu riêng**; việc có phòng này chưa được xác minh (dịch vụ phẫu thuật thì đã có trong nội dung 2B) | Mục 2.3, Khu vực 3; wireframe Section 3 | Slot chỉ ghi "[Thiết bị xét nghiệm — chờ xác minh]", không nêu tên hãng. Chuyển khu phẫu thuật vào danh sách chờ chủ dự án xác nhận |
| 3A-P3-5 | P3 | Ảnh thật chụp cơ sở có thể lọt thú cưng hoặc chủ nuôi là khách hàng | Deliverable 6, C.1 | Thêm quy tắc: không có khách hàng hay thú cưng nhận diện được nếu chưa có phiếu đồng ý; che màn hình máy tính hoặc hồ sơ trong khung hình |

## 5. Art Direction và hệ thống

| Hạng mục | Đánh giá |
|---|---|
| Vibrant Editorial Luxury | Đạt theo đặc tả. Bốn kiểu cấu trúc (split bất đối xứng, hairline ledger, photo spread, card chọn lọc) giúp tránh lặp. **Chưa thấy bằng mắt** (mockup BLOCKED) |
| Typography | Đạt. Chỉ dùng 6 file WOFF2 của phương án C; không dùng Lora italic (tránh nghiêng giả); vai trò của từng weight rõ ràng |
| Màu sắc | Đạt. Chỉ dùng token trong `src/styles/tokens.css`; cam dành riêng cho cấp cứu và hotline. Bảng tương phản trong Blueprint mục 8.2 **có sai số** (3A-P3-6) |
| Khoảng trắng, nhịp ảnh | Có xen kẽ nền Ivory và Lavender, ảnh lớn và text-first. **Chưa đánh giá được** khi chưa có mockup |
| Nhất quán giữa 3 trang | Đạt. Cùng Hero pattern, breadcrumb, dải CTA Deep Plum, cùng nhãn minh họa |
| Responsive 320–1920 px | Đặc tả có đủ 7 mốc (mục 8.1). Nhưng mockup chỉ hỗ trợ 5 viewport (1440, 1366, 768, 390, 320), **thiếu 360 và 1920** (3A-P3-7) |
| Accessibility dự kiến | Tốt: 1 `h1` mỗi trang, heading theo thứ bậc, vùng chạm 44 px, focus ring, `aria-pressed`. Riêng bộ lọc cần xem 3A-P2-6. Hậu tố `alt` rất dài và lặp lại nhiều lần với trình đọc màn hình (3A-P3-8) |
| Animation, reduced motion | Đạt. Chỉ dùng CSS, chỉ animate `transform` và `opacity`, ảnh LCP hiện ngay; có phương án `prefers-reduced-motion` cho từng hiệu ứng |
| Tái sử dụng token và component | Đạt. Có danh mục tái sử dụng (`RootLayout`, `Header`, `useRouteSeo`, `HOSPITAL_CONTACT`, các pattern CSS Module). Phát hiện đúng hai điểm: `Button.tsx` còn màu `bg-blue-600` ngoài bộ thương hiệu, và `isDirector` trong `src/types/index.ts`. Đề xuất `TeamMember` có `verified` phù hợp |
| Rủi ro build (R-3A-02) | **Đã kiểm.** Build tại `249c5c4`, có thêm blueprint 666 dòng, vẫn cho đúng hash `index-vrX09Urw.css` `ca6de747…` và `index-CvVwFN8Z.js` `10f187c6…` ([bằng chứng](3a-design-qa-01-evidence/build-hash-249c5c4.txt)). Lần này Tailwind chưa bị ảnh hưởng, nhưng rủi ro vẫn còn: nên giới hạn phạm vi quét của Tailwind (`@source`) khi bước vào giai đoạn code |

**Phát hiện P3 khác:**

| ID | Mức | Vấn đề | Đề xuất |
|---|---|---|---|
| 3A-P3-6 | P3 | Số tương phản ở mục 8.2 không chính xác. Ví dụ white/cam `#C2560C` tính lại được **4.54:1**, Blueprint ghi 4.65:1. Vẫn đạt AA nhưng rất sát ngưỡng. Một số số khác ghi thấp hơn thực tế ([tính lại](3a-design-qa-01-evidence/contrast-check.txt)) | Sửa lại số. Với cam: chữ trên nút không dưới 14 px đậm hoặc 16 px thường |
| 3A-P3-7 | P3 | Mockup thiếu viewport 360 và 1920 | Bổ sung để khớp với quy trình QA 7 viewport |
| 3A-P3-8 | P3 | Hậu tố `alt` "(Hình ảnh minh họa — Không phải ảnh thực tế tại bệnh viện)" lặp lại ở mọi ảnh | Rút gọn thành "(ảnh minh họa)", và đặt một câu giải thích chung trong banner của trang |
| 3A-P3-9 | P3 | Blueprint ghi trạng thái "**APPROVED FOR DESIGN — NOT IMPLEMENTATION**", trong khi Directive 017-B ghi "PHASE 3A — PENDING OWNER DESIGN APPROVAL" | Đổi thành "Chờ chủ dự án duyệt thiết kế", tránh hồ sơ tự ghi đã duyệt |

## 6. Việc cần làm trước khi chủ dự án duyệt thiết kế

1. **Antigravity:**
   - Sửa 3A-P1-1 và 3A-P1-2.
   - Đưa mockup `phase-3a-interactive-mockups.html` vào repo (ví dụ `design/phase-3a/`), hoặc gửi link artifact, để Claude review bằng mắt ở 7 viewport.
2. **Antigravity:** xử lý các P2 (3A-P2-1 đến 3A-P2-11); các P3 tùy chọn.
3. **Chủ dự án hoặc CEO quyết định:**
   - Ba điểm ở Blueprint mục 9.2.
   - Quy tắc phát hành trang Cơ sở vật chất (3A-P2-9).
   - Quy tắc thứ tự sắp xếp card nhân sự (3A-P2-3).
4. **Claude:** review lại khi nhận mockup và blueprint đã sửa.

**Trạng thái: PHASE 3A — PENDING OWNER DESIGN APPROVAL.** Claude không sửa mã nguồn, không merge, không deploy.
