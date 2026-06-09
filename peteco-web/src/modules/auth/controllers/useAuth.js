import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../../../client/http.js'

const STORAGE_KEY = 'peteco_usuario'

/** @type {import('vue').Ref<import('../models/Usuario.js').Usuario | null>} */
const usuario = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'))

export function useAuth() {
  const router = useRouter()

  async function verificarSessao() {
    try {
      const { data } = await http.get('/auth/me')
      usuario.value = data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Mantém dados em cache se API indisponível — não desloga o usuário
    }
  }

  async function login(email, senha) {
    const { data } = await http.post('/auth/login', { email, senha })
    usuario.value = data.usuario
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.usuario))
    router.push('/feed')
  }

  async function logout() {
    try { await http.post('/auth/logout') } catch { /* ignora */ }
    usuario.value = null
    localStorage.removeItem(STORAGE_KEY)
    router.push('/login')
  }

  return { usuario, login, logout, verificarSessao }
}
