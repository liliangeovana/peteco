import { ref } from 'vue'
import { http } from '../../../client/http.js'

export function useClusters() {
  /** @type {import('vue').Ref<import('../models/Cluster.js').ResultadoClusters | null>} */
  const dados   = ref(null)
  const loading = ref(false)
  const erro    = ref(false)

  async function buscar() {
    loading.value = true
    erro.value = false
    try {
      const { data } = await http.get('/analise/clusters')
      dados.value = data
    } catch {
      erro.value = true
    } finally {
      loading.value = false
    }
  }

  return { dados, loading, erro, buscar }
}
