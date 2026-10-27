# PHASE 3A DEV-00 — DEV00-P2-1 TARGETED QA

| Mục | Chi tiết |
|---|---|
| Căn cứ | CEO Directive 026-B; baseline `docs/qa/3a-dev00-qa.md` (nhánh `claude/3a-dev00-qa`, commit `55bc5fe`) |
| Agent | Claude — Independent QA Lead (QA ONLY) |
| Ngày | 27/10/2026 |
| Nhánh kiểm tra | `fix/milestone-2a-qa` |
| Commit kiểm tra | `ab443fe2654ecee234c48ab4a54b21b820fbcc9e`: "docs(phase-3a): synchronize /doi-ngu lead text to close DEV00-P2-1" |
| Baseline | `c68ac149f3af60cd90e1e10c6f88e22c8451bcf2` (DEV-00 đã QA) |
| Phương pháp | Đọc trực tiếp file đã commit (`git archive ab443fe`); so sánh chuỗi tự động giữa Blueprint và mockup; diff với baseline; build sạch |
| Bằng chứng | `docs/qa/3a-dev00-qa-02-evidence/` (diff patch, diff stat, build hash) |

## Kết luận

- **DEV00-P2-1: FIXED**
- **DEV-00: PASS.** Còn vài P3 về tài liệu, không chặn DEV-01.
- **Đề xuất:** chủ dự án có thể xem xét phê duyệt mở DEV-01. Claude không giao lệnh code.

## 1. DEV00-P2-1: **FIXED**

| Vị trí | Nội dung |
|---|---|
| Blueprint `docs/phase-3a-design-blueprint.md` dòng 151, **trước** (`c68ac14`) | "…được tổ chức theo từng bộ phận chuyên môn **thực tế**. Mỗi thành viên đều có **vai trò rõ ràng và phối hợp chặt chẽ** vì sự an toàn của từng bé cưng." |
| Blueprint dòng 151, **sau** (`ab443fe`) | "Tại Bệnh viện Thú y Lê Sơn, hoạt động thăm khám và chăm sóc được tổ chức theo từng bộ phận chuyên môn. Các bộ phận và thẻ nhân sự dưới đây hiện là khung mô phỏng giao diện, chờ Chủ dự án xác nhận cơ cấu thực tế." |
| Mockup `docs/design/phase-3a-interactive-mockups.html` (`p3a-lead` dưới `h1` `/doi-ngu`, không đổi so với `c68ac14`) | Cùng câu trên |
| So sánh chuỗi tự động | **IDENTICAL** |

Đối chiếu yêu cầu của Directive 026-B:

| Yêu cầu | Kết quả |
|---|---|
| Blueprint và mockup thống nhất | Đạt (trùng nguyên văn) |
| Không mô tả cơ cấu chưa xác minh như sự thật | Đạt: câu ghi rõ là "khung mô phỏng giao diện, chờ Chủ dự án xác nhận cơ cấu thực tế"; không còn "thực tế", "vai trò rõ ràng", "phối hợp chặt chẽ" trong Blueprint (đếm được 0 lần) |
| Không tạo vai trò mới | Đạt |
| Không tự xác nhận chuyên môn hoặc chức danh | Đạt |
| Không tạo hierarchy | Đạt |
| Nhãn PENDING/ILLUSTRATIVE phù hợp | Đạt: mapping handoff 05 dòng `/doi-ngu` Section 2.1 trích đúng câu mới, gắn "PENDING VERIFICATION (Cơ cấu & Hồ sơ)" |

Blueprint 8.0 và handoff 05 ghi trạng thái DEV00-P2-1 là "READY FOR QA". QA xác nhận chuyển thành **FIXED**.

## 2. Hồi quy giới hạn

| Kiểm tra | Kết quả |
|---|---|
| File thay đổi (`c68ac14..ab443fe`) | 3 file, đều trong `docs/`: `docs/phase-3a-design-blueprint.md` (+7/−6), `docs/qa/3a-design-handoff-04.md` (+3), `docs/qa/3a-design-handoff-05.md` (+3/−2) |
| Phạm vi | Đúng phạm vi DEV00-P2-1, có kèm vài P3 tài liệu từ báo cáo DEV-00 (xem mục 3) |
| Mockup | **Không đổi** (`git diff c68ac14 ab443fe -- docs/design/` rỗng), nên Design Freeze giữ nguyên. Không cần chạy lại visual QA |
| Source website, routing, build config | 0 file ngoài `docs/` |
| Merge main / deploy | Không (`main` @ `d2a19c5`); không có deployment |
| Build sạch @ `ab443fe` | CSS `index-vrX09Urw.css` `ca6de747…fe66d87`; JS `index-CvVwFN8Z.js` `10f187c6…be234`: **trùng baseline** |
| Claim mới | Không có: các dòng thêm chỉ trích câu đã duyệt hoặc là ghi chú đính chính |
| Mapping / handoff | Không mâu thuẫn: handoff 05 và Blueprint 8.0 đều trích đúng câu mới; mapping sửa "Toolbar lọc 3 nhóm" thành "Toolbar 4 nút lọc" (đúng thực tế) |
| UTF-8 | 4 file decode strict OK, không BOM, 0 U+FFFD, 0 mojibake |

## 3. Các P3 từ báo cáo DEV-00

| ID | Trạng thái | Ghi chú |
|---|---|---|
| DEV00-P3-1 (wireframe "Bước 04") | **FIXED** | Dòng 375: "Bước 01 (Tiếp nhận) → Bước 02 (Thăm khám & Trao đổi) → Bước 03 (Chăm sóc & Hướng dẫn theo dõi)" |
| DEV00-P3-2 (đính chính) | **PARTIAL** | Đã sửa: handoff 04 có ghi chú đính chính trỏ tới handoff 05; nhãn nút đã sửa thành "Đặt lịch khám" trong Blueprint 8.0 và handoff 05. Còn sót: Blueprint 8.1 (dòng 593), dòng V3-P3-1 vẫn trích "Đặt lịch hẹn khám" và dẫn chứng class `.p3a-header-cta`/`.p3a-logo-subtitle` không tồn tại |
| DEV00-P3-3 (đường dẫn cục bộ) | **FIXED** | 0 `C:/Users`, 0 `webbvct`, 0 link `file:///` trong cả 4 file. Hai chữ `file:///` còn lại trong handoff 05 chỉ là câu mô tả, không phải link |
| DEV00-P3-4 (nhãn cũ) | OPEN | Blueprint dòng 524 và 703 vẫn ghi "v2.1"; dòng 649 và 706 ghi "7 mốc viewport" (mockup có 8, gồm 1024); Studio badge "v2.1" |
| DEV00-P3-5 (`aria-live`) | OPEN | Xử lý khi implement (DEV-01) |

Các P3 còn lại không ảnh hưởng tới tính chính xác nội dung hiển thị và không chặn DEV-01.

## 4. Những vấn đề còn mở (không tự đóng)

- **Header mobile (V3-P3-1 / 3A04-P2-1):** OPEN, đưa vào backlog DEV-01.
- **3A04-P3-1:** class bộ lọc còn nhiễu; dọn khi implement.
- **AP-1:** nguồn ảnh PARTIAL, vẫn UNVERIFIED.
- **Mốc 2B:**
  - Soft 404: OPEN
  - 2B-08 (LCP mobile): OPEN
  - 2B-06 (nguồn ảnh / ảnh thật): PENDING
  - SEO Production: chưa kiểm
  - 2B-29 (logo Champion, `src/components/sections/WhyChooseUs.tsx:30`): OPEN
- **Dữ liệu thật vẫn PENDING:** nhân sự, chức danh, ảnh, cơ cấu bộ phận, quy trình, thiết bị, phân khu, câu chuyện, nguyên tắc.

## 5. Điều kiện đóng DEV-00

| Điều kiện (026-B mục IV) | Kết quả |
|---|---|
| DEV00-P2-1 = FIXED | **Đạt** |
| Không có P1 Content Integrity | **Đạt** |
| Blueprint/mockup nhất quán | **Đạt** |
| Design Freeze giữ | **Đạt** (mockup không đổi) |
| Không sửa source website | **Đạt** |

**Kết luận DEV-00: PASS.** Claude đề xuất ChatGPT CEO trình chủ dự án xem xét **phê duyệt mở DEV-01**. Khi DEV-01 được duyệt, nên gom các P3 tài liệu còn lại vào commit đầu tiên, xử lý header mobile và `aria-live` trong code, giữ nguyên mọi placeholder và nhãn trạng thái, và không mở index các trang khi dữ liệu thật còn PENDING.

Claude không tự giao lệnh code cho Antigravity, không phê duyệt, không sửa source website.

---

**PHASE 3A DEV-00 — PENDING OWNER APPROVAL FOR DEV-01**
