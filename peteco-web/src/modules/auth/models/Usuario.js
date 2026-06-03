/**
 * @typedef {{
 *   id:        number,
 *   nome:      string,
 *   email:     string,
 *   telefone?: string,
 * }} Usuario
 */

/** @returns {Usuario} */
export const usuarioDefault = () => ({
  id: null,
  nome: '',
  email: '',
  telefone: '',
})
