// Fonte: OpenStreetMap Overpass API — bairros de Boa Vista/RR
export const BAIRROS_BOA_VISTA = [
  { nome: '5 de Outubro',                    lat: 2.8563, lng: -60.6330 },
  { nome: '13 de Setembro',                  lat: 2.7984, lng: -60.6830 },
  { nome: '31 de Março',                     lat: 2.8383, lng: -60.6708 },
  { nome: 'Aeroporto',                       lat: 2.8412, lng: -60.7081 },
  { nome: 'Alvorada',                        lat: 2.8194, lng: -60.7518 },
  { nome: 'Asa Branca',                      lat: 2.8134, lng: -60.7214 },
  { nome: 'Bairro dos Estados',              lat: 2.8456, lng: -60.6701 },
  { nome: 'Bela Vista',                      lat: 2.7709, lng: -60.7238 },
  { nome: 'Buritis',                         lat: 2.8150, lng: -60.7091 },
  { nome: 'Caçari',                          lat: 2.8499, lng: -60.6515 },
  { nome: 'Caimbé',                          lat: 2.8227, lng: -60.7168 },
  { nome: 'Calungá',                         lat: 2.8054, lng: -60.6765 },
  { nome: 'Cambará',                         lat: 2.8136, lng: -60.7310 },
  { nome: 'Canarinho',                       lat: 2.8345, lng: -60.6582 },
  { nome: 'Caranã',                          lat: 2.8397, lng: -60.7217 },
  { nome: 'Cauamé',                          lat: 2.8485, lng: -60.7121 },
  { nome: 'Centenário',                      lat: 2.7961, lng: -60.7125 },
  { nome: 'Centro',                          lat: 2.8196, lng: -60.6712 },
  { nome: 'Cidade Satélite',                 lat: 2.8444, lng: -60.7465 },
  { nome: 'Cinturão Verde',                  lat: 2.8039, lng: -60.7088 },
  { nome: 'Distrito Industrial',             lat: 2.7688, lng: -60.7119 },
  { nome: 'Dr. Airton Rocha',                lat: 2.7674, lng: -60.7572 },
  { nome: 'Dr. Silvio Leite',                lat: 2.8215, lng: -60.7416 },
  { nome: 'Equatorial',                      lat: 2.8184, lng: -60.7665 },
  { nome: 'Jardim Caranã',                   lat: 2.8523, lng: -60.7233 },
  { nome: 'Jardim Floresta',                 lat: 2.8302, lng: -60.7101 },
  { nome: 'Jardim Primavera',                lat: 2.8246, lng: -60.7345 },
  { nome: 'Jardim Tropical',                 lat: 2.7947, lng: -60.7335 },
  { nome: 'João de Barro',                   lat: 2.8629, lng: -60.7801 },
  { nome: 'Jóquei Clube',                    lat: 2.8046, lng: -60.7264 },
  { nome: 'Laura Moreira',                   lat: 2.8005, lng: -60.7872 },
  { nome: 'Liberdade',                       lat: 2.8192, lng: -60.7006 },
  { nome: 'Marechal Rondon',                 lat: 2.7920, lng: -60.6938 },
  { nome: 'Mecejana',                        lat: 2.8244, lng: -60.6876 },
  { nome: 'Monte Cristo',                    lat: 2.8756, lng: -60.7112 },
  { nome: 'Murilo Teixeira',                 lat: 2.8305, lng: -60.7662 },
  { nome: 'Nova Canaã',                      lat: 2.8150, lng: -60.7407 },
  { nome: 'Nova Cidade',                     lat: 2.7650, lng: -60.7308 },
  { nome: 'Nossa Senhora Aparecida',         lat: 2.8379, lng: -60.6655 },
  { nome: 'Olímpico',                        lat: 2.8022, lng: -60.7347 },
  { nome: 'Operário',                        lat: 2.7787, lng: -60.7455 },
  { nome: 'Paraviana',                       lat: 2.8566, lng: -60.6591 },
  { nome: 'Pedra Pintada',                   lat: 2.8823, lng: -60.6866 },
  { nome: 'Pintolândia',                     lat: 2.8067, lng: -60.7485 },
  { nome: 'Piscicultura',                    lat: 2.8351, lng: -60.7357 },
  { nome: 'Pricumã',                         lat: 2.8102, lng: -60.6977 },
  { nome: 'Profª. Aracelis Souto Maior',     lat: 2.7875, lng: -60.7243 },
  { nome: 'Raiar do Sol',                    lat: 2.7742, lng: -60.7193 },
  { nome: 'Said Salomão',                    lat: 2.8875, lng: -60.6905 },
  { nome: 'Santa Luzia',                     lat: 2.8077, lng: -60.7547 },
  { nome: 'Santa Tereza',                    lat: 2.8276, lng: -60.7306 },
  { nome: 'São Bento',                       lat: 2.7816, lng: -60.7151 },
  { nome: 'São Francisco',                   lat: 2.8316, lng: -60.6755 },
  { nome: 'São Pedro',                       lat: 2.8270, lng: -60.6637 },
  { nome: 'São Vicente',                     lat: 2.8104, lng: -60.6829 },
  { nome: 'Senador Hélio Campos',            lat: 2.7928, lng: -60.7534 },
  { nome: 'Silvio Botelho',                  lat: 2.8013, lng: -60.7424 },
  { nome: 'Tancredo Neves',                  lat: 2.8232, lng: -60.7252 },
  { nome: 'União',                           lat: 2.8455, lng: -60.7293 },
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
