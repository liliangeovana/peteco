<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { PawPrint, Plus, RefreshCw } from 'lucide-vue-next'
import { useMeusPets } from '../../modules/pet/controllers/useMeusPets.js'
import PetCard from '../../components/PetCard.vue'

const { petsFiltrados, loading, filtro, stats, carregar } = useMeusPets()

const lista   = computed(() => petsFiltrados())
const contagem = computed(() => stats())
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Meus pets</h2>
      <div class="flex gap-2">
        <button class="btn-ghost text-xs" @click="carregar">
          <RefreshCw :size="13" /> Atualizar
        </button>
        <RouterLink to="/cadastrar" class="btn-primary text-sm">
          <Plus :size="14" /> Cadastrar pet
        </RouterLink>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3 mb-5">
      <div class="card py-3 text-center border-t-4" style="border-top-color:#7C3AED">
        <p class="text-2xl font-black" style="color:#7C3AED">{{ contagem.total }}</p>
        <p class="text-xs text-neutral-500 font-semibold mt-0.5">Total</p>
      </div>
      <div class="card py-3 text-center border-t-4" style="border-top-color:#E63946">
        <p class="text-2xl font-black" style="color:#E63946">{{ contagem.perdidos }}</p>
        <p class="text-xs text-neutral-500 font-semibold mt-0.5">Perdidos</p>
      </div>
      <div class="card py-3 text-center border-t-4" style="border-top-color:#2EBD7A">
        <p class="text-2xl font-black" style="color:#2EBD7A">{{ contagem.encontrados }}</p>
        <p class="text-xs text-neutral-500 font-semibold mt-0.5">Encontrados</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex gap-2 mb-5">
      <button
        v-for="f in [
          { key: 'todos',      label: 'Todos' },
          { key: 'perdido',    label: 'Perdidos' },
          { key: 'encontrado', label: 'Encontrados' },
        ]"
        :key="f.key"
        :class="['chip', filtro === f.key ? 'chip-ativo' : '']"
        @click="filtro = f.key"
        type="button"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-16 text-neutral-400 font-semibold">Carregando...</div>

    <template v-else-if="lista.length === 0">
      <div class="text-center py-20">
        <PawPrint :size="48" class="mx-auto mb-3 text-neutral-200" />
        <p class="font-bold text-neutral-500 mb-1">Nenhum pet cadastrado</p>
        <RouterLink to="/cadastrar" class="btn-primary mt-4 inline-flex">
          <Plus :size="14" /> Cadastrar pet perdido
        </RouterLink>
      </div>
    </template>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <PetCard
        v-for="pet in lista"
        :key="pet.id"
        :pet="pet"
        :show-status="true"
      />
    </div>
  </div>
</template>

<style scoped>
.chip {
  flex: 1;
  border: 1.5px solid #E5E0F0;
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6B6578;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}
.chip-ativo {
  background: #7C3AED;
  border-color: #7C3AED;
  color: #fff;
}
</style>
