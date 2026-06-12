export function useNormalizarInstagram() {
  function normalizarInstagram(v) {
    const match = v.match(/instagram\.com\/([^/?#\s]+)/i);
    if (match) return '@' + match[1].replace(/\/$/, '');
    return v;
  }
  return { normalizarInstagram };
}
