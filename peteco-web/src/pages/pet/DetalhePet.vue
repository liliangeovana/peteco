<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ArrowLeft, MapPin, Calendar, PawPrint, Tag } from 'lucide-vue-next'
import { http } from '../../client/http.js'

const route = useRoute()
const router = useRouter()
const pet = ref(null)
const nearby = ref([])
const loading = ref(true)
const erro = ref(null)

onMounted(async () => {
  try {
    const { data } = await http.get(`/pets/${route.params.id}`)
    pet.value = data

    // Fetch nearby pets (same bairro), exclude current
    if (data.bairro || data.especie) {
      const params = new URLSearchParams()
      if (data.especie) params.append('especie', data.especie)
      const { data: todos } = await http.get(`/pets?${params}`)

      nearby.value = todos
        .filter(p => p.id !== data.id && p.bairro === data.bairro)
        .slice(0, 6)

      // If less than 3, add from same especie different bairro
      if (nearby.value.length < 3) {
        const extras = todos
          .filter(p => p.id !== data.id && p.bairro !== data.bairro)
          .slice(0, 6 - nearby.value.length)
        nearby.value = [...nearby.value, ...extras]
      }
    }
  } catch (e) {
    erro.value = e
  } finally {
    loading.value = false
  }
})

function formatarData(d) {
  if (!d) return '—'
  const dt = new Date(d)
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('pt-BR')
}

function avatarEmoji(especie) {
  return especie === 'cachorro' ? '🐶' : especie === 'gato' ? '🐱' : '🐾'
}

function parseFotoUrl(foto_url) {
  if (!foto_url) return null
  if (foto_url.startsWith('[')) {
    try {
      const arr = JSON.parse(foto_url)
      return Array.isArray(arr) && arr.length > 0 ? arr[0] : null
    } catch { return null }
  }
  return foto_url
}
</script>

<template>
  <div class="page">
    <!-- Back -->
    <button class="btn-ghost text-xs mb-4 flex items-center gap-1" @click="router.back()">
      <ArrowLeft :size="14" /> Voltar
    </button>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-neutral-400 font-semibold">
      Carregando...
    </div>

    <!-- Error -->
    <div v-else-if="erro" class="insight-critical">
      Não foi possível carregar os dados do pet.
    </div>

    <!-- Pet detail -->
    <template v-else-if="pet">
      <div class="card mb-6" style="display:flex;flex-wrap:wrap;gap:28px;align-items:flex-start;">
        <!-- Photo / Avatar -->
        <div style="width:280px;max-width:100%;flex-shrink:0;">
          <div style="border-radius:20px;overflow:hidden;aspect-ratio:1;background:#EDE9FE;display:flex;align-items:center;justify-content:center;">
            <img
              v-if="parseFotoUrl(pet.foto_url)"
              :src="parseFotoUrl(pet.foto_url)"
              :alt="pet.nome"
              style="width:100%;height:100%;object-fit:cover;"
            />
            <span v-else style="font-size:5rem;">{{ avatarEmoji(pet.especie) }}</span>
          </div>
        </div>

        <!-- Info -->
        <div style="flex:1;min-width:220px;">
          <div class="flex items-center gap-3 mb-2 flex-wrap">
            <h2 style="font-size:1.75rem;font-weight:900;color:#1A1626;line-height:1.1;">{{ pet.nome }}</h2>
            <span :class="pet.status === 'perdido' ? 'badge-red' : 'badge-green'">
              {{ pet.status }}
            </span>
          </div>

          <div class="flex flex-col gap-3 mt-4">
            <!-- Especie/raca -->
            <div class="flex items-start gap-2">
              <PawPrint :size="16" style="color:#7C3AED;flex-shrink:0;margin-top:2px;" />
              <div>
                <p class="text-xs font-bold" style="color:#A099B0;">Espécie / Raça</p>
                <p class="font-bold text-sm" style="color:#1A1626;">
                  {{ pet.especie }}{{ pet.raca ? ' · ' + pet.raca : '' }}
                </p>
              </div>
            </div>

            <!-- Localização -->
            <div class="flex items-start gap-2">
              <MapPin :size="16" style="color:#7C3AED;flex-shrink:0;margin-top:2px;" />
              <div>
                <p class="text-xs font-bold" style="color:#A099B0;">Localização</p>
                <p class="font-bold text-sm" style="color:#1A1626;">
                  {{ pet.bairro || '—' }}{{ pet.cidade ? ', ' + pet.cidade : '' }}
                </p>
              </div>
            </div>

            <!-- Data de perda -->
            <div class="flex items-start gap-2">
              <Calendar :size="16" style="color:#7C3AED;flex-shrink:0;margin-top:2px;" />
              <div>
                <p class="text-xs font-bold" style="color:#A099B0;">Data de perda</p>
                <p class="font-bold text-sm" style="color:#1A1626;">{{ formatarData(pet.data_perda) }}</p>
              </div>
            </div>

            <!-- Cor -->
            <div v-if="pet.cor" class="flex items-start gap-2">
              <Tag :size="16" style="color:#7C3AED;flex-shrink:0;margin-top:2px;" />
              <div>
                <p class="text-xs font-bold" style="color:#A099B0;">Cor</p>
                <p class="font-bold text-sm" style="color:#1A1626;">{{ pet.cor }}</p>
              </div>
            </div>

            <!-- Descrição -->
            <div v-if="pet.descricao" class="card mt-2" style="background:#F7F5FB;">
              <p class="text-xs font-bold mb-1" style="color:#A099B0;">Descrição</p>
              <p class="text-sm font-semibold" style="color:#1A1626;line-height:1.6;">{{ pet.descricao }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Nearby pets -->
      <div v-if="nearby.length > 0">
        <h3 class="font-black text-neutral-800 mb-4">
          Pets próximos — {{ pet.bairro || 'mesma região' }}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <RouterLink
            v-for="p in nearby"
            :key="p.id"
            :to="'/pet/' + p.id"
            class="card p-0 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer block"
            style="text-decoration:none;"
          >
            <div style="aspect-ratio:1;overflow:hidden;">
              <img
                v-if="parseFotoUrl(p.foto_url)"
                :src="parseFotoUrl(p.foto_url)"
                :alt="p.nome"
                style="width:100%;height:100%;object-fit:cover;"
              />
              <div
                v-else
                style="
                  width:100%;height:100%;
                  background:#EDE9FE;
                  display:flex;align-items:center;justify-content:center;
                  font-size:3rem;
                "
              >
                {{ avatarEmoji(p.especie) }}
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-start justify-between gap-2 mb-1">
                <p class="font-black text-neutral-800 truncate">{{ p.nome }}</p>
                <span :class="p.status === 'perdido' ? 'badge-red' : 'badge-green'" style="flex-shrink:0;font-size:9px;">
                  {{ p.status }}
                </span>
              </div>
              <p class="text-xs font-semibold truncate" style="color:#A099B0;">
                {{ p.especie }}{{ p.raca ? ' · ' + p.raca : '' }}
              </p>
              <div v-if="p.bairro" class="flex items-center gap-1 text-xs font-semibold mt-1" style="color:#6B6578;">
                <MapPin :size="11" />
                <span class="truncate">{{ p.bairro }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>
