<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Phone, MessageCircle, Camera, Plus, X } from 'lucide-vue-next'
import { http } from '../../client/http.js'
import { BAIRROS_BOA_VISTA, OPCAO_OUTRO } from '../../constants/bairros.js'
import { SEM_RACA, RACAS } from '../../constants/racas.js'
import { useMascaraTelefone } from '../../composables/useMascaraTelefone.js'
import { useNormalizarContatos } from '../../composables/useNormalizarContatos.js'

const route  = useRoute()
const router = useRouter()
const { mascaraTelefone } = useMascaraTelefone()
const { normalizarInstagram, parseContatos } = useNormalizarContatos()

const loading  = ref(true)
const enviando = ref(false)
const erro     = ref('')

const form = reactive({
  nome: '', especie: '', raca: '', cor: '', descricao: '',
  data_perda: '', bairro: '', status: 'perdido',
  recompensa: false, valor_recompensa: '',
})

const bairroSelecionado = ref('')
const bairroOutro       = ref('')
const racaSelecionada   = ref('')
const contatoAtivado    = ref(false)
const contatos          = ref([])

const ESPECIES = ['cachorro', 'gato', 'outro']
const OPCOES_BAIRRO = [...BAIRROS_BOA_VISTA.map(b => b.nome), OPCAO_OUTRO]

function racasDisponiveis() {
  return RACAS[form.especie] ?? RACAS.outro
}

function selecionarEspecie(e) {
  form.especie = e
  racaSelecionada.value = (e === 'cachorro' || e === 'gato') ? SEM_RACA : ''
  form.raca = ''
}

function selecionarRaca(r) {
  racaSelecionada.value = r
  form.raca = r === SEM_RACA ? '' : r
}

function adicionarContato() {
  contatos.value = [...contatos.value, { tipo: 'whatsapp', valor: '' }]
}

function removerContato(idx) {
  contatos.value = contatos.value.filter((_, i) => i !== idx)
}

function atualizarContato(idx, campo, valor) {
  contatos.value = contatos.value.map((c, i) => i === idx ? { ...c, [campo]: valor } : c)
}

function onContatoInput(idx, tipo, e) {
  let v = e.target.value
  if (tipo === 'whatsapp') v = mascaraTelefone(v)
  else if (tipo === 'instagram') v = normalizarInstagram(v)
  atualizarContato(idx, 'valor', v)
  e.target.value = v
}

watch(contatoAtivado, (val) => {
  if (val && contatos.value.length === 0) contatos.value = [{ tipo: 'whatsapp', valor: '' }]
  else if (!val) contatos.value = []
})

watch(() => form.recompensa, (val) => {
  if (!val) form.valor_recompensa = ''
})

onMounted(async () => {
  try {
    const { data } = await http.get(`/pets/${route.params.id}`)
    form.nome            = data.nome || ''
    form.especie         = data.especie || ''
    form.raca            = data.raca || ''
    form.cor             = data.cor || ''
    form.descricao       = data.descricao || ''
    form.data_perda      = data.data_perda ? data.data_perda.slice(0, 10) : ''
    form.status          = data.status || 'perdido'
    form.recompensa      = !!data.recompensa
    form.valor_recompensa = data.valor_recompensa || ''

    const bairroExiste = BAIRROS_BOA_VISTA.find(b => b.nome === data.bairro)
    bairroSelecionado.value = bairroExiste ? data.bairro : (data.bairro ? OPCAO_OUTRO : '')
    bairroOutro.value = bairroExiste ? '' : (data.bairro || '')

    if (form.especie === 'cachorro' || form.especie === 'gato') {
      racaSelecionada.value = form.raca || SEM_RACA
    }

    const contatosParsed = parseContatos(data.contatos)
    if (contatosParsed.length > 0) {
      contatoAtivado.value = true
      contatos.value = contatosParsed.map(c => ({ tipo: c.tipo, valor: c.valor }))
    }
  } catch {
    erro.value = 'Não foi possível carregar os dados do pet.'
  } finally {
    loading.value = false
  }
})

async function salvar() {
  erro.value = ''
  if (!form.nome || !form.especie) {
    erro.value = 'Preencha pelo menos o nome e a espécie.'
    return
  }
  const bairroFinal = bairroSelecionado.value === OPCAO_OUTRO
    ? bairroOutro.value.trim()
    : bairroSelecionado.value
  if (!bairroFinal) {
    erro.value = 'Selecione o bairro.'
    return
  }

  enviando.value = true
  try {
    const contatosFiltrados = contatoAtivado.value
      ? contatos.value.filter(c => c.valor.trim())
      : []

    await http.put(`/pets/${route.params.id}`, {
      nome:            form.nome,
      especie:         form.especie,
      raca:            form.raca || null,
      cor:             form.cor || null,
      descricao:       form.descricao || null,
      data_perda:      form.data_perda || null,
      bairro:          bairroFinal,
      status:          form.status,
      recompensa:      form.recompensa,
      valor_recompensa: form.recompensa && form.valor_recompensa.trim() ? form.valor_recompensa.trim() : null,
      contatos:        contatosFiltrados.length > 0 ? JSON.stringify(contatosFiltrados) : null,
    })
    router.push(`/pet/${route.params.id}`)
  } catch (e) {
    erro.value = e?.response?.data?.erro || 'Erro ao salvar as alterações.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="page">
    <button class="btn-ghost text-xs mb-4 flex items-center gap-1" @click="router.back()">
      <ArrowLeft :size="14" /> Voltar
    </button>

    <div class="page-header">
      <h2>Editar pet</h2>
    </div>

    <div v-if="loading" class="text-center py-20 text-neutral-400 font-semibold">Carregando...</div>

    <template v-else>

      <!-- Informações básicas -->
      <div class="card mb-5 flex flex-col gap-4">
        <h3 class="font-black text-neutral-900">Informações básicas</h3>

        <div class="field">
          <label class="label">Nome do pet *</label>
          <input v-model="form.nome" class="input" placeholder="Ex: Rex" />
        </div>

        <div class="field">
          <label class="label">Status *</label>
          <div class="flex gap-2">
            <button
              v-for="s in [{ key: 'perdido', label: 'Perdido' }, { key: 'encontrado', label: 'Encontrado' }]"
              :key="s.key"
              type="button"
              :class="['especie-chip', form.status === s.key ? 'especie-chip-ativo' : '']"
              :style="form.status === s.key && s.key === 'encontrado' ? 'background:#2EBD7A;border-color:#2EBD7A;' : ''"
              @click="form.status = s.key"
            >{{ s.label }}</button>
          </div>
        </div>

        <div class="field">
          <label class="label">Espécie *</label>
          <div class="flex gap-2 flex-wrap mt-1">
            <button
              v-for="e in ESPECIES"
              :key="e"
              type="button"
              :class="['especie-chip', form.especie === e ? 'especie-chip-ativo' : '']"
              @click="selecionarEspecie(e)"
            >{{ e }}</button>
          </div>
        </div>

        <div v-if="form.especie === 'cachorro' || form.especie === 'gato'" class="field">
          <label class="label">Raça</label>
          <select :value="racaSelecionada" @change="selecionarRaca($event.target.value)" class="input">
            <option v-for="r in racasDisponiveis()" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>

        <div class="field">
          <label class="label">Cor</label>
          <input v-model="form.cor" class="input" placeholder="Ex: Caramelo e branco" />
        </div>

        <div class="field">
          <label class="label">Descrição</label>
          <textarea v-model="form.descricao" class="input" style="height:80px;resize:vertical" placeholder="Detalhes que ajudem a identificar o pet..." />
        </div>

        <div class="field">
          <label class="label">Data de perda</label>
          <input v-model="form.data_perda" type="date" class="input" />
        </div>
      </div>

      <!-- Localização -->
      <div class="card mb-5 flex flex-col gap-4">
        <h3 class="font-black text-neutral-900">Localização</h3>
        <div class="field">
          <label class="label">Bairro *</label>
          <select v-model="bairroSelecionado" class="input">
            <option value="">Selecione o bairro</option>
            <option v-for="b in OPCOES_BAIRRO" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>
        <div v-if="bairroSelecionado === OPCAO_OUTRO" class="field">
          <label class="label">Qual bairro?</label>
          <input v-model="bairroOutro" class="input" placeholder="Digite o nome do bairro" />
        </div>
      </div>

      <!-- Recompensa -->
      <div class="card mb-5 flex flex-col gap-4">
        <h3 class="font-black text-neutral-900">Recompensa</h3>
        <label class="flex items-center gap-3 cursor-pointer select-none">
          <div class="relative">
            <input type="checkbox" v-model="form.recompensa" class="sr-only" />
            <div :class="['w-11 h-6 rounded-full transition-colors', form.recompensa ? 'bg-violet-600' : 'bg-neutral-300']" />
            <div :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', form.recompensa ? 'translate-x-5' : '']" />
          </div>
          <span class="font-semibold text-sm" style="color:#1A1626;">Oferecer recompensa</span>
        </label>
        <div v-if="form.recompensa" class="field">
          <label class="label">Valor da recompensa (opcional)</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style="color:#6B6578;">R$</span>
            <input v-model="form.valor_recompensa" type="text" class="input" style="padding-left:2.2rem;" placeholder="Ex: 200" />
          </div>
        </div>
      </div>

      <!-- Contato -->
      <div class="card mb-5 flex flex-col gap-4">
        <h3 class="font-black text-neutral-900">Contato</h3>
        <label class="flex items-center gap-3 cursor-pointer select-none">
          <div class="relative">
            <input type="checkbox" v-model="contatoAtivado" class="sr-only" />
            <div :class="['w-11 h-6 rounded-full transition-colors', contatoAtivado ? 'bg-violet-600' : 'bg-neutral-300']" />
            <div :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', contatoAtivado ? 'translate-x-5' : '']" />
          </div>
          <span class="font-semibold text-sm" style="color:#1A1626;">Disponibilizar contato</span>
        </label>

        <template v-if="contatoAtivado">
          <div v-for="(c, idx) in contatos" :key="idx" class="contato-row">
            <div class="flex gap-2 flex-wrap mb-2">
              <button
                v-for="t in [{tipo:'whatsapp',label:'WhatsApp'},{tipo:'instagram',label:'Instagram'},{tipo:'outro',label:'Outro'}]"
                :key="t.tipo"
                type="button"
                :class="['tipo-chip', c.tipo === t.tipo ? 'tipo-chip-ativo' : '']"
                @click="atualizarContato(idx, 'tipo', t.tipo)"
              >
                <Phone v-if="t.tipo === 'whatsapp'" :size="13" />
                <Camera v-else-if="t.tipo === 'instagram'" :size="13" />
                <MessageCircle v-else :size="13" />
                {{ t.label }}
              </button>
            </div>
            <div class="flex gap-2 items-center">
              <input
                :value="c.valor"
                @input="onContatoInput(idx, c.tipo, $event)"
                class="input flex-1"
                :placeholder="c.tipo === 'whatsapp' ? 'Ex: 95 99999-9999' : c.tipo === 'instagram' ? 'Ex: @perfil' : 'Descreva o contato'"
                :type="c.tipo === 'whatsapp' ? 'tel' : 'text'"
                autocomplete="off"
              />
              <button type="button" class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background:#FEE2E2" @click="removerContato(idx)">
                <X :size="15" style="color:#EF4444" />
              </button>
            </div>
          </div>

          <button type="button" class="flex items-center gap-2 text-sm font-semibold self-start" style="color:#7C3AED" @click="adicionarContato">
            <Plus :size="16" /> Adicionar contato
          </button>
        </template>
      </div>

      <div v-if="erro" class="insight-critical text-sm mb-4">{{ erro }}</div>

      <button type="button" class="btn-primary w-full py-4 text-base mb-10" :disabled="enviando" @click="salvar">
        {{ enviando ? 'Salvando...' : 'Salvar alterações' }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.especie-chip {
  border: 1.5px solid #E5E0F0;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #6B6578;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}
.especie-chip-ativo {
  background: #7C3AED;
  border-color: #7C3AED;
  color: #fff;
}
.contato-row {
  border-bottom: 1px solid #E5E0F0;
  padding-bottom: 12px;
}
.contato-row:last-of-type { border-bottom: none; }
.tipo-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1.5px solid #E5E0F0;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6B6578;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}
.tipo-chip-ativo {
  background: #7C3AED;
  border-color: #7C3AED;
  color: #fff;
}
</style>
