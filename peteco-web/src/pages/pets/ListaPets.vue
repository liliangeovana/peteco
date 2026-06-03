<script setup>
import { ref, onMounted } from 'vue'
import { buscarCep } from '../../composables/useCep.js'
import { PawPrint, Search, X } from 'lucide-vue-next'
import { usePets } from '../../modules/pet/controllers/usePets.js'

const { pets, loading, buscar } = usePets()
const filtros     = ref({ nome: '', especie: '', cidade: '' })
const cep         = ref('')
const buscandoCep = ref(false)
const infoCep     = ref(null)

const filtrar = () => buscar(filtros.value)

const handleCep = async () => {
  const nums = cep.value.replace(/\D/g, '')
  if (nums.length !== 8) return
  buscandoCep.value = true
  try {
    infoCep.value = await buscarCep(nums)
    filtros.value.cidade = infoCep.value.cidade
    await filtrar()
  } catch {
    infoCep.value = null
  } finally {
    buscandoCep.value = false
  }
}

const limpar = () => {
  filtros.value = { nome: '', especie: '', cidade: '' }
  cep.value = ''
  infoCep.value = null
  filtrar()
}

onMounted(filtrar)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Pets Perdidos</h2>
      <span class="badge-red">{{ pets.length }} resultado{{ pets.length !== 1 ? 's' : '' }}</span>
    </div>

    <!-- Formulário de filtros -->
    <form class="card mb-5 flex flex-wrap gap-3 items-end" @submit.prevent="filtrar">
      <div class="field flex-1 min-w-36">
        <label class="label">Nome do pet</label>
        <input v-model="filtros.nome" class="input" placeholder="Rex, Luna..." />
      </div>
      <div class="field min-w-36">
        <label class="label">Espécie</label>
        <select v-model="filtros.especie" class="input">
          <option value="">Todas</option>
          <option value="cachorro">Cachorro</option>
          <option value="gato">Gato</option>
          <option value="outro">Outro</option>
        </select>
      </div>
      <div class="field min-w-32">
        <label class="label">Cidade</label>
        <input v-model="filtros.cidade" class="input" placeholder="Boa Vista" />
      </div>
      <div class="field min-w-28">
        <label class="label">Filtrar por CEP</label>
        <div class="flex items-center gap-2">
          <input
            v-model="cep"
            class="input w-32"
            placeholder="00000-000"
            maxlength="9"
            @input="cep = cep.replace(/\D/g,'').replace(/(\d{5})(\d)/,'$1-$2')"
            @blur="handleCep"
          />
          <span v-if="buscandoCep" class="text-xs text-neutral-400">buscando...</span>
        </div>
        <span v-if="infoCep" class="text-xs font-semibold mt-1" style="color:#7C3AED">
          {{ infoCep.bairro }}, {{ infoCep.cidade }} — {{ infoCep.uf }}
        </span>
      </div>
      <button type="submit" class="btn-primary">
        <Search :size="14" /> Filtrar
      </button>
      <button type="button" class="btn-ghost" @click="limpar">
        <X :size="14" /> Limpar
      </button>
    </form>

    <!-- Tabela -->
    <div class="card p-0 overflow-hidden">
      <div v-if="loading" class="text-center py-16 text-neutral-400 font-semibold">Carregando...</div>
      <div v-else-if="pets.length === 0" class="text-center py-16 text-neutral-400 font-semibold">
        Nenhum pet encontrado com os filtros selecionados.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="table-peteco">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Espécie / Raça</th>
              <th>Bairro</th>
              <th>Cidade</th>
              <th>Data perda</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pet in pets" :key="pet.id">
              <td>
                <img
                  v-if="pet.foto_url"
                  :src="pet.foto_url"
                  :alt="pet.nome"
                  class="w-10 h-10 object-cover rounded-lg"
                />
                <div v-else class="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <PawPrint :size="18" style="color:#7C3AED" />
                </div>
              </td>
              <td class="font-bold text-neutral-900">{{ pet.nome }}</td>
              <td class="capitalize">{{ pet.especie }}{{ pet.raca ? ' · ' + pet.raca : '' }}</td>
              <td>{{ pet.bairro || '—' }}</td>
              <td>{{ pet.cidade || '—' }}</td>
              <td>{{ pet.data_perda ? new Date(pet.data_perda).toLocaleDateString('pt-BR') : '—' }}</td>
              <td>
                <span :class="pet.status === 'perdido' ? 'badge-red' : 'badge-green'">
                  {{ pet.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
