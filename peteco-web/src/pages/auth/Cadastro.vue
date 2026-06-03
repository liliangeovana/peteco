<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PawPrint, User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-vue-next'
import { useCadastro } from '../../modules/auth/controllers/useCadastro.js'

const router  = useRouter()
const { cadastrar } = useCadastro()
const nome    = ref('')
const email   = ref('')
const senha   = ref('')
const loading = ref(false)
const erro    = ref('')
const sucesso = ref(false)

const handleCadastro = async () => {
  if (!nome.value || !email.value || !senha.value) { erro.value = 'Preencha todos os campos.'; return }
  if (senha.value.length < 6) { erro.value = 'Senha precisa ter pelo menos 6 caracteres.'; return }
  loading.value = true
  erro.value = ''
  try {
    await cadastrar({ nome: nome.value, email: email.value, senha: senha.value })
    sucesso.value = true
    setTimeout(() => router.push('/login'), 2000)
  } catch (e) {
    erro.value = e.response?.data?.erro || 'Erro ao criar conta. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-bg">
    <aside class="auth-panel">
      <div>
        <div class="flex items-center gap-2 mb-10">
          <PawPrint :size="28" />
          <span class="text-2xl font-black tracking-tight">PETECO</span>
        </div>
        <h2 class="text-3xl font-black leading-snug mb-4">Junte-se à<br>plataforma de<br>busca de pets.</h2>
        <p class="text-white/70 text-sm leading-relaxed">
          Crie sua conta e tenha acesso ao painel completo de gestão e análise.
        </p>
      </div>
      <div class="flex items-center gap-3 text-white/50 text-xs">
        <PawPrint :size="16" />
        IFRR · DAMU + DAW · 2026
      </div>
    </aside>

    <div class="auth-form-area">
      <div class="w-full max-w-sm">
        <div class="md:hidden text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" style="background: linear-gradient(135deg,#7C3AED,#5B21B6)">
            <PawPrint :size="28" color="white" />
          </div>
          <h1 class="text-2xl font-black" style="color:#1A1626">PETECO</h1>
        </div>

        <h2 class="text-2xl font-black mb-1" style="color:#1A1626">Criar conta</h2>
        <p class="text-sm font-semibold mb-7" style="color:#6B6578">Preencha os dados para começar</p>

        <div v-if="sucesso" class="insight-info mb-4">
          <CheckCircle :size="18" class="flex-shrink-0" />
          <span>Conta criada! Redirecionando para o login...</span>
        </div>

        <form v-else @submit.prevent="handleCadastro" class="flex flex-col gap-4">
          <div class="field">
            <label class="label">Nome completo</label>
            <div class="relative">
              <User :size="16" class="absolute left-3 top-1/2 -translate-y-1/2" style="color:#A099B0" />
              <input v-model="nome" class="input pl-9" placeholder="Seu nome" />
            </div>
          </div>
          <div class="field">
            <label class="label">E-mail</label>
            <div class="relative">
              <Mail :size="16" class="absolute left-3 top-1/2 -translate-y-1/2" style="color:#A099B0" />
              <input v-model="email" class="input pl-9" type="email" placeholder="seu@email.com" />
            </div>
          </div>
          <div class="field">
            <label class="label">Senha</label>
            <div class="relative">
              <Lock :size="16" class="absolute left-3 top-1/2 -translate-y-1/2" style="color:#A099B0" />
              <input v-model="senha" class="input pl-9" type="password" placeholder="Mínimo 6 caracteres" />
            </div>
          </div>

          <div v-if="erro" class="insight-critical text-xs">{{ erro }}</div>

          <button type="submit" class="btn-primary w-full mt-1" :disabled="loading">
            <ArrowRight :size="16" />
            {{ loading ? 'Criando conta...' : 'Criar conta' }}
          </button>
        </form>

        <p class="text-center text-sm mt-5" style="color:#6B6578">
          Já tem conta?
          <RouterLink to="/login" class="font-bold hover:underline" style="color:#7C3AED">Entrar</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
