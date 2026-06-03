import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../../../client/http.js'

/** @type {import('vue').Ref<import('../models/Usuario.js').Usuario | null>} */
const usuario = ref(null)

export function useAuth() {
  const router = useRouter()

  async function verificarSessao() {
    try {
      const { data } = await http.get('/auth/me')
      usuario.value = data
    } catch {
      usuario.value = null
    }
  }

  async function login(email, senha) {
    await http.post('/auth/login', { email, senha })
    await verificarSessao()
    router.push('/')
  }

  async function logout() {
    try { await http.post('/auth/logout') } catch { /* ignora */ }
    usuario.value = null
    router.push('/login')
  }

  return { usuario, login, logout, verificarSessao }
}
