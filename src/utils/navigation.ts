/**
 * Navigation Active State & Boundary Matching Helpers
 * Sourced from Claude QA Retest-01 & Retest-02 specifications (P1-3, R2-1, R2-2)
 */

/**
 * Chuẩn hóa pathname: loại bỏ dấu '/' ở cuối (ngoại trừ root '/')
 */
export function normalizePath(path: string): string {
  if (!path || path === '/') return '/'
  return path.replace(/\/+$/, '')
}

/**
 * Kiểm tra xem một link cụ thể (trong menu hoặc dropdown) có phải là trang hiện tại hay không.
 * - Hỗ trợ chuẩn hóa dấu '/' ở cuối (ví dụ: /dich-vu/spa/ khớp với /dich-vu/spa)
 * - Hỗ trợ bỏ qua các tham số theo dõi không liên quan (UTM, fbclid...)
 * - Phân biệt chính xác route có query chuyên biệt (?cat=news) với route gốc (/goc-thu-cung)
 */
export function isLinkActive(href: string, currentPath: string, currentSearch = ''): boolean {
  const [rawHrefPath, rawHrefSearch] = href.split('?')
  const targetPath = normalizePath(rawHrefPath)
  const normCurrentPath = normalizePath(currentPath)

  // Nếu pathname không khớp -> không phải trang này
  if (targetPath !== normCurrentPath) {
    return false
  }

  // Nếu link mục tiêu có query param chuyên biệt (e.g. /goc-thu-cung?cat=news)
  if (rawHrefSearch) {
    const targetParams = new URLSearchParams(rawHrefSearch)
    const currentParams = new URLSearchParams(currentSearch)
    for (const [key, value] of targetParams.entries()) {
      if (currentParams.get(key) !== value) {
        return false
      }
    }
    return true
  }

  // Nếu link mục tiêu KHÔNG có query param (e.g. /goc-thu-cung):
  // Nếu current URL có query param chuyên biệt của sub-link (ví dụ ?cat=news), không đánh dấu link gốc
  if (normCurrentPath === '/goc-thu-cung') {
    const currentParams = new URLSearchParams(currentSearch)
    if (currentParams.get('cat') === 'news') {
      return false
    }
  }

  // Các query thông thường khác (như utm_source, utm_medium, fbclid...) được bỏ qua
  return true
}

/**
 * Kiểm tra xem nhóm điều hướng (button dropdown hoặc link nhóm) có chứa route hiện tại hay không.
 * - Chuẩn hóa dấu '/' ở cuối
 * - So khớp theo ranh giới: base hoặc base + '/'
 * - Tránh trường hợp 404 có tiền tố tương tự (ví dụ: /dich-vu-khong-ton-tai không làm nhóm /dich-vu sáng)
 */
export function isGroupActive(matchPrefixes: string[], currentPath: string): boolean {
  const normCurrent = normalizePath(currentPath)
  return matchPrefixes.some((base) => {
    const normBase = normalizePath(base)
    return normCurrent === normBase || normCurrent.startsWith(normBase + '/')
  })
}
