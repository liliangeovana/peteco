<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../../modules/auth/controllers/useAuth.js'
import { usePerfil } from '../../modules/auth/controllers/usePerfil.js'
import { ArrowLeft, Save, User, Phone, Mail, Lock } from 'lucide-vue-next'

const { usuario, verificarSessao } = useAuth()
const { atualizarPerfil } = usePerfil()
const loading  = ref(true)
const salvando = ref(false)
const mensagem = ref(null)

const form = ref({ nome: '', telefone: '', senha: '', confirmarSenha: '' })

onMounted(async () => {
  await verificarSessao()
  if (usuario.value) {
    form.value.nome     = usuario.value.nome     ?? ''
    form.value.telefone = usuario.value.telefone ?? ''
  }
  loading.value = false
})

const salvar = async () => {
  if (form.value.senha && form.value.senha !== form.value.confirmarSenha) {
    mensagem.value = { tipo: 'erro', texto: 'As senhas não coincidem.' }
    return
  }
  salvando.value = true
  mensagem.value = null
  try {
    await atualizarPerfil({
      nome:     form.value.nome,
      telefone: form.value.telefone,
      senha:    form.value.senha || undefined,
    })
    mensagem.value = { tipo: 'sucesso', texto: 'Perfil atualizado com sucesso!' }
    form.value.senha = ''
    form.value.confirmarSenha = ''
  } catch {
    mensagem.value = { tipo: 'erro', texto: 'Erro ao salvar. Tente novamente.' }
  } finally {
    salvando.value = false
  }
}

const cancelar = () => {
  form.value.senha = ''
  form.value.confirmarSenha = ''
  mensagem.value = null
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Editar Perfil</h2>
      <RouterLink to="/perfil" class="btn-ghost text-sm">
        <ArrowLeft :size="14" /> Voltar
      </RouterLink>
    </div>

    <div v-if="loading" class="text-center py-20 text-neutral-400 font-semibold">Carregando...</div>

    <template v-else>
      <!-- Avatar header -->
      <div class="card mb-5 flex items-center gap-4" style="background:linear-gradient(135deg,#7C3AED,#5B21B6);color:white">
        <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black flex-shrink-0">
          {{ usuario?.nome?.charAt(0)?.toUpperCase() || '?' }}
        </div>
        <div>
          <h3 class="text-lg font-black">{{ usuario?.nome || 'Usuário' }}</h3>
          <p class="text-white/70 text-sm">{{ usuario?.email }}</p>
        </div>
      </div>

      <form @submit.prevent="salvar" class="card">
        <h3 class="font-black text-neutral-900 mb-4">Dados pessoais</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="field">
            <label class="label flex items-center gap-1"><User :size="11" /> Nome</label>
            <input v-model="form.nome" class="input" placeholder="Seu nome" required />
          </div>
          <div class="field">
            <label class="label flex items-center gap-1"><Phone :size="11" /> Telefone / WhatsApp</label>
            <input v-model="form.telefone" class="input" placeholder="(95) 98765-4321" />
          </div>
        </div>

        <div class="field mb-4">
          <label class="label flex items-center gap-1"><Mail :size="11" /> E-mail (não editável)</label>
          <input :value="usuario?.email" class="input bg-neutral-50 text-neutral-400" disabled />
        </div>

        <div class="divider" />

        <h3 class="font-black text-neutral-900 mb-4 mt-4">Alterar senha</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="field">
            <label class="label flex items-center gap-1"><Lock :size="11" /> Nova senha</label>
            <input v-model="form.senha" class="input" type="password" placeholder="Deixe em branco para manter" />
          </div>
          <div class="field">
            <label class="label flex items-center gap-1"><Lock :size="11" /> Confirmar nova senha</label>
            <input v-model="form.confirmarSenha" class="input" type="password" placeholder="Repita a nova senha" />
          </div>
        </div>

        <div
          v-if="mensagem"
          :class="mensagem.tipo === 'sucesso' ? 'insight-info' : 'insight-critical'"
          class="mb-4"
        >
          {{ mensagem.texto }}
        </div>

        <div class="flex justify-end gap-3">
          <button type="button" class="btn-ghost" @click="cancelar">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="salvando">
            <Save :size="14" />
            {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>
