const BRASIL_API = 'https://brasilapi.com.br/api/cep/v2';
const VIA_CEP    = 'https://viacep.com.br/ws';

export async function buscarCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) throw new Error('CEP inválido — precisa ter 8 dígitos.');

  try {
    const res = await fetch(`${BRASIL_API}/${cepLimpo}`);
    if (res.ok) {
      const d = await res.json();
      return {
        cep:       d.cep,
        bairro:    d.neighborhood ?? '',
        cidade:    d.city         ?? '',
        uf:        d.state        ?? '',
        latitude:  d.location?.coordinates?.latitude  ?? null,
        longitude: d.location?.coordinates?.longitude ?? null,
      };
    }
  } catch (_) { /* fallback */ }

  const res = await fetch(`${VIA_CEP}/${cepLimpo}/json/`);
  if (!res.ok) throw new Error('CEP não encontrado.');
  const d = await res.json();
  if (d.erro) throw new Error('CEP não encontrado.');

  return {
    cep:       d.cep,
    bairro:    d.bairro     ?? '',
    cidade:    d.localidade ?? '',
    uf:        d.uf         ?? '',
    latitude:  null,
    longitude: null,
  };
}
