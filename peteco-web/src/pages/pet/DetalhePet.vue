<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ArrowLeft, MapPin, Calendar, PawPrint, Tag, Gift, Pencil, Trash2, Clock } from 'lucide-vue-next'
import { http } from '../../client/http.js'
import { BAIRROS_BOA_VISTA } from '../../constants/bairros.js'
import { useParseFoto } from '../../composables/useParseFoto.js'
import { useFormatarData } from '../../composables/useFormatarData.js'
import { useAvatarEmoji } from '../../composables/useAvatarEmoji.js'
import { useNormalizarContatos } from '../../composables/useNormalizarContatos.js'
import { useAuth } from '../../modules/auth/controllers/useAuth.js'
import ContactItem from '../../components/ContactItem.vue'
import PetPhotoCarousel from '../../components/PetPhotoCarousel.vue'

const route  = useRoute()
const router = useRouter()
const { parsePrimeiraFoto, parseTodasFotos } = useParseFoto()
const { formatarData } = useFormatarData()
const { avatarEmoji } = useAvatarEmoji()
const { parseContatos, formatarContato } = useNormalizarContatos()
const { usuario } = useAuth()

const pet           = ref(null)
const nearby        = ref([])
const avistamentos  = ref([])
const loading       = ref(true)
const erro          = ref(null)
const miniMapEl     = ref(null)
let   miniMap       = null

const isOwner = computed(() => usuario.value?.id && pet.value?.usuario_id && usuario.value.id === pet.value.usuario_id)

const temContatos = computed(() => pet.value?.contatos && parseContatos(pet.value.contatos).length > 0)
const soMapa = computed(() => temLocalizacao.value && !temContatos.value)

async function excluir() {
  if (!window.confirm(`Tem certeza que deseja excluir o cadastro de ${pet.value.nome}? Esta ação não pode ser desfeita.`)) return
  try {
    await http.delete(`/pets/${pet.value.id}`)
    router.push('/meus-pets')
  } catch {
    alert('Erro ao excluir o pet. Tente novamente.')
  }
}

// ── fotos ─────────────────────────────────────────────────────
const fotos = computed(() => parseTodasFotos(pet.value?.foto_url))

const temLocalizacao = computed(() => {
  if (!pet.value) return false
  if (pet.value.latitude && pet.value.longitude) return true
  if (BAIRROS_BOA_VISTA.find(b => b.nome === pet.value.bairro)) return true
  return avistamentos.value.some(a => BAIRROS_BOA_VISTA.find(b => b.nome === a.bairro))
})

const avistsPorBairro = computed(() => {
  const mapa = {}
  for (const a of avistamentos.value) {
    if (!a.bairro) continue
    if (!mapa[a.bairro] || new Date(a.criado_em) > new Date(mapa[a.bairro].criado_em)) {
      mapa[a.bairro] = a
    }
  }
  return mapa
})

// ── dados ──────────────────────────────────────────────────────
async function carregarPet(id) {
  if (miniMap) { miniMap.remove(); miniMap = null }
  loading.value      = true
  erro.value         = null
  pet.value          = null
  nearby.value       = []
  avistamentos.value = []
  try {
    const [petResp, avistsResp] = await Promise.all([
      http.get(`/pets/${id}`),
      http.get(`/pets/${id}/avistamentos`).catch(() => ({ data: [] })),
    ])
    pet.value          = petResp.data
    avistamentos.value = Array.isArray(avistsResp.data) ? avistsResp.data : []

    if (petResp.data.bairro) {
      const { data: todos } = await http.get('/pets')
      nearby.value = todos
        .filter(p => p.id !== petResp.data.id && p.bairro === petResp.data.bairro)
        .slice(0, 6)
    }
  } catch (e) {
    erro.value = e
  } finally {
    loading.value = false
  }

  if (pet.value) {
    await nextTick()
    iniciarMiniMapa()
  }
}

// ── mapa ───────────────────────────────────────────────────────
function iniciarMiniMapa() {
  if (!pet.value || !window.L || !miniMapEl.value) return
  if (miniMap) { miniMap.remove(); miniMap = null }

  const lat   = pet.value.latitude  ? parseFloat(pet.value.latitude)  : null
  const lng   = pet.value.longitude ? parseFloat(pet.value.longitude) : null
  const exato = !!(lat && lng)

  let petLat = lat, petLng = lng
  if (!exato && pet.value.bairro) {
    const b = BAIRROS_BOA_VISTA.find(b => b.nome === pet.value.bairro)
    if (b) { petLat = b.lat; petLng = b.lng }
  }

  // Se pet não tem localização, centrar no primeiro bairro de avistamento
  const avistsEntries = Object.entries(avistsPorBairro.value)
  let centroLat = petLat, centroLng = petLng
  if (!centroLat && avistsEntries.length > 0) {
    const b = BAIRROS_BOA_VISTA.find(b => b.nome === avistsEntries[0][0])
    if (b) { centroLat = b.lat; centroLng = b.lng }
  }
  if (!centroLat) return

  const L = window.L
  miniMap = L.map(miniMapEl.value, {
    zoomControl: true, attributionControl: false,
    dragging: true, scrollWheelZoom: true, doubleClickZoom: true,
  }).setView([centroLat, centroLng], exato ? 16 : 14)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(miniMap)

  const allLatLngs = []

  // ── marcador principal do pet ────────────────────────────────
  if (petLat) {
    const emoji     = avatarEmoji(pet.value.especie)
    const foto      = parsePrimeiraFoto(pet.value.foto_url)
    const markerHtml = foto
      ? `<div style="width:44px;height:44px;border-radius:50%;border:2.5px solid #7C3AED;overflow:hidden;background:#EDE9FE;box-shadow:0 2px 8px rgba(124,58,237,0.4);"><img src="${foto}" style="width:100%;height:100%;object-fit:cover;" /></div>`
      : `<div style="width:44px;height:44px;border-radius:50%;border:2.5px solid #7C3AED;background:#EDE9FE;display:flex;align-items:center;justify-content:center;font-size:1.3rem;box-shadow:0 2px 8px rgba(124,58,237,0.4);">${emoji}</div>`
    L.marker([petLat, petLng], {
      icon: L.divIcon({ html: markerHtml, className: '', iconSize: [44, 44], iconAnchor: [22, 22] }),
    }).addTo(miniMap)
    allLatLngs.push([petLat, petLng])
  }

  // ── marcadores de avistamento ────────────────────────────────
  for (const [bairro, avist] of avistsEntries) {
    const bairroData = BAIRROS_BOA_VISTA.find(b => b.nome === bairro)
    if (!bairroData) continue

    const mesmoBairro = bairro === pet.value.bairro
    let avLat = bairroData.lat
    let avLng = bairroData.lng

    // Mesmo bairro sem GPS exato: desloca levemente para não sobrepor
    if (mesmoBairro && !exato) {
      avLat += 0.0005
      avLng += 0.0005
    }

    const dataFormatada = avist.criado_em
      ? new Date(avist.criado_em).toLocaleDateString('pt-BR')
      : '—'
    const localLabel = mesmoBairro
      ? `mesmo bairro${avist.rua ? ' · ' + avist.rua : ''}`
      : `${bairro}${avist.rua ? ' · ' + avist.rua : ''}`

    const popupHtml = `
      <div style="min-width:160px;font-family:Nunito,sans-serif;">
        <p style="font-weight:900;font-size:0.85rem;color:#92400E;margin:0 0 3px;">Avistamento</p>
        <p style="font-size:0.76rem;color:#7C3AED;font-weight:700;margin:0 0 2px;">${localLabel}</p>
        <p style="font-size:0.72rem;color:#A099B0;margin:0 0 6px;">${dataFormatada}${avist.nome_usuario ? ' · ' + avist.nome_usuario : ''}</p>
        ${avist.descricao ? `<p style="font-size:0.75rem;color:#1A1626;margin:0;line-height:1.4;">${avist.descricao}</p>` : ''}
      </div>`

    const sightingHtml = `<div style="width:36px;height:36px;border-radius:50%;border:2.5px solid #F59E0B;background:#FFFBEB;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:900;color:#92400E;box-shadow:0 2px 6px rgba(245,158,11,0.45);">!</div>`

    L.marker([avLat, avLng], {
      icon: L.divIcon({ html: sightingHtml, className: '', iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -22] }),
    }).bindPopup(popupHtml).addTo(miniMap)

    allLatLngs.push([avLat, avLng])
  }

  // Ajusta o zoom para mostrar todos os marcadores
  if (allLatLngs.length > 1) {
    miniMap.fitBounds(allLatLngs, { padding: [32, 32], maxZoom: 15 })
  }
}

onMounted(() => carregarPet(route.params.id))

watch(() => route.params.id, (id) => { if (id) carregarPet(id) })

onBeforeUnmount(() => { if (miniMap) { miniMap.remove(); miniMap = null } })


</script>

<template>
  <div class="page">
    <div class="flex items-center gap-2 mb-4">
      <button class="btn-ghost text-xs flex items-center gap-1" @click="router.back()">
        <ArrowLeft :size="14" /> Voltar
      </button>
      <template v-if="isOwner">
        <RouterLink :to="'/pet/' + route.params.id + '/editar'" class="btn-ghost text-xs flex items-center gap-1 ml-auto">
          <Pencil :size="13" /> Editar
        </RouterLink>
        <button class="text-xs flex items-center gap-1 font-bold px-3 py-1.5 rounded-lg transition-colors" style="color:#DC2626;background:#FEE2E2;" @click="excluir">
          <Trash2 :size="13" /> Excluir
        </button>
      </template>
    </div>

    <div v-if="loading" class="text-center py-20 text-neutral-400 font-semibold">Carregando...</div>
    <div v-else-if="erro" class="insight-critical">Não foi possível carregar os dados do pet.</div>

    <template v-else-if="pet">

      <!-- ── TOPO: foto + info lado a lado ───────────────── -->
      <div class="topo-section card mb-4">

        <!-- Foto / Carousel -->
        <PetPhotoCarousel :fotos="fotos" :alt="pet.nome" />

        <!-- Info ao lado da foto -->
        <div class="info-lado">
          <!-- Nome + status -->
          <div class="flex items-start gap-2 flex-wrap mb-3">
            <h2 class="pet-nome">{{ pet.nome }}</h2>
            <span :class="pet.status === 'perdido' ? 'badge-red' : 'badge-green'" style="font-size:0.72rem;flex-shrink:0;margin-top:3px;">
              {{ pet.status }}
            </span>
          </div>

          <!-- Grid de cards de info -->
          <div class="icard-grid">
            <div class="icard">
              <span class="icard-label"><PawPrint :size="11" style="color:#7C3AED;" /> Espécie</span>
              <p class="icard-val">{{ pet.especie }}</p>
              <p v-if="pet.raca" class="icard-sub">{{ pet.raca }}</p>
            </div>

            <div class="icard">
              <span class="icard-label"><MapPin :size="11" style="color:#7C3AED;" /> Bairro</span>
              <p class="icard-val">{{ pet.bairro || '—' }}</p>
              <p v-if="pet.cidade" class="icard-sub">{{ pet.cidade }}</p>
            </div>

            <div class="icard">
              <span class="icard-label"><Calendar :size="11" style="color:#7C3AED;" /> Perda</span>
              <p class="icard-val">{{ formatarData(pet.data_perda) }}</p>
            </div>

            <div v-if="pet.recompensa" class="icard" style="border-color:#F59E0B;background:#FFFBEB;">
              <span class="icard-label" style="color:#92400E;"><Gift :size="11" style="color:#F59E0B;" /> Recompensa</span>
              <p class="icard-val" style="color:#92400E;">
                {{ pet.valor_recompensa ? 'R$ ' + pet.valor_recompensa : 'Sim' }}
              </p>
            </div>

            <div v-if="pet.cor" class="icard">
              <span class="icard-label"><Tag :size="11" style="color:#7C3AED;" /> Cor</span>
              <p class="icard-val">{{ pet.cor }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── DESCRIÇÃO ─────────────────────────────────────── -->
      <div v-if="pet.descricao" class="card mb-4" style="background:#F7F5FB;">
        <p class="text-xs font-bold mb-1" style="color:#A099B0;">Descrição</p>
        <p class="text-sm font-semibold" style="color:#1A1626;line-height:1.6;">{{ pet.descricao }}</p>
      </div>

      <!-- ── MAPA + CONTATOS lado a lado ───────────────────── -->
      <div
        v-if="temLocalizacao || (pet.contatos && parseContatos(pet.contatos).length > 0)"
        class="mapa-contato-row mb-5"
      >

        <!-- Mini mapa -->
        <div v-if="temLocalizacao" class="card mapa-col" style="padding:0;overflow:hidden;">
          <div class="flex items-center gap-2 px-4 py-3" style="border-bottom:1px solid #F0EBF8;">
            <MapPin :size="13" style="color:#7C3AED;" />
            <p class="text-xs font-bold" style="color:#A099B0;">Localização</p>
            <span v-if="!pet.latitude" class="text-xs" style="color:#C4BAD4;">— aprox.</span>
            <template v-if="Object.keys(avistsPorBairro).length > 0">
              <span style="margin-left:auto;display:flex;align-items:center;gap:5px;">
                <span style="width:10px;height:10px;border-radius:50%;background:#FFFBEB;border:2px solid #F59E0B;display:inline-block;flex-shrink:0;"></span>
                <span class="text-xs font-bold" style="color:#92400E;">
                  {{ Object.keys(avistsPorBairro).length }} avistamento{{ Object.keys(avistsPorBairro).length > 1 ? 's' : '' }}
                </span>
              </span>
            </template>
          </div>
          <div ref="miniMapEl" :style="{ height: soMapa ? '300px' : '200px', width: '100%', isolation: 'isolate' }" />
        </div>

        <!-- Contatos -->
        <div
          v-if="pet.contatos && parseContatos(pet.contatos).length > 0"
          class="card contato-col"
        >
          <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color:#A099B0;">Entre em contato</p>
          <div class="flex flex-col gap-3">
            <ContactItem
              v-for="(c, idx) in parseContatos(pet.contatos)"
              :key="idx"
              :contato="c"
            />
          </div>
        </div>

      </div>

      <!-- ── HISTÓRICO DE AVISTAMENTOS ─────────────────── -->
      <div v-if="avistamentos.length > 0" class="card mb-4">
        <div class="flex items-center gap-2 mb-4">
          <Clock :size="14" style="color:#7C3AED;" />
          <p class="text-xs font-bold uppercase tracking-widest" style="color:#A099B0;">Histórico de avistamentos</p>
          <span class="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style="background:#EDE9FE;color:#7C3AED;">{{ avistamentos.length }}</span>
        </div>
        <div class="historico-list">
          <div
            v-for="(a, i) in avistamentos"
            :key="a.id || i"
            class="historico-item"
          >
            <div class="historico-dot" />
            <div class="historico-body">
              <div class="flex items-center gap-2 flex-wrap mb-0.5">
                <span class="text-xs font-black" style="color:#1A1626;">
                  {{ a.bairro || 'Local não informado' }}{{ a.rua ? ' · ' + a.rua : '' }}
                </span>
                <span v-if="a.nome_usuario" class="text-xs font-semibold" style="color:#A099B0;">por {{ a.nome_usuario }}</span>
              </div>
              <p v-if="a.descricao" class="text-xs font-semibold mb-1" style="color:#6B6578;line-height:1.5;">{{ a.descricao }}</p>
              <p class="text-xs" style="color:#C4BAD4;">{{ formatarData(a.criado_em) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── PETS PRÓXIMOS ───────────────────────────────── -->
      <div v-if="nearby.length > 0" class="mb-4">
        <p class="text-xs font-bold uppercase tracking-widest mb-3" style="color:#A099B0;">
          Outros pets em {{ pet.bairro }}
        </p>
        <div class="nearby-scroll">
          <RouterLink
            v-for="p in nearby" :key="p.id"
            :to="'/pet/' + p.id"
            class="nearby-card"
          >
            <div class="nearby-thumb">
              <img v-if="parsePrimeiraFoto(p.foto_url)" :src="parsePrimeiraFoto(p.foto_url)" :alt="p.nome" style="width:100%;height:100%;object-fit:cover;" />
              <PawPrint v-else :size="28" style="color:#9B89C4;opacity:0.4;" />
            </div>
            <p class="nearby-nome">{{ p.nome }}</p>
            <p class="nearby-esp">{{ p.especie }}</p>
          </RouterLink>
        </div>
      </div>

    </template>
  </div>
</template>

<style scoped>
/* ── Topo: foto + info ─────────────────────────────────── */
.topo-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}



/* ── Info ao lado ─────────────────────────────────────── */
.info-lado {
  flex: 1;
  min-width: 0;
}
.pet-nome {
  font-size: 1.45rem;
  font-weight: 900;
  color: #1A1626;
  line-height: 1.15;
  margin: 0;
}

.icard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.icard {
  background: #F7F5FB;
  border-radius: 12px;
  padding: 9px 11px;
}
.icard-label {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #A099B0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}
.icard-val {
  font-size: 0.82rem;
  font-weight: 900;
  color: #1A1626;
  text-transform: capitalize;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icard-sub {
  font-size: 0.7rem;
  font-weight: 600;
  color: #6B6578;
  margin: 1px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Mapa + contatos lado a lado ─────────────────────── */
.mapa-contato-row {
  display: flex;
  gap: 16px;
  align-items: stretch;
}
.mapa-col {
  flex: 1;
  min-width: 0;
}
.contato-col {
  flex: 1;
  min-width: 0;
}
@media (max-width: 600px) {
  .mapa-contato-row { flex-direction: column; }
}

/* ── Nearby ───────────────────────────────────────────── */
.nearby-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.nearby-scroll::-webkit-scrollbar { display: none; }

.nearby-card {
  flex-shrink: 0;
  width: 88px;
  text-decoration: none;
}
.nearby-thumb {
  width: 88px; height: 88px;
  border-radius: 12px; overflow: hidden;
  background: #EDE9FE;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 5px;
  transition: transform .15s, box-shadow .15s;
}
.nearby-card:hover .nearby-thumb {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(124,58,237,0.2);
}
.nearby-nome {
  font-size: 0.75rem; font-weight: 900; color: #1A1626;
  margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.nearby-esp {
  font-size: 0.67rem; font-weight: 600; color: #A099B0;
  margin: 0; text-transform: capitalize;
}

/* ── Histórico ────────────────────────────────────────── */
.historico-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.historico-item {
  display: flex;
  gap: 12px;
  position: relative;
  padding-bottom: 16px;
}
.historico-item:last-child { padding-bottom: 0; }
.historico-item:last-child .historico-dot::after { display: none; }
.historico-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #7C3AED;
  flex-shrink: 0;
  margin-top: 3px;
  position: relative;
}
.historico-dot::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 4px;
  width: 2px;
  bottom: -16px;
  background: #E5E0F0;
}
.historico-body { flex: 1; min-width: 0; }

/* ── Responsivo ───────────────────────────────────────── */
@media (max-width: 500px) {
  .topo-section { flex-direction: column; align-items: stretch; }
  /* .foto-wrap responsive now handled by PetPhotoCarousel */
}
</style>
