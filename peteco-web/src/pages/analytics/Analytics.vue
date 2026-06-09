<script setup>
import { ref, watch, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale, ArcElement,
} from 'chart.js'
import {
  LayoutDashboard, TrendingUp,
  PawPrint, SearchX, CheckCircle2, List,
  BarChart2, AlertTriangle, Info,
} from 'lucide-vue-next'
import { useAnalise } from '../../modules/analise/controllers/useAnalise.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const tabs = [
  { id: 'visao-geral', label: 'Visão Geral',  Icon: LayoutDashboard },
  { id: 'raca-bairro', label: 'Raça/Bairro',  Icon: TrendingUp },
]
const activeTab = ref('visao-geral')

const { stats, loading: loadingStats, erro: erroStats, buscar: buscarStats } = useAnalise()

const barData   = ref(null)
const donutData = ref(null)

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
}
const donutOptions = { responsive: true, plugins: { legend: { position: 'right' } } }

watch(stats, (data) => {
  if (!data) return
  barData.value = {
    labels: data.por_especie?.map(e => e.especie) ?? [],
    datasets: [{
      label: 'Pets',
      data: data.por_especie?.map(e => e.total) ?? [],
      backgroundColor: ['#7C3AED', '#f97316', '#3b82f6', '#a855f7'],
      borderRadius: 8,
    }],
  }
  donutData.value = {
    labels: ['Perdidos', 'Encontrados'],
    datasets: [{
      data: [data.total_perdidos ?? 0, data.total_encontrados ?? 0],
      backgroundColor: ['#E63946', '#2EBD7A'],
      borderWidth: 0,
    }],
  }
})

const taxaRetorno = computed(() => {
  const s = stats.value
  if (!s) return 0
  const total = (s.total_perdidos ?? 0) + (s.total_encontrados ?? 0)
  return total > 0 ? Math.round(((s.total_encontrados ?? 0) / total) * 100) : 0
})

function taxaRetornoFn(perdidos, encontrados) {
  const total = perdidos + encontrados
  return total > 0 ? Math.round((encontrados / total) * 100) : 0
}

buscarStats()
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Analytics</h2>
        <p class="text-sm font-semibold mt-0.5" style="color:#6B6578">
          Estatísticas e análise de dados — Boa Vista, RR
        </p>
      </div>
    </div>

    <!-- Tab Bar -->
    <div style="display:flex;gap:4px;margin-bottom:24px;background:#F7F5FB;border-radius:16px;padding:6px;">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        style="display:flex;align-items:center;gap:6px;padding:8px 20px;border-radius:12px;font-size:0.82rem;font-weight:800;border:none;cursor:pointer;white-space:nowrap;transition:background 0.15s,color 0.15s;"
        :style="activeTab === tab.id
          ? 'background:#7C3AED;color:#fff;box-shadow:0 2px 8px rgba(124,58,237,0.3);'
          : 'background:transparent;color:#6B6578;'"
        @click="activeTab = tab.id"
      >
        <component :is="tab.Icon" :size="14" />
        {{ tab.label }}
      </button>
    </div>

    <!-- ── Tab: Visão Geral ── -->
    <div v-if="activeTab === 'visao-geral'">
      <div v-if="loadingStats" class="text-center py-20 text-neutral-400 font-semibold">Carregando...</div>
      <div v-else-if="erroStats" class="insight-critical">Serviço de estatísticas indisponível.</div>

      <template v-else-if="stats">
        <!-- KPIs -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="stat-card border-t-4 border-brand-500">
            <div class="stat-card-icon bg-brand-100">
              <PawPrint :size="20" style="color:#7C3AED" />
            </div>
            <span class="stat-number text-brand-600">{{ (stats.total_perdidos ?? 0) + (stats.total_encontrados ?? 0) }}</span>
            <span class="stat-label">Total de pets</span>
          </div>
          <div class="stat-card border-t-4 border-red-400">
            <div class="stat-card-icon bg-red-50">
              <SearchX :size="20" style="color:#E63946" />
            </div>
            <span class="stat-number text-red-500">{{ stats.total_perdidos ?? 0 }}</span>
            <span class="stat-label">Perdidos</span>
          </div>
          <div class="stat-card border-t-4 border-emerald-400">
            <div class="stat-card-icon bg-emerald-50">
              <CheckCircle2 :size="20" style="color:#2EBD7A" />
            </div>
            <span class="stat-number text-emerald-600">{{ stats.total_encontrados ?? 0 }}</span>
            <span class="stat-label">Encontrados</span>
          </div>
          <div class="stat-card border-t-4 border-blue-400">
            <div class="stat-card-icon bg-blue-50">
              <TrendingUp :size="20" style="color:#3B82F6" />
            </div>
            <span class="stat-number text-blue-600">{{ taxaRetorno }}%</span>
            <span class="stat-label">Taxa de retorno</span>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card">
            <h3 class="font-black text-neutral-800 mb-4">Pets por espécie</h3>
            <Bar v-if="barData" :data="barData" :options="barOptions" />
          </div>
          <div class="card">
            <h3 class="font-black text-neutral-800 mb-4">Status geral</h3>
            <div class="flex justify-center">
              <Doughnut v-if="donutData" :data="donutData" :options="donutOptions" style="max-height:260px" />
            </div>
          </div>
        </div>

        <!-- Quick links -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          <RouterLink
            to="/feed"
            class="card flex flex-col items-center gap-3 hover:border-brand-300 hover:bg-brand-50 transition-all cursor-pointer hover:-translate-y-0.5"
            style="text-decoration:none;"
          >
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center" style="background:#EDE9FE">
              <PawPrint :size="22" style="color:#7C3AED" />
            </div>
            <span class="text-xs font-black text-neutral-600">Feed de Pets</span>
          </RouterLink>
          <RouterLink
            to="/pets"
            class="card flex flex-col items-center gap-3 hover:border-brand-300 hover:bg-brand-50 transition-all cursor-pointer hover:-translate-y-0.5"
            style="text-decoration:none;"
          >
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center" style="background:#E6F9F0">
              <List :size="22" style="color:#2EBD7A" />
            </div>
            <span class="text-xs font-black text-neutral-600">Lista de Pets</span>
          </RouterLink>
          <RouterLink
            to="/analise"
            class="card flex flex-col items-center gap-3 hover:border-brand-300 hover:bg-brand-50 transition-all cursor-pointer hover:-translate-y-0.5"
            style="text-decoration:none;"
          >
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center" style="background:#EFF6FF">
              <BarChart2 :size="22" style="color:#3b82f6" />
            </div>
            <span class="text-xs font-black text-neutral-600">Análise B2G</span>
          </RouterLink>
        </div>
      </template>
    </div>

    <!-- ── Tab: Raça/Bairro ── -->
    <div v-if="activeTab === 'raca-bairro'">
      <div v-if="loadingStats" class="text-center py-20 text-neutral-400 font-semibold">Carregando dados...</div>
      <div v-else-if="erroStats" class="insight-critical">
        <AlertTriangle :size="18" class="flex-shrink-0" />
        <span>Serviço de estatísticas indisponível.</span>
      </div>

      <template v-else-if="stats">
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
              {{ taxaRetornoFn(stats.total_perdidos ?? 0, stats.total_encontrados ?? 0) }}%
            </span>
            <span class="stat-label">Taxa de retorno</span>
          </div>
        </div>

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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="insight-info">
            <Info :size="18" class="flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-black mb-1">Análise de impacto</p>
              <p class="text-sm">
                Com taxa de retorno de
                <strong>{{ taxaRetornoFn(stats.total_perdidos ?? 0, stats.total_encontrados ?? 0) }}%</strong>,
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
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>
