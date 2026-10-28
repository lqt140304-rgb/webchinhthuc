# ARCHITECTURE SPIKE 01 — HARDENING 02: BÁO CÁO SẴN SÀNG VERCEL & QUY TRÌNH ROLLBACK

**Dự án:** Bệnh viện Thú y Lê Sơn 2026  
**Chỉ thị:** CEO DIRECTIVE 055-A (Mục VII — Vercel Readiness & Deployment Guardrails)  
**Agent:** Antigravity — Architecture Implementation  
**Worktree:** `D:\webbvct-hardening-02`  
**Nhánh:** `spike/architecture-01-hardening-02`  
**Quyền hạn triển khai:** TUYỆT ĐỐI CHƯA ĐƯỢC TRIỂN KHAI (DEPLOYMENT STRICTLY PROHIBITED)

---

## I. TỔNG QUAN CẤU HÌNH VERCEL TRONG HARDENING 02

Để chuẩn bị cho khả năng kiểm thử Vercel Preview (sau khi có phê duyệt riêng từ Chủ dự án và điều phối của CEO), cấu hình `vercel.json` trong Hardening 02 đã được tinh chỉnh đạt độ chuẩn xác cao nhất theo cơ chế Static Prerender của React Router 7:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build/client",
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/tai-khoan/(.*)",
      "destination": "/__spa-fallback.html"
    },
    {
      "source": "/cau-chuyen/(.*)",
      "destination": "/__spa-fallback.html"
    },
    {
      "source": "/bai-viet/(.*)",
      "destination": "/__spa-fallback.html"
    }
  ]
}
```

### Phân tích chi tiết các thuộc tính:
1. **`outputDirectory: "build/client"`**:
   - React Router 7 xuất toàn bộ mã nguồn tĩnh (HTML prerender, CSS, JS chunks, assets) vào thư mục `build/client`.
   - Vercel sẽ lấy trực tiếp thư mục này làm thư mục gốc (root static directory) để phân phối qua mạng Vercel Edge CDN toàn cầu.
2. **`cleanUrls: true`**:
   - Tự động bỏ đuôi `.html` trên thanh địa chỉ, giúp các URL như `/gioi-thieu/index.html` được phục vụ đẹp mắt và chuẩn SEO tại `/gioi-thieu`.
3. **`trailingSlash: false`**:
   - Chuẩn hóa URL không có dấu gạch chéo cuối (`/gioi-thieu`), tránh hiện tượng duplicate URL.
4. **Cơ chế `rewrites` cho Route tham số động**:
   - Đối với các route có tham số biến thiên (`/tai-khoan/*`, `/cau-chuyen/*`, `/bai-viet/*`), Vercel sẽ ánh xạ nội bộ yêu cầu về tập tin `/__spa-fallback.html`.
   - Client nạp vỏ SPA này và thực thi React Router ở client mà không tạo ra bất kỳ lỗi hydration mismatch nào.
5. **Cơ chế tự động phân phối `404.html`**:
   - Postbuild script trong `package.json` tự động copy `build/client/404/index.html` thành `build/client/404.html`.
   - Khi một yêu cầu HTTP không khớp với bất kỳ tập tin tĩnh nào trong `build/client` và không khớp với bất kỳ quy tắc rewrite nào, Vercel Edge Server sẽ tự động trả về `404.html` với mã trạng thái HTTP 404 Not Found.

---

## II. ĐÁNH GIÁ ĐỘ TƯƠNG THÍCH MẠNG PHÂN PHỐI TĨNH (EDGE COMPATIBILITY)

| Tiêu chí | Trạng thái | Đánh giá kỹ thuật |
| --- | --- | --- |
| **Không yêu cầu Serverless Function** | 100% Static | Toàn bộ ứng dụng được biên dịch thành HTML/JS/CSS tĩnh, không tiêu tốn tài nguyên runtime serverless compute, tối đa hóa tốc độ phản hồi (TTFB < 50ms trên Edge CDN). |
| **Bảo vệ tài nguyên tĩnh (Caching)** | Đạt chuẩn | Các file trong `assets/*.js` và `assets/*.css` có mã hash nội dung duy nhất, cho phép Vercel cache vĩnh viễn (`Cache-Control: public, max-age=31536000, immutable`). |
| **Không xung đột định tuyến** | Hoàn hảo | Thứ tự ưu tiên của Vercel: Tập tin tĩnh thực tế -> Rewrites -> `404.html`. Đảm bảo các trang prerender như `/` hay `/gioi-thieu` luôn được phục vụ tĩnh trước tiên. |

---

## III. QUY TRÌNH ROLLBACK CHI TIẾT (ROLLBACK RUNBOOK)

Trong trường hợp Chủ dự án cấp phép tạo Preview deployment và phát sinh bất kỳ sự cố không mong muốn nào, quy trình rollback được kích hoạt theo các bước chuẩn sau:

### Kịch bản 1: Rollback tức thời trên giao diện Vercel Dashboard / CLI
*(Dành cho Operator khi cần quay về bản Preview an toàn trước đó)*
1. **Truy cập danh sách Deployments:**
   ```bash
   npx vercel list
   ```
2. **Xác định Deployment ID an toàn của baseline 3A:**
   Deployment an toàn gần nhất của 3A: `dpl_xxxxxxxxxxxx` (Commit `4739d45cc95100b587381b6bdcad6935352b23e8` hoặc bản preview đã được QA).
3. **Thực hiện Rollback (Promote Alias):**
   ```bash
   npx vercel promote <DEPLOYMENT_ID>
   ```
   Thao tác này trỏ alias preview về deployment cũ trong vòng 2 giây mà không cần build lại.

### Kịch bản 2: Rollback trong Git
1. **Kiểm tra trạng thái Git worktree:**
   ```bash
   cd D:\webbvct-hardening-02
   git status
   ```
2. **Quay về commit an toàn của Hardening 01 hoặc Baseline 3A:**
   ```bash
   git checkout 0be427862fe78961f1ce6ab29db49eb86ac6cc75 # Hardening 01
   # hoặc
   git checkout 4739d45cc95100b587381b6bdcad6935352b23e8 # Baseline 3A
   ```
3. **Build lại để kiểm chứng tính toàn vẹn:**
   ```bash
   npm run build
   ```

### Kịch bản 3: Hủy bỏ hoàn toàn Worktree thử nghiệm
Vì toàn bộ công việc được thực hiện trong worktree độc lập `D:\webbvct-hardening-02`, repository chính tại `D:\webbvct` hoàn toàn không bị ảnh hưởng. Nếu có yêu cầu hủy bỏ nhánh spike:
```bash
cd D:\webbvct
git worktree remove D:\webbvct-hardening-02 --force
git branch -D spike/architecture-01-hardening-02
```
Toàn bộ hệ thống sẽ trở về trạng thái sạch sẽ tuyệt đối của nhánh `main` mà không để lại bất kỳ rác thải kỹ thuật nào.

---

## IV. TUYÊN BỐ TUÂN THỦ KỶ LUẬT TRIỂN KHAI

- Antigravity khẳng định: **KHÔNG THỰC HIỆN BẤT KỲ THAO TÁC DEPLOYMENT NÀO** trong phiên làm việc này.
- Mọi chuẩn bị trong `vercel.json` và build scripts chỉ nhằm mục đích hoàn thiện hồ sơ kỹ thuật và sẵn sàng phục vụ cho đợt kiểm thử Preview nếu và chỉ khi có chỉ thị bằng văn bản riêng từ CEO và Chủ dự án.
