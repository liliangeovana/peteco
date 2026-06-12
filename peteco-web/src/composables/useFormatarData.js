export function useFormatarData() {
  function formatarData(d) {
    if (!d) return '—'
    const dt = new Date(d)
    return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('pt-BR')
  }
  return { formatarData }
}
