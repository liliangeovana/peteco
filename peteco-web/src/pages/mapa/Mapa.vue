<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { usePets } from '../../modules/pet/controllers/usePets.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend,
  ArcElement, BarElement, CategoryScale, LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

// Fix ícones Leaflet no Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon   from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow })

// Boa Vista — RR
const BOA_VISTA = [-2.8235, -60.6758]

const { pets, loading, buscar } = usePets()
let mapa = null

// ── Estatísticas calculadas localmente ──────────────
const total       = computed(() => pets.value.length)
const perdidos    = computed(() => pets.value.filter(p => p.status === 'perdido').length)
const encontrados = computed(() => pets.value.filter(p => p.status === 'encontrado').length)
const recentes    = computed(() => [...pets.value].slice(0, 6))

const porEspecie = computed(() => {
  const contagem = {}
  pets.value.forEach(p => {
    const k = p.especie || 'outro'
    contagem[k] = (contagem[k] || 0) + 1
  })
  return contagem
})

// ── Dados Chart.js ───────────────────────────────────
const donutData = computed(() => ({
  labels: Object.keys(porEspecie.value).map(e =>
    e === 'cachorro' ? '🐶 Cachorro' : e === 'gato' ? '🐱 Gato' : '🐾 Outro'
  ),
  datasets: [{
    data: Object.values(porEspecie.value),
    backgroundColor: ['#7C3AED', '#A78BFA', '#EDE9FE'],
    borderWidth: 0,
    hoverOffset: 6,
  }],
}))

const barData = computed(() => ({
  labels: ['Perdidos', 'Encontrados'],
  datasets: [{
    data: [perdidos.value, encontrados.value],
    backgroundColor: ['#E63946', '#2EBD7A'],
    borderRadius: 10,
    borderSkipped: false,
  }],
}))

const donutOptions = {
  responsive: true,
  cutout: '68%',
  plugins: {
    legend: { position: 'bottom', labels: { font: { family: 'Nunito', weight: '700', size: 11 }, padding: 12 } },
    tooltip: { callbacks: { label: ctx => ` ${ctx.parsed} pets` } },
  },
}
const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'Nunito', weight: '700' } } },
    y: { beginAtZero: true, grid: { color: '#F0EBF8' }, ticks: { stepSize: 1, font: { family: 'Nunito' } } },
  },
}

// ── Marcador customizado ─────────────────────────────
function criarIcone(especie) {
  const emoji = especie === 'cachorro' ? '🐶' : especie === 'gato' ? '🐱' : '🐾'
  return L.divIcon({
    html: `<div style="
      width:36px;height:36px;border-radius:50%;
      background:#7C3AED;border:2.5px solid #fff;
      box-shadow:0 2px 8px rgba(124,58,237,0.35);
      display:flex;align-items:center;justify-content:center;
      font-size:18px;cursor:pointer;
    ">${emoji}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
  })
}

onMounted(async () => {
  await buscar()

  mapa = L.map('mapa-pins', { zoomControl: true }).setView(BOA_VISTA, 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(mapa)

  pets.value.forEach(pet => {
    if (!pet.lat || !pet.lng) return
    L.marker([pet.lat, pet.lng], { icon: criarIcone(pet.especie) })
      .addTo(mapa)
      .bindPopup(`
        <div style="font-family:Nunito,sans-serif;min-width:160px">
          ${pet.foto_url
            ? `<img src="${pet.foto_url}" style="width:100%;height:80px;object-fit:cover;border-radius:10px;margin-bottom:8px"/>`
            : ''}
          <strong style="font-size:14px;color:#1A1626">${pet.nome}</strong><br/>
          <span style="font-size:12px;color:#6B6578">${pet.especie}${pet.raca ? ' · ' + pet.raca : ''}</span><br/>
          <span style="font-size:11px;color:#A099B0">📍 ${pet.bairro || ''}${pet.cidade ? ', ' + pet.cidade : ''}</span><br/>
          <span style="
            display:inline-block;margin-top:6px;padding:2px 10px;border-radius:999px;
            font-size:10px;font-weight:800;
            background:${pet.status === 'perdido' ? '#FDECEA' : '#E6F9F0'};
            color:${pet.status === 'perdido' ? '#E63946' : '#2EBD7A'};
          ">${pet.status}</span>
        </div>
      `, { maxWidth: 200 })
  })
})

onUnmounted(() => { if (mapa) mapa.remove() })
</script>

<template>
  <div class="page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h2>Mapa de Ocorrências</h2>
        <p class="text-sm mt-0.5 font-semibold" style="color:#6B6578">
          Boa Vista — RR ·
          <span v-if="loading">carregando...</span>
          <span v-else>{{ total }} pet{{ total !== 1 ? 's' : '' }} cadastrado{{ total !== 1 ? 's' : '' }}</span>
        </p>
      </div>
      <div class="flex gap-2">
        <RouterLink to="/heatmap"  class="btn-ghost text-xs">🔥 Heatmap</RouterLink>
        <RouterLink to="/clusters" class="btn-ghost text-xs">🤖 Clusters</RouterLink>
      </div>
    </div>

    <!-- Grid: mapa + sidebar -->
    <div class="grid gap-4" style="grid-template-columns: 1fr 320px">

      <!-- Mapa -->
      <div style="border-radius:20px;overflow:hidden;border:1.5px solid #E5E0F0;box-shadow:0 2px 8px rgba(59,31,110,0.07)">
        <div id="mapa-pins" style="height: 72vh; width: 100%;" />
      </div>

      <!-- Sidebar -->
      <div class="flex flex-col gap-4">

        <!-- KPIs -->
        <div class="grid grid-cols-2 gap-3">
          <div class="card flex flex-col gap-1" style="border-top: 3px solid #7C3AED">
            <span class="stat-number" style="color:#7C3AED">{{ perdidos }}</span>
            <span class="stat-label">🔴 Perdidos</span>
          </div>
          <div class="card flex flex-col gap-1" style="border-top: 3px solid #2EBD7A">
            <span class="stat-number" style="color:#2EBD7A">{{ encontrados }}</span>
            <span class="stat-label">🟢 Encontrados</span>
          </div>
        </div>

        <!-- Donut — por espécie -->
        <div class="card">
          <p class="font-black text-sm mb-3" style="color:#1A1626">Por espécie</p>
          <Doughnut v-if="!loading && total > 0" :data="donutData" :options="donutOptions" />
          <p v-else class="text-xs text-center py-4" style="color:#A099B0">Sem dados</p>
        </div>

        <!-- Bar — status -->
        <div class="card">
          <p class="font-black text-sm mb-3" style="color:#1A1626">Perdidos × Encontrados</p>
          <Bar v-if="!loading && total > 0" :data="barData" :options="barOptions" style="max-height:140px" />
          <p v-else class="text-xs text-center py-4" style="color:#A099B0">Sem dados</p>
        </div>

        <!-- Recentes -->
        <div class="card flex-1 overflow-hidden">
          <p class="font-black text-sm mb-3" style="color:#1A1626">Cadastros recentes</p>
          <div v-if="loading" class="text-xs py-2" style="color:#A099B0">Carregando...</div>
          <div v-else-if="recentes.length === 0" class="text-xs py-2" style="color:#A099B0">Nenhum pet cadastrado.</div>
          <div v-else class="flex flex-col gap-2">
            <div
              v-for="pet in recentes"
              :key="pet.id"
              class="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors"
              style="cursor:default"
            >
              <!-- foto / avatar -->
              <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;flex-shrink:0;background:#EDE9FE;display:flex;align-items:center;justify-content:center;font-size:16px">
                <img v-if="pet.foto_url" :src="pet.foto_url" style="width:100%;height:100%;object-fit:cover" />
                <span v-else>{{ pet.especie === 'cachorro' ? '🐶' : pet.especie === 'gato' ? '🐱' : '🐾' }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-black text-xs truncate" style="color:#1A1626">{{ pet.nome }}</p>
                <p class="text-xs truncate" style="color:#A099B0">{{ pet.bairro || pet.cidade || '—' }}</p>
              </div>
              <span :class="pet.status === 'perdido' ? 'badge-red' : 'badge-green'" style="flex-shrink:0;font-size:9px">
                {{ pet.status === 'perdido' ? '⚠️' : '✅' }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
