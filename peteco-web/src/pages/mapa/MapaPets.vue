<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { MapPin, PawPrint, ChevronDown } from 'lucide-vue-next'
import { http } from '../../client/http.js'
import { BAIRROS_BOA_VISTA } from '../../constants/bairros.js'
import { useAuth } from '../../modules/auth/controllers/useAuth.js'
import { useParseFoto } from '../../composables/useParseFoto.js'
import { useAvatarEmoji } from '../../composables/useAvatarEmoji.js'

const { usuario } = useAuth()
const { parsePrimeiraFoto } = useParseFoto()
const { avatarEmoji } = useAvatarEmoji()

const loading      = ref(true)
const erro         = ref(null)
const totalGeral   = ref(0)
const totalFiltrado = ref(0)
const semCoords    = ref(0)
const mapEl        = ref(null)
const filtroBairro = ref(usuario.value?.bairro || '')
const pets         = ref([])

const statsPorEspecie = computed(() => {
  const fonte = filtroBairro.value
    ? pets.value.filter(p => p.bairro === filtroBairro.value)
    : pets.value
  return {
    cachorro: fonte.filter(p => p.especie === 'cachorro').length,
    gato:     fonte.filter(p => p.especie === 'gato').length,
    outro:    fonte.filter(p => p.especie === 'outro').length,
  }
})

const rankingBairros = computed(() => {
  const contagem = {}
  for (const p of pets.value) {
    if (p.bairro) contagem[p.bairro] = (contagem[p.bairro] || 0) + 1
  }
  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([nome, total]) => ({ nome, total }))
})

const maxBairro = computed(() => rankingBairros.value[0]?.total || 1)

let leafletMap    = null
let markersLayer  = null
let todosPets     = []

// ─── helpers ──────────────────────────────────────────────────
function coordsDoBairro(nomeBairro) {
  const b = BAIRROS_BOA_VISTA.find(b => b.nome === nomeBairro)
  return b ? { latitude: b.lat, longitude: b.lng } : null
}

function jitter(val, range = 0.003) {
  return val + (Math.random() - 0.5) * range
}

function criarIcone(pet) {
  const L = window.L
  const foto  = parsePrimeiraFoto(pet.foto_url)
  const emoji = avatarEmoji(pet.especie)
  return L.divIcon({
    html: foto
      ? `<div style="width:40px;height:40px;border-radius:50%;border:2.5px solid #7C3AED;overflow:hidden;background:#EDE9FE;box-shadow:0 2px 6px rgba(124,58,237,0.35);"><img src="${foto}" style="width:100%;height:100%;object-fit:cover;" /></div>`
      : `<div style="width:40px;height:40px;border-radius:50%;border:2.5px solid #7C3AED;background:#EDE9FE;display:flex;align-items:center;justify-content:center;font-size:1.2rem;box-shadow:0 2px 6px rgba(124,58,237,0.35);">${emoji}</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  })
}

function criarPopup(pet) {
  const foto = parsePrimeiraFoto(pet.foto_url)
  return `
    <div style="min-width:160px;font-family:Nunito,sans-serif;">
      ${foto ? `<img src="${foto}" style="width:100%;height:90px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />` : ''}
      <p style="font-weight:900;font-size:1rem;color:#1A1626;margin:0 0 2px;">${pet.nome}</p>
      <p style="font-size:0.78rem;color:#7C3AED;font-weight:700;margin:0 0 2px;">${pet.especie}${pet.raca ? ' · ' + pet.raca : ''}</p>
      <p style="font-size:0.76rem;color:#6B6578;margin:0 0 8px;">${pet.bairro || '—'}</p>
      <a href="/pet/${pet.id}" style="display:inline-block;background:#7C3AED;color:#fff;padding:5px 12px;border-radius:8px;font-size:0.75rem;font-weight:700;text-decoration:none;">Ver detalhes</a>
    </div>`
}

// ─── atualizar marcadores no mapa ─────────────────────────────
function atualizarMarcadores() {
  if (!leafletMap || !window.L) return
  const L = window.L

  if (markersLayer) {
    markersLayer.clearLayers()
  } else {
    markersLayer = L.layerGroup().addTo(leafletMap)
  }

  const petsFiltrados = filtroBairro.value
    ? todosPets.filter(p => p.bairro === filtroBairro.value)
    : todosPets

  totalFiltrado.value = petsFiltrados.length
  let semPosicao = 0

  for (const pet of petsFiltrados) {
    let lat = pet.latitude  ? parseFloat(pet.latitude)  : null
    let lng = pet.longitude ? parseFloat(pet.longitude) : null

    if (!lat || !lng) {
      const fallback = coordsDoBairro(pet.bairro)
      if (fallback) { lat = jitter(fallback.latitude); lng = jitter(fallback.longitude) }
      else          { semPosicao++; continue }
    }

    L.marker([lat, lng], { icon: criarIcone(pet) })
      .bindPopup(criarPopup(pet))
      .addTo(markersLayer)
  }

  semCoords.value = semPosicao

  if (filtroBairro.value) {
    const b = BAIRROS_BOA_VISTA.find(b => b.nome === filtroBairro.value)
    if (b) leafletMap.setView([b.lat, b.lng], 14, { animate: true })
  } else {
    leafletMap.setView([2.8196, -60.6712], 12, { animate: true })
  }
}

// ─── lifecycle ────────────────────────────────────────────────
onMounted(async () => {
  try {
    const { data } = await http.get('/pets?status=perdido')
    todosPets      = data
    pets.value     = data
    totalGeral.value = data.length

    const L = window.L
    if (!L) { erro.value = 'Biblioteca de mapa não carregada. Recarregue a página.'; return }

    const centroInicial = filtroBairro.value
      ? (() => { const b = BAIRROS_BOA_VISTA.find(b => b.nome === filtroBairro.value); return b ? [b.lat, b.lng] : [2.8196, -60.6712] })()
      : [2.8196, -60.6712]
    const zoomInicial = filtroBairro.value ? 14 : 12

    leafletMap = L.map(mapEl.value, { zoomControl: true }).setView(centroInicial, zoomInicial)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(leafletMap)

    atualizarMarcadores()
  } catch (e) {
    erro.value = 'Não foi possível carregar os pets.'
  } finally {
    loading.value = false
  }
})

watch(filtroBairro, () => atualizarMarcadores())

onBeforeUnmount(() => { if (leafletMap) { leafletMap.remove(); leafletMap = null } })
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Mapa de pets perdidos</h2>
    </div>

    <!-- Filtro + contagem -->
    <div class="flex items-center gap-3 mb-4 flex-wrap">
      <div class="relative">
        <MapPin :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style="color:#7C3AED;" />
        <select
          v-model="filtroBairro"
          class="input pl-8 pr-8 text-sm"
          style="min-width:200px;padding-top:8px;padding-bottom:8px;"
        >
          <option value="">Todos os bairros</option>
          <option v-for="b in BAIRROS_BOA_VISTA" :key="b.nome" :value="b.nome">{{ b.nome }}</option>
        </select>
        <ChevronDown :size="14" class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
      </div>

      <div v-if="!loading" class="flex items-center gap-1.5 text-sm font-semibold" style="color:#6B6578;">
        <PawPrint :size="14" style="color:#7C3AED;" />
        <span>
          {{ totalFiltrado }} pet{{ totalFiltrado !== 1 ? 's' : '' }}
          <span v-if="filtroBairro"> em {{ filtroBairro }}</span>
          <span v-else> no total</span>
        </span>
        <span v-if="semCoords > 0" class="text-xs" style="color:#A099B0;">({{ semCoords }} sem coords)</span>
      </div>
      <span v-if="loading" class="text-sm text-neutral-400 font-semibold">Carregando mapa...</span>
    </div>

    <!-- Cards de resumo -->
    <div v-if="!loading" class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="stat-card">
        <PawPrint :size="20" style="color:#7C3AED;opacity:0.7;" />
        <span class="stat-num">{{ totalFiltrado }}</span>
        <span class="stat-label">{{ filtroBairro ? 'neste bairro' : 'total' }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-inicial">🐕</span>
        <span class="stat-num">{{ statsPorEspecie.cachorro }}</span>
        <span class="stat-label">cachorros</span>
      </div>
      <div class="stat-card">
        <span class="stat-inicial">🐈</span>
        <span class="stat-num">{{ statsPorEspecie.gato }}</span>
        <span class="stat-label">gatos</span>
      </div>
      <div class="stat-card">
        <span class="stat-inicial">🐾</span>
        <span class="stat-num">{{ statsPorEspecie.outro }}</span>
        <span class="stat-label">outros</span>
      </div>
    </div>

    <div v-if="erro" class="insight-critical mb-4">{{ erro }}</div>

    <!-- Mapa + Gráfico lado a lado -->
    <div class="map-ranking-layout">

      <!-- Coluna do mapa -->
      <div class="map-column">
        <div ref="mapEl" class="map-box" />
        <p class="text-xs mt-2 font-semibold leading-snug" style="color:#A099B0;">
          Pets sem coordenadas exatas são posicionados no centro do bairro cadastrado.
          Clique em um marcador para ver os detalhes.
        </p>
      </div>

      <!-- Coluna do gráfico -->
      <div v-if="!loading && rankingBairros.length > 0" class="ranking-column">
        <!-- Cabeçalho do card -->
        <div class="ranking-card-header">
          <div>
            <p class="ranking-title">Ocorrências por bairro</p>
            <p class="ranking-subtitle">Top {{ rankingBairros.length }} com mais registros</p>
          </div>
          <div class="ranking-badge">{{ totalGeral }} total</div>
        </div>

        <!-- Lista de bairros -->
        <div class="ranking-list">
          <div
            v-for="(b, i) in rankingBairros"
            :key="b.nome"
            class="ranking-item"
            :class="{ 'ranking-item-top': i < 3 }"
          >
            <!-- Barra + info -->
            <div class="ranking-body">
              <div class="ranking-meta">
                <span class="ranking-nome">{{ b.nome }}</span>
                <span class="ranking-count">{{ b.total }}</span>
              </div>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :class="
                    i === 0 ? 'bar-gold' :
                    i === 1 ? 'bar-silver' :
                    i === 2 ? 'bar-bronze' :
                    'bar-purple'
                  "
                  :style="{ width: (b.total / maxBairro * 100) + '%' }"
                />
              </div>
              <span class="ranking-pct">{{ Math.round(b.total / maxBairro * 100) }}% do máx.</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ── Cards de estatísticas ── */
.stat-card {
  background: #fff;
  border: 1.5px solid #E5E0F0;
  border-radius: 14px;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat-inicial { font-size: 1.2rem; line-height: 1; }
.stat-num {
  font-size: 1.5rem;
  font-weight: 900;
  color: #7C3AED;
  line-height: 1.1;
}
.stat-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #A099B0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ── Layout mapa + ranking ── */
.map-ranking-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.map-column {
  flex: 1;
  min-width: 0;
}

.map-box {
  width: 100%;
  height: 480px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.10);
  background: #EDE9FE;
  isolation: isolate;
}

/* ── Card do ranking ── */
.ranking-column {
  width: 310px;
  flex-shrink: 0;
  background: #fff;
  border: 1.5px solid #E5E0F0;
  border-radius: 16px;
  height: 480px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(124, 58, 237, 0.07);
}

.ranking-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 16px 16px 12px;
  border-bottom: 1.5px solid #F0EBF8;
  flex-shrink: 0;
}

.ranking-title {
  font-size: 0.875rem;
  font-weight: 900;
  color: #1A1626;
  margin: 0;
}

.ranking-subtitle {
  font-size: 0.7rem;
  font-weight: 600;
  color: #A099B0;
  margin: 2px 0 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ranking-badge {
  background: #F0EBF8;
  color: #7C3AED;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Lista de bairros ── */
.ranking-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  scrollbar-width: thin;
  scrollbar-color: #E5E0F0 transparent;
}
.ranking-list::-webkit-scrollbar { width: 4px; }
.ranking-list::-webkit-scrollbar-track { background: transparent; }
.ranking-list::-webkit-scrollbar-thumb { background: #E5E0F0; border-radius: 4px; }

.ranking-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  transition: background 0.15s;
}
.ranking-item:hover { background: #FAF8FF; }
.ranking-item-top { background: #FDFBFF; }

.ranking-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ranking-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.ranking-nome {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1A1626;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ranking-count {
  font-size: 0.82rem;
  font-weight: 900;
  color: #7C3AED;
  flex-shrink: 0;
}

.bar-track {
  width: 100%;
  height: 7px;
  background: #F0EBF8;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 6px;
}

.bar-gold   { background: linear-gradient(90deg, #D97706, #FBBF24); }
.bar-silver { background: linear-gradient(90deg, #6B7280, #D1D5DB); }
.bar-bronze { background: linear-gradient(90deg, #92400E, #D97706); }
.bar-purple { background: linear-gradient(90deg, #7C3AED, #A78BFA); }

.ranking-pct {
  font-size: 0.65rem;
  font-weight: 600;
  color: #C4BDCF;
}

/* ── Responsivo ── */
@media (max-width: 900px) {
  .map-ranking-layout {
    flex-direction: column;
  }
  .ranking-column {
    width: 100%;
    height: auto;
    max-height: 360px;
  }
}
</style>
