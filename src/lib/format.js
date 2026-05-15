// Display helpers used across product cards and detail pages.

export function formatPrice(price) {
  if (price == null || price === '') return ''
  const trimmed = String(price).trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('$')) return trimmed
  // Don't double-prefix if a different currency symbol is already present
  if (/^[€£¥₹]/.test(trimmed)) return trimmed
  return `$${trimmed}`
}
