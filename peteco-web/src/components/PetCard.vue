<script setup>
import { RouterLink } from 'vue-router'
import { MapPin, PawPrint } from 'lucide-vue-next'
import { useParseFoto } from '../composables/useParseFoto.js'
import { useFormatarData } from '../composables/useFormatarData.js'

const { parsePrimeiraFoto } = useParseFoto()
const { formatarData } = useFormatarData()

const props = defineProps({
  pet: {
    type: Object,
    required: true,
  },
  bairroUsuario: {
    type: String,
    default: '',
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <RouterLink
    :to="'/pet/' + pet.id"
    class="card p-0 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer no-underline block"
    style="text-decoration:none;"
  >
    <!-- Foto / Avatar -->
    <div style="aspect-ratio:1;overflow:hidden;border-radius:0;position:relative;">
      <img
        v-if="parsePrimeiraFoto(pet.foto_url)"
        :src="parsePrimeiraFoto(pet.foto_url)"
        :alt="pet.nome"
        style="width:100%;height:100%;object-fit:cover;"
      />
      <div
        v-else
        style="width:100%;height:100%;background:#EDE9FE;display:flex;align-items:center;justify-content:center;"
      >
        <PawPrint :size="52" style="color:#9B89C4;opacity:0.4;" />
      </div>
    </div>

    <!-- Body -->
    <div class="p-4">
      <div class="flex items-start mb-1">
        <p class="font-black text-neutral-800 truncate text-base leading-snug">{{ pet.nome }}</p>
        <span
          v-if="showStatus && pet.status"
          :class="pet.status === 'perdido' ? 'badge-red' : 'badge-green'"
          class="ml-2 flex-shrink-0 mt-0.5"
          style="font-size:0.65rem;"
        >{{ pet.status }}</span>
      </div>
      <p class="text-xs font-semibold mb-2 truncate" style="color:#A099B0;">
        {{ pet.especie }}{{ pet.raca ? ' · ' + pet.raca : '' }}
      </p>
      <div v-if="pet.bairro" class="flex items-center gap-1 text-xs font-semibold" style="color:#6B6578;">
        <MapPin :size="11" />
        <span class="truncate">{{ pet.bairro }}</span>
        <span
          v-if="bairroUsuario && pet.bairro === bairroUsuario"
          class="ml-1 px-1.5 py-0.5 rounded-full text-white font-bold"
          style="font-size:9px;background:#7C3AED;flex-shrink:0;"
        >Seu bairro</span>
      </div>
      <p v-if="pet.data_perda" class="text-xs font-semibold mt-1" style="color:#A099B0;">
        {{ formatarData(pet.data_perda) }}
      </p>
    </div>
  </RouterLink>
</template>
