import { ref } from 'vue'
import { http } from '../../../client/http.js'

export function useAnalise() {
  /** @type {import('vue').Ref<import('../models/Estatisticas.js').Estatisticas | null>} */
  const stats   = ref(null)
  const loading = ref(false)
  const erro    = ref(false)

  async function buscar() {
    loading.value = true
    erro.value = false
    try {
      const { data } = await http.get('/analise/estatisticas')
      stats.value = data
    } catch {
      erro.value = true
    } finally {
      loading.value = false
    }
  }

  return { stats, loading, erro, buscar }
}
