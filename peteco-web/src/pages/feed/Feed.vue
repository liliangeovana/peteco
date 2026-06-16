<script setup>
import { reactive, onMounted } from 'vue'
import { PawPrint } from 'lucide-vue-next'
import { usePets } from '../../modules/pet/controllers/usePets.js'
import { useAuth } from '../../modules/auth/controllers/useAuth.js'
import PetCard from '../../components/PetCard.vue'

const { usuario } = useAuth()
const filtros = reactive({ nome: '', especie: '' })
const { pets, loading, buscar } = usePets({ bairroUsuario: usuario.value?.bairro || '' })

onMounted(() => buscar({ status: 'perdido' }))

async function aplicarFiltros() {
  await buscar({ ...filtros, status: 'perdido' })
}

function limpar() {
  filtros.nome = ''
  filtros.especie = ''
  buscar({ status: 'perdido' })
}
</script>

<template>
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h2>Feed de Pets</h2>
        <p class="text-sm font-semibold mt-0.5" style="color:#6B6578">
          Pets perdidos em Boa Vista
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
      <PawPrint :size="48" style="color:#C4BAD4;margin:0 auto 16px;" />
      <p class="font-black text-neutral-600 mb-1">Nenhum pet encontrado</p>
      <p class="text-sm text-neutral-400 font-semibold">Tente ajustar os filtros de busca.</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <PetCard
        v-for="pet in pets"
        :key="pet.id"
        :pet="pet"
        :bairro-usuario="usuario?.bairro || ''"
      />
    </div>
  </div>
</template>
