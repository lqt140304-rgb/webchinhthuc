/**
 * Navigation Active State & Boundary Matching Helpers
 * Sourced from Claude QA Retest-01 specifications (P1-3)
 */

/**
 * Kiểm tra xem một link cụ thể (trong menu hoặc dropdown) có phải là trang hiện tại hay không.
 * - Hỗ trợ phân biệt route có query (ví dụ: ?cat=news) với route gốc (không có query)
 * - Khớp chính xác theo ranh giới URL, tránh gán nhầm nhiều mục cùng là trang hiện tại
 */
export function isLinkActive(href: string, currentPath: string, currentSearch: string): boolean {
  if (href === '/') {
    return currentPath === '/'
  }

  // Nếu link có tham số truy vấn (e.g. /goc-thu-cung?cat=news)
  if (href.includes('?')) {
    return (currentPath + currentSearch) === href
  }

  // Nếu URL hiện tại có tham số truy vấn nhưng link không có tham số, không coi là khớp
  if (currentSearch && currentSearch !== '?') {
    return false
  }

  // So khớp chính xác đường dẫn cho link trang đơn
  return currentPath === href
}

/**
 * Kiểm tra xem nhóm điều hướng (button dropdown) có chứa route hiện tại hay không.
 * - So khớp theo ranh giới: base hoặc base + '/'
 * - Tránh trường hợp 404 có tiền tố tương tự (ví dụ: /dich-vu-khong-ton-tai không làm nhóm /dich-vu sáng)
 */
export function isGroupActive(matchPrefixes: string[], currentPath: string): boolean {
  return matchPrefixes.some((base) => {
    return currentPath === base || currentPath.startsWith(base + '/')
  })
}
