/**
 * @typedef {{
 *   id:         number,
 *   nome:       string,
 *   especie:    'cachorro' | 'gato' | 'outro',
 *   raca?:      string,
 *   status:     'perdido' | 'encontrado',
 *   foto_url?:  string,
 *   lat?:       number,
 *   lng?:       number,
 *   bairro?:    string,
 *   cidade?:    string,
 *   data_perda?: string,
 * }} Pet
 *
 * @typedef {{
 *   nome?:    string,
 *   especie?: string,
 *   cidade?:  string,
 *   status?:  string,
 * }} PetFiltros
 */

/** @returns {Pet} */
export const petDefault = () => ({
  id: null,
  nome: '',
  especie: 'cachorro',
  raca: '',
  status: 'perdido',
  foto_url: null,
  lat: null,
  lng: null,
  bairro: '',
  cidade: '',
  data_perda: null,
})
