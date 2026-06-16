<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PawPrint, User, Mail, Lock, CheckCircle, ArrowRight, ChevronDown, MapPin, Phone } from 'lucide-vue-next'
import { useCadastro } from '../../modules/auth/controllers/useCadastro.js'
import { BAIRROS_BOA_VISTA } from '../../constants/bairros.js'
import AuthSidebar from '../../components/AuthSidebar.vue'

const router  = useRouter()
const { cadastrar } = useCadastro()
const nome     = ref('')
const email    = ref('')
const telefone = ref('')
const senha    = ref('')
const bairro   = ref('')
const loading  = ref(false)
const erro     = ref('')
const sucesso  = ref(false)

const handleCadastro = async () => {
  if (!nome.value || !email.value || !senha.value) { erro.value = 'Preencha todos os campos.'; return }
  if (!bairro.value) { erro.value = 'Selecione seu bairro.'; return }
  if (senha.value.length < 6) { erro.value = 'Senha precisa ter pelo menos 6 caracteres.'; return }
  loading.value = true
  erro.value = ''
  try {
    await cadastrar({ nome: nome.value, email: email.value, telefone: telefone.value, senha: senha.value, bairro: bairro.value })
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
  <div style="min-height:100vh;display:flex;font-family:'Nunito',sans-serif;">

    <!-- ── Painel esquerdo ── -->
    <AuthSidebar />

    <!-- ── Painel direito — formulário ── -->
    <div style="flex:1;display:flex;align-items:center;justify-content:center;background:#F7F5FB;padding:40px 24px;">
      <div style="width:100%;max-width:400px;">

        <div class="flex md:hidden items-center justify-center gap-2.5 mb-8">
          <div style="width:40px;height:40px;background:linear-gradient(135deg,#7C3AED,#5B21B6);border-radius:12px;display:flex;align-items:center;justify-content:center;">
            <PawPrint :size="20" color="white" />
          </div>
          <span style="color:#7C3AED;font-size:1.4rem;font-weight:900;">PETECO</span>
        </div>

        <h2 style="font-size:1.75rem;font-weight:900;color:#1A1626;margin-bottom:6px;">Criar conta</h2>
        <p style="font-size:0.9rem;font-weight:600;color:#6B6578;margin-bottom:32px;">
          Preencha os dados para começar.
        </p>

        <div v-if="sucesso" class="insight-info mb-6">
          <CheckCircle :size="18" class="flex-shrink-0" />
          <span>Conta criada! Redirecionando para o login...</span>
        </div>

        <form v-else @submit.prevent="handleCadastro" style="display:flex;flex-direction:column;gap:18px;">
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
            <label class="label">Telefone</label>
            <div class="relative">
              <Phone :size="16" class="absolute left-3 top-1/2 -translate-y-1/2" style="color:#A099B0" />
              <input v-model="telefone" class="input pl-9" type="tel" placeholder="(95) 99999-9999" />
            </div>
          </div>

          <div class="field">
            <label class="label">Bairro *</label>
            <div class="relative">
              <MapPin :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style="color:#A099B0" />
              <select v-model="bairro" class="input pl-9 pr-8" required style="appearance:none;-webkit-appearance:none;">
                <option value="">Selecione seu bairro</option>
                <option v-for="b in BAIRROS_BOA_VISTA" :key="b.nome" :value="b.nome">{{ b.nome }}</option>
              </select>
              <ChevronDown :size="15" class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style="color:#A099B0" />
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

          <button type="submit" class="btn-primary w-full" style="margin-top:4px;" :disabled="loading">
            <ArrowRight :size="16" />
            {{ loading ? 'Criando conta...' : 'Criar conta' }}
          </button>
        </form>

        <div class="divider mt-7 mb-6"></div>

        <p class="text-center text-sm" style="color:#6B6578;">
          Já tem conta?
          <RouterLink to="/login" class="font-bold hover:underline" style="color:#7C3AED;">Entrar</RouterLink>
        </p>

      </div>
    </div>

  </div>
</template>
