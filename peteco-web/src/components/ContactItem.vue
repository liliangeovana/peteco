<script setup>
import { Phone, Camera, MessageCircle } from 'lucide-vue-next'
import { useNormalizarContatos } from '../composables/useNormalizarContatos.js'

const { formatarContato } = useNormalizarContatos()

defineProps({
  contato: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="contato-item">
    <div :class="['contato-icone', contato.tipo === 'whatsapp' ? 'icone-whatsapp' : contato.tipo === 'instagram' ? 'icone-instagram' : 'icone-outro']">
      <Phone v-if="contato.tipo === 'whatsapp'" :size="16" />
      <Camera v-else-if="contato.tipo === 'instagram'" :size="16" />
      <MessageCircle v-else :size="16" />
    </div>
    <div>
      <p class="text-xs font-bold" style="color:#A099B0;letter-spacing:.4px;">
        {{ contato.tipo === 'whatsapp' ? 'WhatsApp' : contato.tipo === 'instagram' ? 'Instagram' : 'Contato' }}
      </p>
      <p class="text-sm font-bold" style="color:#1A1626;">{{ formatarContato(contato) }}</p>
    </div>
  </div>
</template>

<style scoped>
.contato-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.contato-icone {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.icone-whatsapp { background: #DCFCE7; }
.icone-instagram { background: #FCE7F3; }
.icone-outro { background: #EDE9FE; }
</style>
