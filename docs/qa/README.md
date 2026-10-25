# Hồ sơ QA mốc 2A

## Quy trình hiện hành

Đọc [hướng dẫn E2E và retest cho Claude/Anti](2a-e2e-protocol.md). Anti ghi kết quả sửa vào `docs/qa/2a-fix-handoff.md`, ảnh tại `docs/qa/2a-fix-evidence/`. Claude chạy lại độc lập đúng SHA mới và tạo `docs/qa/2a-retest-01.md`, ảnh tại `docs/qa/2a-retest-01-evidence/`. Đây là các đầu ra cần tạo sau khi chạy, không phải kết quả đã có. Giữ nguyên báo cáo cũ; lần retest tiếp theo tăng số thứ tự.

## Hồ sơ gốc

- [Báo cáo Claude lần 3](bao-cao-kiem-tra-2A.md): bản gốc do người dùng cung cấp, giữ nguyên nội dung; SHA được review là `c2e5361defb0d151bf14c8153a341072060c2e42`.
- Ngày kiểm tra do báo cáo ghi: 25/10/2026. Ngày đưa vào repo: 26/10/2026.
- Các đường dẫn scratchpad và script trong báo cáo thuộc môi trường Claude. Repo chỉ nhận được báo cáo và ba ảnh bên dưới; chưa nhận `qa-result.json`, `qa.js`, `qa2.js` hoặc các ảnh khác. Không coi chúng là tệp có sẵn trong repo.
- Kết quả kiểm thử là do Claude báo cáo, không phải một lần kiểm thử mới của ChatGPT.

## Ảnh gốc người dùng cung cấp

### Header 320px — P1-1

![Nút Menu nằm ngoài vùng nhìn thấy ở 320px](2a-evidence/header-320.png)

### Drawer 768px — P1-2

![Drawer rộng bất thường ở 768px](2a-evidence/drawer-open-768.png)

### ComingSoon 1440px — P1-2

![Khung nội dung ComingSoon quá rộng](2a-evidence/coming-soon-1440.png)

Đây là ảnh trước sửa. Ảnh sau sửa cần lưu riêng, kèm SHA và viewport thực tế. Không ghi đè bằng chứng gốc.
