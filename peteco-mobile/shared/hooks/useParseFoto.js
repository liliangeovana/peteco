export function useParseFoto() {
  function primeiraFoto(fotoUrl) {
    if (!fotoUrl) return null;
    if (fotoUrl.startsWith('[')) {
      try {
        const a = JSON.parse(fotoUrl);
        return Array.isArray(a) && a.length > 0 ? a[0] : null;
      } catch { return null; }
    }
    return fotoUrl;
  }
  return { primeiraFoto };
}
