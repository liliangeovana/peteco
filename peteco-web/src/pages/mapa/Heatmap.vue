<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import { usePets } from '../../modules/pet/controllers/usePets.js'

const { pets, loading, buscar } = usePets()
const total = computed(() => pets.value.length)
let mapa = null

onMounted(async () => {
  mapa = L.map('mapa-heatmap').setView([-2.819, -60.673], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
  }).addTo(mapa)

  await buscar({ status: 'perdido' })

  const pontos = pets.value
    .filter(p => p.lat && p.lng)
    .map(p => [p.lat, p.lng, 1.0])

  if (pontos.length > 0) {
    L.heatLayer(pontos, {
      radius: 30,
      blur: 20,
      maxZoom: 17,
      gradient: { 0.4: '#3b82f6', 0.65: '#22c55e', 1.0: '#ef4444' },
    }).addTo(mapa)
  }
})

onUnmounted(() => { if (mapa) mapa.remove() })
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Heatmap de Ocorrências</h2>
        <p class="text-sm text-neutral-500 font-semibold mt-1">
          Estimativa de Densidade Kernel (KDE) — concentração geográfica de pets perdidos
        </p>
      </div>
      <div class="flex gap-2">
        <RouterLink to="/" class="btn-ghost text-xs">← Mapa</RouterLink>
        <RouterLink to="/clusters" class="btn-ghost text-xs">Ver Clusters →</RouterLink>
      </div>
    </div>

    <div class="card p-0 overflow-hidden">
      <div id="mapa-heatmap" style="height: 65vh; width: 100%;" />
    </div>

    <div class="flex gap-4 mt-3 justify-center">
      <div class="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <span class="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Baixa densidade
      </div>
      <div class="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Média
      </div>
      <div class="flex items-center gap-2 text-xs font-semibold text-neutral-500">
        <span class="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Alta densidade
      </div>
    </div>
  </div>
</template>
