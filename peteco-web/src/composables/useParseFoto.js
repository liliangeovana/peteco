export function useParseFoto() {
  function parsePrimeiraFoto(url) {
    if (!url) return null
    if (url.startsWith('[')) {
      try { const a = JSON.parse(url); return a[0] ?? null }
      catch { return null }
    }
    return url
  }
  function parseTodasFotos(url) {
    if (!url) return []
    if (url.startsWith('[')) {
      try { const a = JSON.parse(url); return Array.isArray(a) ? a.filter(Boolean) : [] }
      catch { return [] }
    }
    return [url]
  }
  return { parsePrimeiraFoto, parseTodasFotos }
}
