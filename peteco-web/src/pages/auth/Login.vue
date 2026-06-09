<script setup>
import { ref } from 'vue'
import { useAuth } from '../../modules/auth/controllers/useAuth.js'
import { PawPrint, Mail, Lock, ArrowRight, MapPin, BarChart2, ShieldCheck } from 'lucide-vue-next'

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
    <div style="
      width:42%;min-width:320px;
      background:linear-gradient(160deg,#7C3AED 0%,#4C1D95 100%);
      display:flex;flex-direction:column;justify-content:center;
      padding:56px 52px;position:relative;overflow:hidden;
    " class="hidden md:flex">

      <!-- Círculos decorativos de fundo -->
      <div style="position:absolute;top:-80px;right:-80px;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,0.05);"></div>
      <div style="position:absolute;bottom:-60px;left:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.05);"></div>

      <!-- Logo -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:56px;">
        <div style="width:44px;height:44px;background:rgba(255,255,255,0.18);border-radius:14px;display:flex;align-items:center;justify-content:center;">
          <PawPrint :size="22" color="white" />
        </div>
        <span style="color:white;font-size:1.5rem;font-weight:900;letter-spacing:0.04em;">PETECO</span>
      </div>

      <!-- Headline -->
      <h1 style="color:white;font-size:clamp(1.6rem,2.5vw,2.25rem);font-weight:900;line-height:1.2;margin-bottom:16px;">
        Gestão de pets perdidos em Boa Vista
      </h1>
      <p style="color:rgba(255,255,255,0.72);font-size:0.95rem;font-weight:600;line-height:1.7;margin-bottom:48px;">
        Plataforma B2G para análise, estatísticas e localização de pets em Roraima.
      </p>

      <!-- Features -->
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:38px;height:38px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <MapPin :size="18" color="white" />
          </div>
          <div>
            <p style="color:white;font-weight:800;font-size:0.875rem;margin-bottom:2px;">Feed por localização</p>
            <p style="color:rgba(255,255,255,0.6);font-size:0.8rem;font-weight:600;">Pets perdidos organizados por bairro</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:38px;height:38px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <BarChart2 :size="18" color="white" />
          </div>
          <div>
            <p style="color:white;font-weight:800;font-size:0.875rem;margin-bottom:2px;">Analytics completo</p>
            <p style="color:rgba(255,255,255,0.6);font-size:0.8rem;font-weight:600;">Estatísticas, espécie e taxa de retorno</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:38px;height:38px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <ShieldCheck :size="18" color="white" />
          </div>
          <div>
            <p style="color:white;font-weight:800;font-size:0.875rem;margin-bottom:2px;">Acesso seguro</p>
            <p style="color:rgba(255,255,255,0.6);font-size:0.8rem;font-weight:600;">Conta individual com sessão protegida</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <p style="position:absolute;bottom:28px;left:52px;color:rgba(255,255,255,0.35);font-size:0.75rem;font-weight:700;">
        IFRR · DAMU + DAW · 2026
      </p>
    </div>

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
