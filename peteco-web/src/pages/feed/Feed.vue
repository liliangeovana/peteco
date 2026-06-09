<script setup>
import { reactive, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { MapPin } from 'lucide-vue-next'
import { usePets } from '../../modules/pet/controllers/usePets.js'

const filtros = reactive({ nome: '', especie: '', status: '' })
const { pets, loading, buscar } = usePets()

onMounted(() => buscar())

async function aplicarFiltros() {
  await buscar({ ...filtros })
}

function limpar() {
  filtros.nome = ''
  filtros.especie = ''
  filtros.status = ''
  buscar()
}

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
    <!-- Header -->
    <div class="page-header">
      <div>
        <h2>Feed de Pets</h2>
        <p class="text-sm font-semibold mt-0.5" style="color:#6B6578">
          Pets perdidos e encontrados em Boa Vista
        </p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="flex flex-wrap gap-3 items-end">
        <div class="flex-1 min-w-[180px]">
          <label class="block text-xs font-bold mb-1" style="color:#6B6578">Nome</label>
          <input
            v-model="filtros.nome"
            type="text"
            placeholder="Buscar por nome..."
            class="input w-full"
            @keyup.enter="aplicarFiltros"
          />
        </div>
        <div class="min-w-[140px]">
          <label class="block text-xs font-bold mb-1" style="color:#6B6578">Espécie</label>
          <select v-model="filtros.especie" class="input w-full">
            <option value="">Todas</option>
            <option value="cachorro">Cachorro</option>
            <option value="gato">Gato</option>
            <option value="outro">Outro</option>
          </select>
        </div>
        <div class="min-w-[140px]">
          <label class="block text-xs font-bold mb-1" style="color:#6B6578">Status</label>
          <select v-model="filtros.status" class="input w-full">
            <option value="">Todos</option>
            <option value="perdido">Perdido</option>
            <option value="encontrado">Encontrado</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button class="btn-primary" @click="aplicarFiltros">Filtrar</button>
          <button class="btn-ghost" @click="limpar">Limpar</button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-neutral-400 font-semibold">
      Carregando pets...
    </div>

    <!-- Empty -->
    <div v-else-if="!pets.length" class="card text-center py-16">
      <p class="text-4xl mb-4">🐾</p>
      <p class="font-black text-neutral-600 mb-1">Nenhum pet encontrado</p>
      <p class="text-sm text-neutral-400 font-semibold">Tente ajustar os filtros de busca.</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <RouterLink
        v-for="pet in pets"
        :key="pet.id"
        :to="'/pet/' + pet.id"
        class="card p-0 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer no-underline block"
        style="text-decoration:none;"
      >
        <!-- Foto / Avatar -->
        <div style="aspect-ratio:1;overflow:hidden;border-radius:0;position:relative;">
          <img
            v-if="parseFotoUrl(pet.foto_url)"
            :src="parseFotoUrl(pet.foto_url)"
            :alt="pet.nome"
            style="width:100%;height:100%;object-fit:cover;"
          />
          <div
            v-else
            style="width:100%;height:100%;background:#EDE9FE;display:flex;align-items:center;justify-content:center;font-size:3.5rem;"
          >
            {{ avatarEmoji(pet.especie) }}
          </div>
        </div>

        <!-- Body -->
        <div class="p-4">
          <div class="flex items-start justify-between gap-2 mb-1">
            <p class="font-black text-neutral-800 truncate text-base leading-snug">{{ pet.nome }}</p>
            <span :class="pet.status === 'perdido' ? 'badge-red' : 'badge-green'" style="flex-shrink:0;font-size:9px">
              {{ pet.status }}
            </span>
          </div>
          <p class="text-xs font-semibold mb-2 truncate" style="color:#A099B0;">
            {{ pet.especie }}{{ pet.raca ? ' · ' + pet.raca : '' }}
          </p>
          <div v-if="pet.bairro" class="flex items-center gap-1 text-xs font-semibold" style="color:#6B6578;">
            <MapPin :size="11" />
            <span class="truncate">{{ pet.bairro }}</span>
          </div>
          <p v-if="pet.data_perda" class="text-xs font-semibold mt-1" style="color:#A099B0;">
            {{ formatarData(pet.data_perda) }}
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
