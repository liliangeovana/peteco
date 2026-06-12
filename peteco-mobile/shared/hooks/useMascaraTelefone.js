export function useMascaraTelefone() {
  function mascaraTelefone(v) {
    const n = String(v).replace(/\D/g, '').slice(0, 11);
    if (n.length <= 2) return n;
    if (n.length <= 7) return `${n.slice(0, 2)} ${n.slice(2)}`;
    return `${n.slice(0, 2)} ${n.slice(2, 7)}-${n.slice(7)}`;
  }
  return { mascaraTelefone };
}
