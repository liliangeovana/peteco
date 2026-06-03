<script setup>
import { ref } from 'vue'
import { useAuth } from '../../modules/auth/controllers/useAuth.js'
import { PawPrint, Mail, Lock, ArrowRight } from 'lucide-vue-next'

const {
  login
} = useAuth()

const email    = ref('')
const senha    = ref('')
const loading  = ref(false)
const erro     = ref('')

const handleLogin = async () => {
  if (!email.value || !senha.value) { erro.value = 'Preencha todos os campos.'; return }
  loading.value = true
  erro.value = ''
  try {
    await login(email.value, senha.value)
  } catch {
    erro.value = 'E-mail ou senha incorretos.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-bg">
    <!-- Painel decorativo esquerdo -->
    <aside class="auth-panel">
      <div>
        <div class="flex items-center gap-2 mb-10">
          <PawPrint :size="28" />
          <span class="text-2xl font-black tracking-tight">PETECO</span>
        </div>
        <h2 class="text-3xl font-black leading-snug mb-4">Gerencie pets<br>perdidos com<br>inteligência.</h2>
        <p class="text-white/70 text-sm leading-relaxed">
          Mapa de ocorrências, heatmap, clusters DBSCAN e análise B2G — tudo em um painel.
        </p>
      </div>
      <div class="flex items-center gap-3 text-white/50 text-xs">
        <PawPrint :size="16" />
        IFRR · DAMU + DAW · 2026
      </div>
    </aside>

    <!-- Área do formulário -->
    <div class="auth-form-area">
      <div class="w-full max-w-sm">
        <div class="md:hidden text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" style="background: linear-gradient(135deg,#7C3AED,#5B21B6)">
            <PawPrint :size="28" color="white" />
          </div>
          <h1 class="text-2xl font-black" style="color:#1A1626">PETECO</h1>
        </div>

        <h2 class="text-2xl font-black mb-1" style="color:#1A1626">Bem-vindo de volta</h2>
        <p class="text-sm font-semibold mb-7" style="color:#6B6578">Entre na sua conta para continuar</p>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div class="field">
            <label class="label">E-mail</label>
            <div class="relative">
              <Mail :size="16" class="absolute left-3 top-1/2 -translate-y-1/2" style="color:#A099B0" />
              <input v-model="email" class="input pl-9" type="email" placeholder="seu@email.com" autocomplete="email" />
            </div>
          </div>

          <div class="field">
            <label class="label">Senha</label>
            <div class="relative">
              <Lock :size="16" class="absolute left-3 top-1/2 -translate-y-1/2" style="color:#A099B0" />
              <input v-model="senha" class="input pl-9" type="password" placeholder="••••••••" autocomplete="current-password" />
            </div>
          </div>

          <div v-if="erro" class="insight-critical text-xs">{{ erro }}</div>

          <button type="submit" class="btn-primary w-full mt-1" :disabled="loading">
            <ArrowRight :size="16" />
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <p class="text-center text-sm mt-5" style="color:#6B6578">
          Não tem conta?
          <RouterLink to="/cadastro" class="font-bold hover:underline" style="color:#7C3AED">Criar conta</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
