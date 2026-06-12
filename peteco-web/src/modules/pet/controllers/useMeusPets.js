import { ref, onMounted } from 'vue'
import { http } from '../../../client/http.js'
import { useAuth } from '../../auth/controllers/useAuth.js'

export function useMeusPets() {
  const { usuario } = useAuth()
  const pets        = ref([])
  const loading     = ref(true)
  const filtro      = ref('todos')

  async function carregar() {
    loading.value = true
    try {
      const { data } = await http.get('/pets', { params: { usuario_id: usuario.value?.id } })
      pets.value = data
    } catch {
      pets.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(carregar)

  const petsFiltrados = () => filtro.value === 'todos'
    ? pets.value
    : pets.value.filter(p => p.status === filtro.value)

  const stats = () => ({
    total:       pets.value.length,
    perdidos:    pets.value.filter(p => p.status === 'perdido').length,
    encontrados: pets.value.filter(p => p.status === 'encontrado').length,
  })

  return { pets, petsFiltrados, loading, filtro, stats, carregar }
}
