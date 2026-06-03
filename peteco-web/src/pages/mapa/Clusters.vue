<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useClusters } from '../../modules/analise/controllers/useClusters.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow })

const { dados, loading, erro, buscar } = useClusters()
let mapa = null

onMounted(async () => {
  mapa = L.map('mapa-clusters').setView([-2.819, -60.673], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
  }).addTo(mapa)

  await buscar()

  const cores = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']

  dados.value?.clusters?.forEach((cluster, idx) => {
      const cor = cores[idx % cores.length]
      const raio = cluster.criticidade === 'alta' ? 800 : 500

      L.circle([cluster.centroide_lat, cluster.centroide_lng], {
        color: cor, fillColor: cor, fillOpacity: 0.25, weight: 2, radius: raio,
      }).addTo(mapa).bindPopup(`
        <strong>Cluster ${cluster.cluster_id + 1}</strong><br/>
        ${cluster.total_pets} pets · Criticidade: <strong>${cluster.criticidade}</strong>
      `)

      cluster.pets?.forEach(pet => {
        L.circleMarker([pet.lat, pet.lng], {
          radius: 5, color: cor, fillColor: cor, fillOpacity: 0.9, weight: 1,
        }).addTo(mapa).bindPopup(`<strong>${pet.nome}</strong><br/>${pet.especie}`)
      })
    })
})

onUnmounted(() => { if (mapa) mapa.remove() })
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Clusters DBSCAN</h2>
        <p class="text-sm text-neutral-500 font-semibold mt-1">
          Agrupamento geográfico por densidade — algoritmo DBSCAN (Ester et al., 1996)
        </p>
      </div>
      <RouterLink to="/heatmap" class="btn-ghost text-xs">← Heatmap</RouterLink>
    </div>

    <div v-if="loading" class="card flex items-center justify-center" style="height:200px">
      <p class="text-neutral-400 font-semibold text-sm">Calculando clusters...</p>
    </div>

    <div v-else-if="erro" class="insight-critical mb-4">
      Microsserviço de IA indisponível. Inicie o serviço Python e tente novamente.
    </div>

    <template v-else>
      <div v-if="dados" class="grid grid-cols-3 gap-4 mb-4">
        <div class="stat-card">
          <span class="stat-number text-brand-600">{{ dados.total_clusters ?? 0 }}</span>
          <span class="stat-label">Clusters encontrados</span>
        </div>
        <div class="stat-card">
          <span class="stat-number text-red-500">{{ dados.clusters?.filter(c => c.criticidade === 'alta').length ?? 0 }}</span>
          <span class="stat-label">Criticidade alta</span>
        </div>
        <div class="stat-card">
          <span class="stat-number text-neutral-400">{{ dados.total_ruido ?? 0 }}</span>
          <span class="stat-label">Pets isolados (ruído)</span>
        </div>
      </div>

      <div class="card p-0 overflow-hidden">
        <div id="mapa-clusters" style="height: 55vh; width: 100%;" />
      </div>

      <div v-if="dados?.clusters?.length" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="cluster in dados.clusters"
          :key="cluster.cluster_id"
          class="card flex items-center gap-4"
        >
          <div class="text-2xl font-black" :class="cluster.criticidade === 'alta' ? 'text-red-500' : 'text-amber-500'">
            {{ cluster.total_pets }}
          </div>
          <div>
            <p class="font-black text-neutral-800 text-sm">Cluster {{ cluster.cluster_id + 1 }}</p>
            <p class="text-xs text-neutral-500">
              Criticidade: <strong>{{ cluster.criticidade }}</strong> ·
              {{ cluster.centroide_lat?.toFixed(4) }}, {{ cluster.centroide_lng?.toFixed(4) }}
            </p>
          </div>
          <span :class="cluster.criticidade === 'alta' ? 'badge-red' : 'badge-blue'" class="ml-auto">
            {{ cluster.criticidade }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
