<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { useAuth } from './modules/auth/controllers/useAuth.js'
import {
  PawPrint, MapPin, Flame, BrainCircuit, LayoutDashboard,
  TrendingUp, List, User, LogOut,
} from 'lucide-vue-next'

const route = useRoute()
const { usuario, logout } = useAuth()

const rotasPublicas = ['/login', '/cadastro']
const mostrarNav = computed(() => !rotasPublicas.includes(route.path))
</script>

<template>
  <div class="min-h-screen flex flex-col bg-peteco-bg">

    <nav v-if="mostrarNav" class="navbar">
      <RouterLink to="/" class="navbar-logo">
        <PawPrint :size="22" />
        PETECO
      </RouterLink>
      <div class="navbar-links">
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/">
          <MapPin :size="15" /> Mapa
        </RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/heatmap">
          <Flame :size="15" /> Heatmap
        </RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/clusters">
          <BrainCircuit :size="15" /> Clusters
        </RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/dashboard">
          <LayoutDashboard :size="15" /> Dashboard
        </RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/analise">
          <TrendingUp :size="15" /> Análise
        </RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/pets">
          <List :size="15" /> Pets
        </RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/perfil">
          <User :size="15" /> Perfil
        </RouterLink>
      </div>
      <button
        v-if="usuario"
        class="btn-ghost text-xs"
        @click="logout"
      >
        <LogOut :size="14" /> Sair
      </button>
    </nav>

    <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
      <RouterView />
    </main>

  </div>
</template>
