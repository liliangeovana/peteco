import { ref } from 'vue'
import { http } from '../../../client/http.js'

export function usePets({ bairroUsuario = '' } = {}) {
  /** @type {import('vue').Ref<import('../models/Pet.js').Pet[]>} */
  const pets    = ref([])
  const loading = ref(false)
  const erro    = ref(null)

  /**
   * @param {import('../models/Pet.js').PetFiltros} [filtros]
   */
  async function buscar(filtros = {}) {
    loading.value = true
    erro.value = null
    try {
      const params = new URLSearchParams()
      if (filtros.especie) params.append('especie', filtros.especie)
      if (filtros.cidade)  params.append('cidade',  filtros.cidade)
      if (filtros.status)  params.append('status',  filtros.status)

      const { data } = await http.get(`/pets?${params}`)
      let result = filtros.nome
        ? data.filter(p => p.nome?.toLowerCase().includes(filtros.nome.toLowerCase()))
        : data

      if (bairroUsuario) {
        result = [...result].sort((a, b) => {
          const am = a.bairro === bairroUsuario ? 0 : 1
          const bm = b.bairro === bairroUsuario ? 0 : 1
          return am - bm
        })
      }

      pets.value = result
    } catch (e) {
      erro.value = e
      pets.value = []
    } finally {
      loading.value = false
    }
  }

  return { pets, loading, erro, buscar }
}
