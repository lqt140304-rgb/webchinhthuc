# ARCHITECTURE SPIKE 01 — HARDENING 02 FIX 01: BÁO CÁO ĐIỀU KIỆN SẴN SÀNG CHO PREVIEW & KẾ HOẠCH TRIỂN KHAI THỬ NGHIỆM (PREVIEW READINESS)

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị:** CEO DIRECTIVE 058-A (Mục IX & Mục X — Gate D)  
**Agent:** Antigravity — Architecture Implementation  
**Worktree:** `D:\webbvct-hardening-02-fix01`  
**Nhánh:** `spike/architecture-01-hardening-02-fix01`  
**Quyền hạn:** LOCAL EXPERIMENT ONLY — **DEPLOYMENT STRICTLY PROHIBITED**  

---

## I. ĐÁNH GIÁ TRẠNG THÁI SẴN SÀNG (READINESS ASSESSMENT)

Sau khi hoàn tất toàn bộ các mục sửa lỗi F01 đến F05:

| Tiêu chí | Trạng thái Hardening 02 | Trạng thái sau Fix 01 | Nhận định kỹ thuật |
| --- | --- | --- | --- |
| **Output Directory khớp mã nguồn** | Không có (Thiếu trong `vercel.json`) | **ĐÃ CÓ** (`outputDirectory: "build/client"`) | Khớp 100% với cấu trúc thư mục của React Router 7. |
| **Prerender HTML & Assets đầy đủ** | Đầy đủ | **ĐẦY ĐỦ** (19 routes, 404.html, assets, fallback) | Đã kiểm toán bằng script tự động. |
| **Chính sách SEO đồng nhất** | Mâu thuẫn khi chạy Production | **ĐỒNG NHẤT 100%** | Dùng chung biến biên dịch `__APP_ENV__`, không xung đột robots. |
| **Bảo vệ môi trường Preview** | Có header | **BẢO VỆ 2 LỚP** | Thẻ meta `noindex, nofollow` + Header `X-Robots-Tag: noindex, nofollow`. |
| **Không phụ thuộc môi trường máy** | Bị lỗi hardcoded path | **HOÀN TOÀN ĐỘC LẬP** | Đã khai báo Playwright trong devDependencies. |
| **Trạng thái Gate D** | **NOT READY FOR PREVIEW** | **READY FOR OWNER-APPROVED PREVIEW** | **Sẵn sàng để Chủ dự án xem xét cấp phép Preview.** |

---

## II. ĐIỀU KIỆN TIÊN QUYẾT & HÀNG RÀO BẢO VỆ (GUARDRAILS)

1. **Tuyệt đối không tự ý deploy:**
   - Phiên làm việc này **CHỈ DỪNG Ở MỨC KIỂM THỬ LOCAL VÀ BÀN GIAO QA**.
   - Không thực hiện bất kỳ lệnh `vercel`, `vercel deploy`, hay thay đổi project settings trên Vercel.
2. **Quyền hạn cấp phép:**
   - Chỉ được phép triển khai một bản Vercel Preview DUY NHẤT sau khi có văn bản phê duyệt riêng từ **Chủ dự án** và chỉ thị điều phối từ **CEO**.
3. **Bắt buộc duy trì Deployment Protection:**
   - Khi tạo bản Preview, tính năng bảo vệ mật khẩu / Vercel Authentication của project phải được giữ ở trạng thái BẬT để ngăn chặn công chúng và crawler truy cập.
4. **Kiểm tra thiết lập Output Directory trên Vercel Dashboard:**
   - Do thiết lập trên Dashboard có độ ưu tiên cao hơn `vercel.json`, trước khi tạo Preview, Operator cần xác nhận mục "Output Directory" trong Dashboard không bị khóa cứng ở giá trị `dist`.

---

## III. KẾ HOẠCH VẬN HÀNH PREVIEW THỬ NGHIỆM (NẾU ĐƯỢC CẤP PHÉP)

Trong trường hợp Chủ dự án cấp phép triển khai thử nghiệm:

### 1. Lệnh triển khai Preview an toàn (Dành riêng cho Operator được ủy quyền)
```bash
# Triển khai bản xem trước cách ly hoàn toàn, không đụng tới Production:
npx vercel
```
*(Tuyệt đối không dùng cờ `--prod`)*.

### 2. Kế hoạch kiểm định độc lập của Claude QA trên URL Preview thật
Sau khi có URL Preview (ví dụ: `https://webchinhthuc-xxxx.vercel.app`), Claude QA sẽ thực hiện kiểm tra:
1. **HTTP 404 trên hosting thật:** Truy cập đường dẫn không tồn tại (ví dụ `/khong-ton-tai`), kiểm tra response trả về đúng mã trạng thái HTTP 404 (chứ không phải 200).
2. **Dynamic Rewrite:** Kiểm tra URL `/cau-chuyen/test-slug` và `/tai-khoan` trả về HTTP 200 và render giao diện SPA không crash.
3. **Header X-Robots-Tag:** Kiểm tra response header có chứa `X-Robots-Tag: noindex, nofollow`.
4. **Thẻ Meta Robots:** Kiểm tra thẻ `<meta name="robots" content="noindex, nofollow">` trên trang chủ và tất cả các route.
5. **Asset Caching:** Kiểm tra header `Cache-Control: public, max-age=31536000, immutable` cho các file trong `/assets/`.

---

## IV. QUY TRÌNH ROLLBACK CẤP TỐC (EMERGENCY ROLLBACK PLAN)

Nếu bản Preview thử nghiệm phát sinh lỗi bất ngờ:
1. **Hủy bản Preview trên Vercel:**
   ```bash
   npx vercel rm <DEPLOYMENT_URL_OR_ID> --yes
   ```
2. **Bảo toàn nhánh chính:**
   Do toàn bộ thay đổi nằm trọn vẹn trong nhánh `spike/architecture-01-hardening-02-fix01` và worktree riêng biệt, nhánh chính `main` và baseline 3A hoàn toàn không bị ảnh hưởng và không cần thực hiện bất kỳ thao tác rollback mã nguồn nào trên production.
