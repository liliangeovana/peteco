<script setup>
import { ref } from 'vue'
import { ChevronLeft, ChevronRight, PawPrint } from 'lucide-vue-next'

defineProps({
  fotos: {
    type: Array,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
})

const fotoAtual    = ref(0)
const imgCarregada = ref(false)

function fotoAnterior(total) {
  imgCarregada.value = false
  fotoAtual.value = (fotoAtual.value - 1 + total) % total
}
function proxFoto(total) {
  imgCarregada.value = false
  fotoAtual.value = (fotoAtual.value + 1) % total
}
function irFoto(i) {
  if (i !== fotoAtual.value) {
    imgCarregada.value = false
    fotoAtual.value = i
  }
}
</script>

<template>
  <div class="foto-wrap">
    <template v-if="fotos.length > 0">
      <!-- Skeleton -->
      <div v-if="!imgCarregada" class="foto-skeleton">
        <PawPrint :size="44" style="color:#9B89C4;opacity:0.35;" />
        <p style="font-size:0.68rem;color:#9B89C4;margin-top:6px;font-weight:700;">carregando...</p>
      </div>

      <img
        :src="fotos[fotoAtual]"
        :alt="alt"
        :style="{ opacity: imgCarregada ? 1 : 0 }"
        class="foto-img"
        @load="imgCarregada = true"
        @error="imgCarregada = true"
      />

      <template v-if="fotos.length > 1">
        <button class="cbtn cbtn-l" @click="fotoAnterior(fotos.length)"><ChevronLeft :size="16" /></button>
        <button class="cbtn cbtn-r" @click="proxFoto(fotos.length)"><ChevronRight :size="16" /></button>
        <div class="cdots">
          <span v-for="(_, i) in fotos" :key="i" :class="['cdot', i === fotoAtual && 'cdot-on']" @click="irFoto(i)" />
        </div>
        <div class="foto-counter">{{ fotoAtual + 1 }}/{{ fotos.length }}</div>
      </template>
    </template>

    <div v-else class="foto-vazia">
      <PawPrint :size="56" style="color:#9B89C4;opacity:0.4;" />
    </div>
  </div>
</template>

<style scoped>
.foto-wrap {
  position: relative;
  width: 260px;
  height: 260px;
  flex-shrink: 0;
  border-radius: 16px;
  overflow: hidden;
  background: #EDE9FE;
}
.foto-img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: opacity 0.2s;
}
.foto-vazia {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}
.foto-skeleton {
  position: absolute; inset: 0; z-index: 2;
  background: #EDE9FE;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{ opacity:.8 } 50%{ opacity:.4 } }

.foto-counter {
  position: absolute; top: 8px; right: 8px;
  background: rgba(0,0,0,0.45); color: #fff;
  font-size: 0.65rem; font-weight: 700;
  padding: 2px 7px; border-radius: 999px; z-index: 4;
}

/* Carousel btns */
.cbtn {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(255,255,255,0.85); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #1A1626; box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  transition: background .15s; z-index: 4;
}
.cbtn:hover { background: #fff; }
.cbtn-l { left: 6px; }
.cbtn-r { right: 6px; }

.cdots {
  position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 5px; z-index: 4;
}
.cdot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(255,255,255,0.45); cursor: pointer;
  transition: background .15s, transform .15s;
}
.cdot-on { background: #fff; transform: scale(1.3); }
</style>
