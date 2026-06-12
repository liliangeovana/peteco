<script setup>
import { ref } from 'vue'
import { useAuth } from '../../modules/auth/controllers/useAuth.js'
import { PawPrint, Mail, Lock, ArrowRight } from 'lucide-vue-next'
import AuthSidebar from '../../components/AuthSidebar.vue'

const { login } = useAuth()

const email   = ref('')
const senha   = ref('')
const loading = ref(false)
const erro    = ref('')

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
  <div style="min-height:100vh;display:flex;font-family:'Nunito',sans-serif;">

    <!-- ── Painel esquerdo ── -->
    <AuthSidebar />

    <!-- ── Painel direito — formulário ── -->
    <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#F7F5FB;padding:40px 24px;">
      <div style="width:100%;max-width:400px;">

        <!-- Logo mobile (só aparece em telas pequenas) -->
        <div class="flex md:hidden items-center justify-center gap-2.5 mb-8">
          <div style="width:40px;height:40px;background:linear-gradient(135deg,#7C3AED,#5B21B6);border-radius:12px;display:flex;align-items:center;justify-content:center;">
            <PawPrint :size="20" color="white" />
          </div>
          <span style="color:#7C3AED;font-size:1.4rem;font-weight:900;">PETECO</span>
        </div>

        <h2 style="font-size:1.75rem;font-weight:900;color:#1A1626;margin-bottom:6px;">Entrar</h2>
        <p style="font-size:0.9rem;font-weight:600;color:#6B6578;margin-bottom:32px;">
          Bem-vindo de volta. Acesse sua conta.
        </p>

        <form @submit.prevent="handleLogin" style="display:flex;flex-direction:column;gap:18px;">
          <div class="field">
            <label class="label">E-mail</label>
            <div class="relative">
              <Mail :size="16" class="absolute left-3 top-1/2 -translate-y-1/2" style="color:#A099B0" />
              <input
                v-model="email"
                class="input pl-9"
                type="email"
                placeholder="seu@email.com"
                autocomplete="email"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Senha</label>
            <div class="relative">
              <Lock :size="16" class="absolute left-3 top-1/2 -translate-y-1/2" style="color:#A099B0" />
              <input
                v-model="senha"
                class="input pl-9"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
              />
            </div>
          </div>

          <div v-if="erro" class="insight-critical text-xs">{{ erro }}</div>

          <button type="submit" class="btn-primary w-full" style="margin-top:4px;" :disabled="loading">
            <ArrowRight :size="16" />
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="divider mt-7 mb-6"></div>

        <p class="text-center text-sm" style="color:#6B6578;">
          Não tem conta?
          <RouterLink to="/cadastro" class="font-bold hover:underline" style="color:#7C3AED;">Criar conta</RouterLink>
        </p>

      </div>
    </div>

  </div>
</template>
