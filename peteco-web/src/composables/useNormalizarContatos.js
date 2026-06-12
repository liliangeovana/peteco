export function useNormalizarContatos() {
  function parseContatos(raw) {
    try { const a = JSON.parse(raw || '[]'); return Array.isArray(a) ? a.filter(c => c.valor) : [] }
    catch { return [] }
  }
  function normalizarInstagram(v) {
    const match = v.match(/instagram\.com\/([^/?#\s]+)/i)
    if (match) return '@' + match[1].replace(/\/$/, '')
    return v
  }
  function mascaraTelefone(v) {
    const n = String(v).replace(/\D/g, '').slice(0, 11)
    if (n.length <= 2) return n
    if (n.length <= 7) return `${n.slice(0,2)} ${n.slice(2)}`
    return `${n.slice(0,2)} ${n.slice(2,7)}-${n.slice(7)}`
  }
  function formatarContato(c) {
    return c.tipo === 'whatsapp' ? mascaraTelefone(c.valor) : c.valor
  }
  return { parseContatos, normalizarInstagram, formatarContato }
}
