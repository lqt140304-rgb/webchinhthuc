# Bộ kiểm thử Vercel Preview (Claude QA, Directive 013)

Mọi script đọc secret từ biến môi trường `VERCEL_AUTOMATION_BYPASS_SECRET`. Không truyền secret qua tham số, không in ra log hay báo cáo.

| Script | Mục đích | Lệnh |
|---|---|---|
| `verify-deploy-sha.sh` | Đối chiếu asset `/assets/*` trên Preview với build cục bộ của SHA dự kiến (`expected-assets-db78738.txt`) | `tests/vercel/verify-deploy-sha.sh https://<preview>` |
| `a05-headers.sh` | Ma trận 23 đường dẫn: HTTP status, `X-Robots-Tag`, `Content-Type`, `Location`, `x-vercel-id` | `tests/vercel/a05-headers.sh https://<preview> > a05.tsv` |
| `bypass-proxy.cjs` | Proxy cục bộ thêm header bypass, để chạy E2E và visual bằng `BASE_URL=http://127.0.0.1:4180` | `NODE_USE_ENV_PROXY=1 node tests/vercel/bypass-proxy.cjs https://<preview> 4180` |
| `../perf/lighthouse-2b.sh` | Lighthouse 3 lượt; `LH_EXTRA_HEADERS_FILE` trỏ tới file JSON header (đường dẫn tuyệt đối). Script tự xóa `extraHeaders` khỏi JSON kết quả | `LH_EXTRA_HEADERS_FILE=/abs/h.json RUNS=3 tests/perf/lighthouse-2b.sh https://<preview>/ out/` |

Lưu ý:

- Lighthouse phải đo **trực tiếp** host Vercel, không đi qua `bypass-proxy`.
- Dùng E2E qua proxy chỉ để kiểm tra chức năng. Các test canonical và header so với origin `127.0.0.1` cần đọc kèm kết quả `a05-headers.sh`.
- Kết quả không bypass ngày 27/10/2026: `docs/qa/2b-qa-08-evidence/a05-matrix-no-bypass-20261027.tsv`. Cả 23 đường dẫn đều trả 302 → `vercel.com/sso-api`, kèm `x-robots-tag: noindex` của lớp Vercel Authentication.
