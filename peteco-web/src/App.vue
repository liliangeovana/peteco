<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { useAuth } from './modules/auth/controllers/useAuth.js'
import {
  PawPrint, LayoutList, BarChart2, List, User, LogOut,
} from 'lucide-vue-next'

const route = useRoute()
const { usuario, logout } = useAuth()

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
        <RouterLink class="navbar-link" active-class="navbar-link-active" to="/analytics">
          <BarChart2 :size="15" /> Analytics
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

    <main
      :class="isConstrained
        ? 'flex-1 max-w-6xl mx-auto w-full px-4 py-6'
        : 'flex-1'"
    >
      <RouterView />
    </main>

  </div>
</template>
