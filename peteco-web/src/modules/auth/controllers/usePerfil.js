import { http } from '../../../client/http.js'
import { useAuth } from './useAuth.js'

export function usePerfil() {
  const { verificarSessao } = useAuth()

  /**
   * @param {{ nome?: string, telefone?: string, bairro?: string, senha?: string }} dados
   */
  async function atualizarPerfil(dados) {
    await http.patch('/auth/perfil', dados)
    await verificarSessao()
  }

  return { atualizarPerfil }
}
