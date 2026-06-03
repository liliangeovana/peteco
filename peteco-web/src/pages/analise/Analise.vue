<script setup>
import { onMounted } from 'vue'
import { BarChart2, CheckCircle2, TrendingUp, AlertTriangle, Info } from 'lucide-vue-next'
import { useAnalise } from '../../modules/analise/controllers/useAnalise.js'

const { stats, loading, erro, buscar } = useAnalise()
onMounted(buscar)

const taxaRetorno = (perdidos, encontrados) => {
  const total = perdidos + encontrados
  return total > 0 ? Math.round((encontrados / total) * 100) : 0
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Análise de Dados</h2>
        <p class="text-sm font-semibold mt-1" style="color:#6B6578">Estatísticas consolidadas — B2G</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 text-neutral-400 font-semibold">Carregando dados...</div>
    <div v-else-if="erro" class="insight-critical">
      <AlertTriangle :size="18" class="flex-shrink-0" />
      <span>Serviço de estatísticas indisponível.</span>
    </div>

    <template v-else-if="stats">
      <!-- Resumo geral -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div class="stat-card">
          <div class="stat-card-icon bg-red-50">
            <AlertTriangle :size="20" style="color:#E63946" />
          </div>
          <span class="stat-number text-red-500">{{ stats.total_perdidos ?? 0 }}</span>
          <span class="stat-label">Pets perdidos</span>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-emerald-50">
            <CheckCircle2 :size="20" style="color:#2EBD7A" />
          </div>
          <span class="stat-number text-emerald-600">{{ stats.total_encontrados ?? 0 }}</span>
          <span class="stat-label">Pets encontrados</span>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon bg-brand-100">
            <TrendingUp :size="20" style="color:#7C3AED" />
          </div>
          <span class="stat-number text-brand-600">
            {{ taxaRetorno(stats.total_perdidos ?? 0, stats.total_encontrados ?? 0) }}%
          </span>
          <span class="stat-label">Taxa de retorno</span>
        </div>
      </div>

      <!-- Por espécie -->
      <div class="card mb-4">
        <h3 class="font-black text-neutral-900 mb-4 flex items-center gap-2">
          <BarChart2 :size="18" style="color:#7C3AED" />
          Distribuição por espécie
        </h3>
        <table class="table-peteco">
          <thead>
            <tr>
              <th>Espécie</th>
              <th>Total</th>
              <th>Participação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in (stats.por_especie ?? [])" :key="item.especie">
              <td class="font-semibold capitalize">{{ item.especie }}</td>
              <td>{{ item.total }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-neutral-100 rounded-full h-2">
                    <div
                      class="bg-brand-500 h-2 rounded-full"
                      :style="`width: ${Math.round(item.total / ((stats.total_perdidos ?? 0) + (stats.total_encontrados ?? 0)) * 100)}%`"
                    />
                  </div>
                  <span class="text-xs font-bold text-neutral-500 w-10">
                    {{ Math.round(item.total / ((stats.total_perdidos ?? 0) + (stats.total_encontrados ?? 0)) * 100) }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Insights B2G -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="insight-info">
          <Info :size="18" class="flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-black mb-1">Análise de impacto</p>
            <p class="text-sm">
              Com taxa de retorno de <strong>{{ taxaRetorno(stats.total_perdidos ?? 0, stats.total_encontrados ?? 0) }}%</strong>,
              a plataforma está conectando tutores a pets perdidos de forma efetiva.
            </p>
          </div>
        </div>
        <div class="insight-warning">
          <AlertTriangle :size="18" class="flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-black mb-1">Pets em situação crítica</p>
            <p class="text-sm">
              <strong>{{ stats.total_perdidos ?? 0 }}</strong> pets ainda aguardam retorno.
              Use os Clusters IA para identificar regiões prioritárias de busca.
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
