export function useFormatarData() {
  function isoParaPtBR(iso) {
    if (!iso) return '—';
    const dt = new Date(iso);
    return isNaN(dt.getTime()) ? iso : dt.toLocaleDateString('pt-BR');
  }
  return { isoParaPtBR };
}
