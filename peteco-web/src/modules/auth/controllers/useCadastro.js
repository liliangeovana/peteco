import { http } from '../../../client/http.js'

export function useCadastro() {
  /**
   * @param {{ nome: string, email: string, senha: string }} dados
   */
  async function cadastrar(dados) {
    await http.post('/auth/cadastro', dados)
  }

  return { cadastrar }
}
