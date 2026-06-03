<script setup>
import { ref, onMounted, watch } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale, ArcElement,
} from 'chart.js'
import {
  PawPrint, SearchX, CheckCircle2, TrendingUp,
  MapPin, Flame, BrainCircuit, List, ArrowRight,
} from 'lucide-vue-next'
import { useAnalise } from '../../modules/analise/controllers/useAnalise.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const { stats, loading, erro, buscar } = useAnalise()

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
      label: 'Pets perdidos',
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

onMounted(buscar)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Dashboard</h2>
      <RouterLink to="/analise" class="btn-ghost text-xs">
        Análise detalhada <ArrowRight :size="14" />
      </RouterLink>
    </div>

    <div v-if="loading" class="text-center py-20 text-neutral-400 font-semibold">Carregando...</div>
    <div v-else-if="erro" class="insight-critical">Serviço de estatísticas indisponível.</div>

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
          <span class="stat-number text-blue-600">
            {{
              (stats.total_perdidos + stats.total_encontrados) > 0
                ? Math.round((stats.total_encontrados / (stats.total_perdidos + stats.total_encontrados)) * 100)
                : 0
            }}%
          </span>
          <span class="stat-label">Taxa de retorno</span>
        </div>
      </div>

      <!-- Gráficos -->
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

      <!-- Atalhos -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <RouterLink
          v-for="link in [
            { to: '/',         Icon: MapPin,       label: 'Mapa',         color: '#7C3AED', bg: '#EDE9FE' },
            { to: '/heatmap',  Icon: Flame,        label: 'Heatmap',      color: '#f97316', bg: '#FFF7ED' },
            { to: '/clusters', Icon: BrainCircuit, label: 'Clusters IA',  color: '#3b82f6', bg: '#EFF6FF' },
            { to: '/pets',     Icon: List,         label: 'Lista de Pets', color: '#2EBD7A', bg: '#E6F9F0' },
          ]"
          :key="link.to" :to="link.to"
          class="card flex flex-col items-center gap-3 hover:border-brand-300 hover:bg-brand-50 transition-all cursor-pointer hover:-translate-y-0.5"
        >
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center" :style="`background:${link.bg}`">
            <component :is="link.Icon" :size="22" :style="`color:${link.color}`" />
          </div>
          <span class="text-xs font-black text-neutral-600">{{ link.label }}</span>
        </RouterLink>
      </div>
    </template>
  </div>
</template>
