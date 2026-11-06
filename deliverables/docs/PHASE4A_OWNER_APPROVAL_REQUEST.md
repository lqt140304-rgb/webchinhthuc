# PHIẾU TRÌNH DUYỆT CHỦ DỰ ÁN — NGHIỆM THU PHASE 4A & MỞ PHASE 4B
**Dự án:** Hệ thống Quản trị & Đặt lịch Bệnh viện Thú y Lê Sơn  
**Repository:** `lqt140304-rgb/webchinhthuc`  
**Đơn vị đề xuất:** Antigravity (Senior Product Designer & System Architect)  
**Đơn vị điều phối:** ChatGPT (CEO Điều phối Dự án)  
**Thẩm quyền phê duyệt:** Chủ dự án (Project Owner)  
**Ngày lập phiếu:** 06/11/2026  
**Mã phiếu:** `LESON-GATE-4A-20261106-V1`

---

## I. MỤC ĐÍCH TRÌNH DUYỆT

Phiếu này được thiết lập nhằm tách bạch rõ ràng 3 thẩm quyền độc lập theo đúng quy chế quản trị dự án:
- **(a) Nghiệm thu tài liệu thiết kế Phase 4A.**
- **(b) Cho phép bắt đầu viết mã Phase 4B trên môi trường cục bộ (Local Docker Sandbox - \$0.00) với dữ liệu giả lập.**
- **(c) Tái khẳng định mọi khoản chi phí ngân sách và phạm vi triển khai Production đều bắt buộc phải có văn bản xin phép riêng biệt.**

---

## II. NỘI DUNG TRÌNH DUYỆT TÁCH BẠCH

### PHẦN A: NGHIỆM THU TÀI LIỆU THIẾT KẾ KIẾN TRÚC PHASE 4A

Kính trình Chủ dự án xem xét và ký duyệt nghiệm thu bộ hồ sơ thiết kế kiến trúc Phase 4A v1.6.9:

1. **Hồ Sơ Kiến Trúc Hoàn Thiện:**
   - Tài liệu thiết kế kiến trúc: [PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md](file:///D:/webbvct/docs/architecture/PHASE_4A_SYSTEM_ARCHITECTURE_DESIGN.md) (3.412 dòng, 39 bảng CSDL, 46 RPCs nghiệp vụ + 4 RPCs BYOD, ranh giới schema `app.*` riêng tư).
   - Sổ đăng ký quyết định chuẩn hóa: [OWNER_DECISION_REGISTER.md](file:///D:/webbvct/docs/architecture/OWNER_DECISION_REGISTER.md) (bộ mã D-01 đến D-21 có ngày, nguồn xác nhận và bảng ánh xạ lịch sử mã).
   - Báo cáo tổng kết: [PHASE4A_FINAL_OWNER_REVIEW.md](file:///D:/webbvct/docs/architecture/PHASE4A_FINAL_OWNER_REVIEW.md).
2. **Xác Nhận Các Bất Biến Kỹ Thuật Cốt Lõi:**
   - **P1-C:** Triệt tiêu `ON DELETE CASCADE` trên dữ liệu lâm sàng/khách hàng, áp dụng `ON DELETE RESTRICT`.
   - **P1-D:** Schema `app.*` được cô lập tuyệt đối khỏi PostgREST API (trả về HTTP 404); truy cập qua RPC wrapper tại `public.*`.
   - **P1-E / D-PHONE:** Cho phép nhiều khách hàng dùng chung số điện thoại; CSDL cấm đặt chỉ mục UNIQUE trên cột `phone_number`.
   - **D-07:** Nguyên tắc Bốn Mắt (Two-Man Rule) cứng trong CSDL: `approved_by <> created_by`.
   - **D-12 / D-06-INVOICE / V-5:** Khách hàng chỉ xem bản tin chẩn đoán đã duyệt (`published`); ẩn tuyệt đối thuốc, liều lượng, y lệnh nội bộ trên portal và hóa đơn.
   - **D-14:** Thiết kế 1 VPS cách ly Container parser (`APPROVED — DESIGN ONLY`), chưa thuê máy chủ.
   - **D-19:** 10 quy tắc Lazy Customer Profile Creation.
   - **D-20:** Mô hình bảo mật BYOD 4 tầng (ưu tiên `getUserMedia()` trong RAM, khử EXIF Sharp/FFmpeg, 4 RPCs trust, remote wipe giới hạn).

```
[  ] PHÊ DUYỆT NGHIỆM THU TÀI LIỆU THIẾT KẾ PHASE 4A
[  ] YÊU CẦU CHỈNH SỬA THÊM (Ghi rõ nội dung bên dưới)
```
*Ý kiến Chủ dự án (nếu có):* ....................................................................................................

---

### PHẦN B: CHO PHÉP BẮT ĐẦU CODE PHASE 4B TRÊN LOCAL DOCKER SANDBOX (\$0.00)

Kính trình Chủ dự án cho phép đội ngũ kỹ thuật bắt đầu triển khai mã nguồn Phase 4B theo đúng [PHASE4B_IMPLEMENTATION_PLAN.md](file:///D:/webbvct/docs/architecture/PHASE4B_IMPLEMENTATION_PLAN.md):

1. **Phạm Vi Thực Hiện:**
   - Khởi tạo môi trường Supabase Local CLI bằng Docker trên máy phát triển nội bộ.
   - Viết các tệp migration SQL tạo 39 bảng, RLS policies, audit logging, và 51 RPCs backend cốt lõi.
   - Viết bộ mã kiểm thử tự động (Vitest / pgTAP) nhằm chuyển đổi toàn bộ 92 kịch bản kiểm thử (`SEC-01` đến `SEC-60`, `IMP-01` đến `IMP-32`) từ trạng thái `DESIGNED — NOT TESTED` sang `RUNTIME PASS`.
2. **Cam Kết Kỷ Luật Thực Hiện:**
   - **Chi phí phát sinh: \$0.00 (Không đồng).**
   - **Dữ liệu 100% nhân tạo (Synthetic Mock Data):** Tuyệt đối không dùng dữ liệu khách hàng hoặc bệnh án thật.
   - Các lệnh dọn dẹp như `supabase db reset` chỉ được phép chạy trên disposable test sandbox có kiểm tra cờ môi trường `APP_ENV=local_test`.
   - Tuyệt đối không để lộ thông tin bí mật (secrets, keys) vào Git repository hoặc log.

```
[  ] PHÊ DUYỆT CHO PHÉP BẮT ĐẦU CODE PHASE 4B TRÊN LOCAL SANDBOX ($0.00)
[  ] CHƯA CHO PHÉP CODE (Tạm dừng chờ chỉ đạo tiếp theo)
```
*Ý kiến Chủ dự án (nếu có):* ....................................................................................................

---

### PHẦN C: CAM KẾT TÀI CHÍNH & PHẠM VI PRODUCTION BẮT BUỘC PHÊ DUYỆT RIÊNG

Kính trình Chủ dự án ghi nhận cam kết ranh giới của đội ngũ kỹ thuật:

1. **Không Chi Tiêu Ngân Sách:**
   - Không tự ý mua gói Supabase Pro (\$25/tháng) hay PITR (\$100/tháng).
   - Không tự ý thuê VPS (\$5.00/tháng) của Hetzner hay DigitalOcean.
   - Không tự ý mua gói Vercel Pro (\$20/tháng) hay add-on trả phí của Cloudflare.
   - Không tự ý nạp tiền dịch vụ SMS OTP / Zalo ZNS.
2. **Không Triển Khai Production:**
   - Không tạo project Supabase Cloud Production.
   - Không trỏ domain chính thức (`webbvct.com` hoặc tương đương).
   - Khi Phase 4B hoàn tất và đạt 100% `RUNTIME PASS` trên local sandbox, nếu muốn triển khai lên môi trường thử nghiệm Cloud hoặc Production Staging, đội ngũ bắt buộc phải lập **Tờ Trình Phê Duyệt Ngân Sách & Môi Trường Riêng Biệt** để Chủ dự án ký duyệt trước khi phát sinh bất kỳ khoản thanh toán nào.

```
[  ] XÁC NHẬN CAM KẾT: MỌI KHOẢN CHI & TRIỂN KHAI PRODUCTION PHẢI XIN PHÉP RIÊNG
```

---

## III. Ý KIẾN CHỦ DỰ ÁN ĐỐI VỚI 2 NỘI DUNG ĐANG CHỜ (PENDING)

Kính đề nghị Chủ dự án tích chọn định hướng đối với 2 nội dung đang chờ:

### 1. Chính Sách Sao Lưu & PITR (`D-03`)
```
[  ] Đồng ý đề xuất kỹ thuật: Duy trì sao lưu định kỳ hàng ngày lên Cloudflare R2 ($0 phụ phí, RPO đề xuất <= 24h), chưa mua gói PITR ($100/tháng) -> Chuyển D-03 sang APPROVED.
[  ] Tiếp tục giữ trạng thái PENDING — NOT DECIDED để đánh giá thêm.
```

### 2. Xác Minh Đơn Vị Hành Chính Địa Chỉ Cơ Sở (`D-18`)
*Địa chỉ: 101 Khuất Duy Tiến, Quận Thanh Xuân, Hà Nội.*
```
[  ] Xác nhận Phường Nhân Chính (Căn cứ theo Giấy phép ĐKKD / CCHN Thú y).
[  ] Xác nhận Phường Thanh Xuân Bắc.
[  ] Tiếp tục giữ PENDING VERIFICATION chờ kiểm tra giấy phép bản cứng.
```

---

## IV. XÁC NHẬN CỦA CÁC BÊN

| Đại Diện Antigravity (Thiết kế & Kỹ thuật) | Đại Diện ChatGPT (CEO Điều phối) | CHỦ DỰ ÁN (PROJECT OWNER) |
| :---: | :---: | :---: |
| *(Đã ký điện tử)* | *(Đã rà soát chấp thuận)* | *(Ký và ghi rõ họ tên)* |
| **Antigravity** | **ChatGPT CEO** | ..................................................... |
| Ngày: 06/11/2026 | Ngày: 06/11/2026 | Ngày: ...... / ...... / 2026 |
