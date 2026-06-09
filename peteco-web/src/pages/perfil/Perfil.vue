<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../../modules/auth/controllers/useAuth.js'
import {
  MapPin, BrainCircuit, List, LayoutDashboard, ChevronRight,
  User, Mail, Shield, Wifi, Pencil,
} from 'lucide-vue-next'

const { usuario, verificarSessao } = useAuth()
const loading = ref(true)

onMounted(async () => {
  await verificarSessao()
  loading.value = false
})
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Perfil</h2>
      <RouterLink to="/perfil/editar" class="btn-primary text-sm">
        <Pencil :size="14" /> Editar perfil
      </RouterLink>
    </div>

    <div v-if="loading" class="text-center py-20 text-neutral-400 font-semibold">Carregando...</div>

    <template v-else-if="usuario">
      <!-- Avatar header -->
      <div class="card mb-5 flex items-center gap-5" style="background:linear-gradient(135deg,#7C3AED,#5B21B6);color:white">
        <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black flex-shrink-0">
          {{ usuario.nome?.charAt(0)?.toUpperCase() || '?' }}
        </div>
        <div>
          <h3 class="text-xl font-black">{{ usuario.nome || 'Usuário' }}</h3>
          <p class="text-white/70 text-sm font-semibold">{{ usuario.email }}</p>
        </div>
      </div>

      <!-- Dados -->
      <div class="card mb-5">
        <h3 class="font-black text-neutral-900 mb-4">Dados da conta</h3>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="label flex items-center gap-1"><User :size="11" /> Nome</dt>
            <dd class="font-semibold text-neutral-800">{{ usuario.nome || '—' }}</dd>
          </div>
          <div>
            <dt class="label flex items-center gap-1"><Mail :size="11" /> E-mail</dt>
            <dd class="font-semibold text-neutral-800">{{ usuario.email }}</dd>
          </div>
          <div>
            <dt class="label flex items-center gap-1"><Shield :size="11" /> Tipo de acesso</dt>
            <dd><span class="badge-blue">Gestor</span></dd>
          </div>
          <div>
            <dt class="label flex items-center gap-1"><Wifi :size="11" /> Sessão</dt>
            <dd><span class="badge-green">Ativa</span></dd>
          </div>
        </dl>
      </div>

      <!-- Navegação rápida -->
      <div class="card">
        <h3 class="font-black text-neutral-900 mb-3">Acesso rápido</h3>
        <div class="flex flex-col gap-1">
          <RouterLink
            v-for="link in [
              { to: '/feed',       Icon: MapPin,          label: 'Feed de pets',         color: '#7C3AED' },
              { to: '/analytics', Icon: BrainCircuit,    label: 'Analytics & Clusters', color: '#3b82f6' },
              { to: '/pets',      Icon: List,            label: 'Lista de pets',         color: '#2EBD7A' },
              { to: '/analise',   Icon: LayoutDashboard, label: 'Análise detalhada',     color: '#f97316' },
            ]"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200"
          >
            <component :is="link.Icon" :size="18" :style="`color:${link.color}`" />
            <span class="font-semibold text-neutral-700 text-sm">{{ link.label }}</span>
            <ChevronRight :size="16" class="ml-auto text-neutral-400" />
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>
