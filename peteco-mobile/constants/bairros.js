export const BAIRROS_BOA_VISTA = [
  { nome: 'Aeroporto',            lat: -2.8478, lng: -60.6882 },
  { nome: 'Alvorada',             lat: -2.8695, lng: -60.6510 },
  { nome: 'Asa Branca',           lat: -2.8590, lng: -60.6790 },
  { nome: 'Bairro das Flores',    lat: -2.8545, lng: -60.6655 },
  { nome: 'Buritis',              lat: -2.8510, lng: -60.7090 },
  { nome: 'Caçari',               lat: -2.8010, lng: -60.6660 },
  { nome: 'Calungá',              lat: -2.8450, lng: -60.7060 },
  { nome: 'Canarinho',            lat: -2.8375, lng: -60.6815 },
  { nome: 'Cauamé',               lat: -2.7810, lng: -60.7190 },
  { nome: 'Centro',               lat: -2.8235, lng: -60.6730 },
  { nome: 'Cidade Satélite',      lat: -2.8350, lng: -60.6455 },
  { nome: 'Dr. Silvio Leite',     lat: -2.8105, lng: -60.7050 },
  { nome: 'Equatorial',           lat: -2.8155, lng: -60.7005 },
  { nome: 'Jardim Caranã',        lat: -2.7710, lng: -60.6905 },
  { nome: 'Jardim Floresta',      lat: -2.7610, lng: -60.7095 },
  { nome: 'Jardim Primavera',     lat: -2.7855, lng: -60.6510 },
  { nome: 'Jóquei Clube',         lat: -2.8750, lng: -60.7005 },
  { nome: 'Liberdade',            lat: -2.8400, lng: -60.6905 },
  { nome: 'Mecejana',             lat: -2.7955, lng: -60.7095 },
  { nome: 'Nazaré',               lat: -2.8250, lng: -60.6900 },
  { nome: 'Nova Canaã',           lat: -2.8800, lng: -60.6600 },
  { nome: 'Nova Cidade',          lat: -2.8005, lng: -60.6405 },
  { nome: 'Olímpico',             lat: -2.8100, lng: -60.6850 },
  { nome: 'Paraviana',            lat: -2.8100, lng: -60.6510 },
  { nome: 'Pintolândia',          lat: -2.8205, lng: -60.6405 },
  { nome: 'Pricumã',              lat: -2.7805, lng: -60.6610 },
  { nome: 'Promaville',           lat: -2.7705, lng: -60.7005 },
  { nome: 'Raiar do Sol',         lat: -2.8900, lng: -60.6700 },
  { nome: 'Santa Tereza',         lat: -2.8305, lng: -60.7195 },
  { nome: 'São Bento',            lat: -2.8650, lng: -60.7100 },
  { nome: 'São Francisco',        lat: -2.8300, lng: -60.6800 },
  { nome: 'São Vicente',          lat: -2.8450, lng: -60.6610 },
  { nome: 'Senador Hélio Campos', lat: -2.8700, lng: -60.6705 },
  { nome: 'Silvio Botelho',       lat: -2.7905, lng: -60.6805 },
  { nome: 'Tancredo Neves',       lat: -2.8605, lng: -60.6905 },
  { nome: 'União',                lat: -2.8550, lng: -60.7005 },
  { nome: '13 de Setembro',       lat: -2.8480, lng: -60.6750 },
];

export const OPCAO_OUTRO = 'Outro';

export function bairroMaisProximo(lat, lng) {
  let menor = Infinity;
  let melhor = BAIRROS_BOA_VISTA[0];
  for (const b of BAIRROS_BOA_VISTA) {
    const d = (lat - b.lat) ** 2 + (lng - b.lng) ** 2;
    if (d < menor) { menor = d; melhor = b; }
  }
  return melhor;
}
