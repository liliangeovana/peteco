<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { useAuth } from './modules/auth/controllers/useAuth.js'
import {
  PawPrint, LayoutList, Plus, List, User, LogOut, Map,
} from 'lucide-vue-next'

const route = useRoute()
const { usuario, logout, verificarSessao } = useAuth()

onMounted(() => {
  if (usuario.value) verificarSessao()
})

const rotasPublicas = ['/', '/login', '/cadastro']
const mostrarNav = computed(() => !rotasPublicas.includes(route.path))

const isConstrained = computed(() => !['/', '/login', '/cadastro'].includes(route.path))
</script>

<template>
  <div class="min-h-screen flex flex-col bg-peteco-bg">

    <nav v-if="mostrarNav" class="navbar">
      <RouterLink to="/feed" class="navbar-logo">
        <span class="navbar-logo-icon">
          <PawPrint :size="16" />
        </span>
        PETECO
      </RouterLink>
      <div class="navbar-links">
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/feed">
          <LayoutList :size="15" /> Feed
        </RouterLink>
        <RouterLink class="navbar-link navbar-link-cadastrar" active-class="navbar-link-active" to="/cadastrar">
          <Plus :size="15" /> Cadastrar
        </RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/meus-pets">
          <List :size="15" /> Meus Pets
        </RouterLink>
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/mapa">
          <Map :size="15" /> Mapa
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

    <main
      :class="isConstrained
        ? 'flex-1 max-w-6xl mx-auto w-full px-4 py-6'
        : 'flex-1'"
    >
      <RouterView />
    </main>

  </div>
</template>
