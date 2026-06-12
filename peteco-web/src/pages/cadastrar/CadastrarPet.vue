<script setup>
import { ref } from 'vue'
import { Camera, Trash2, MapPin, PawPrint, ChevronDown, Plus, X, Info, Phone, MessageCircle } from 'lucide-vue-next'
import { useCadastrarPet } from '../../modules/pet/controllers/useCadastrarPet.js'
import { BAIRROS_BOA_VISTA, OPCAO_OUTRO } from '../../constants/bairros.js'
import { useMascaraTelefone } from '../../composables/useMascaraTelefone.js'
import { useNormalizarContatos } from '../../composables/useNormalizarContatos.js'

const {
  form, set,
  dataPerda,
  bairroSelecionado, bairroOutro,
  racaSelecionada, selecionarRaca, selecionarEspecie, racasDisponiveis,
  fotos, fotosPreview, fotosValidadas, validandoFoto,
  coords, buscandoGps, obterGps,
  adicionarFoto, removerFoto,
  recompensa, valorRecompensa,
  contatoAtivado, contatos, adicionarContato, removerContato, atualizarContato,
  enviando, erro, enviar,
  OPCAO_OUTRO: OUTRO,
} = useCadastrarPet()

const fileInput = ref(null)
const ESPECIES = ['cachorro', 'gato', 'outro']
const OPCOES_BAIRRO = [...BAIRROS_BOA_VISTA.map(b => b.nome), OPCAO_OUTRO]
const { mascaraTelefone } = useMascaraTelefone()
const { normalizarInstagram } = useNormalizarContatos()

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) adicionarFoto(file)
  e.target.value = ''
}

function onContatoInput(idx, tipo, e) {
  let v = e.target.value
  if (tipo === 'whatsapp') v = mascaraTelefone(v)
  else if (tipo === 'instagram') v = normalizarInstagram(v)
  atualizarContato(idx, 'valor', v)
  e.target.value = v
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Cadastrar pet perdido</h2>
    </div>
    <p class="text-sm text-neutral-500 font-semibold mb-6">Preencha as informações para ajudar a encontrá-lo</p>

    <!-- Fotos -->
    <div class="card mb-5">
      <h3 class="font-black text-neutral-900 mb-3">Fotos</h3>
      <div class="flex gap-3 flex-wrap">
        <div
          v-for="(preview, idx) in fotosPreview"
          :key="idx"
          class="relative w-24 h-24 rounded-xl overflow-hidden"
        >
          <img :src="preview" class="w-full h-full object-cover" />
          <div v-if="validandoFoto && idx === fotosPreview.length - 1"
            class="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span class="text-white text-xs font-bold">Validando...</span>
          </div>
          <div v-else-if="fotosValidadas[idx]"
            class="absolute top-1.5 left-1.5 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center">
            <span style="color:#2EBD7A;font-size:0.65rem;font-weight:900;">✓</span>
          </div>
          <button
            type="button"
            class="absolute bottom-1.5 right-1.5 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
            @click="removerFoto(idx)"
          >
            <Trash2 :size="11" color="white" />
          </button>
        </div>

        <button
          v-if="fotos.length < 3"
          type="button"
          class="w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors"
          style="border-color:#7C3AED;background:#F5F3FF"
          :disabled="validandoFoto"
          @click="fileInput?.click()"
        >
          <Camera :size="22" style="color:#7C3AED" />
          <span class="text-xs font-semibold" style="color:#7C3AED">
            {{ fotos.length === 0 ? 'Adicionar foto' : 'Mais foto' }}
          </span>
          <span class="text-xs text-neutral-400">{{ fotos.length }}/3</span>
        </button>
      </div>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
    </div>

    <!-- Informações básicas -->
    <div class="card mb-5 flex flex-col gap-4">
      <h3 class="font-black text-neutral-900">Informações básicas</h3>

      <div class="field">
        <label class="label">Nome do pet *</label>
        <input :value="form.nome" @input="set('nome', $event.target.value)" class="input" placeholder="Ex: Rex" />
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
          >
            {{ e === 'cachorro' ? 'cachorro' : e === 'gato' ? 'gato' : 'outro' }}
          </button>
        </div>
      </div>

      <div v-if="form.especie === 'cachorro' || form.especie === 'gato'" class="field">
        <label class="label">Raça</label>
        <div class="relative">
          <select
            :value="racaSelecionada"
            @change="selecionarRaca($event.target.value)"
            class="input pr-8"
          >
            <option v-for="r in racasDisponiveis()" :key="r" :value="r">{{ r }}</option>
          </select>
          <ChevronDown :size="15" class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
        </div>
      </div>

      <div class="field">
        <label class="label">Cor</label>
        <input :value="form.cor" @input="set('cor', $event.target.value)" class="input" placeholder="Ex: Caramelo e branco" />
      </div>

      <div class="field">
        <label class="label">Descrição</label>
        <textarea
          :value="form.descricao"
          @input="set('descricao', $event.target.value)"
          class="input"
          style="height:80px;resize:vertical"
          placeholder="Detalhes que ajudem a identificar o pet..."
        />
      </div>

      <div class="field">
        <label class="label">Data de perda</label>
        <input v-model="dataPerda" type="date" class="input" />
      </div>
    </div>

    <!-- Localização -->
    <div class="card mb-5 flex flex-col gap-4">
      <h3 class="font-black text-neutral-900">Localização</h3>

      <div class="field">
        <label class="label">Bairro *</label>
        <div class="relative">
          <select v-model="bairroSelecionado" class="input pr-8">
            <option value="">Selecione o bairro</option>
            <option v-for="b in OPCOES_BAIRRO" :key="b" :value="b">{{ b }}</option>
          </select>
          <ChevronDown :size="15" class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
        </div>
      </div>

      <div v-if="bairroSelecionado === OPCAO_OUTRO" class="field">
        <label class="label">Qual bairro?</label>
        <input v-model="bairroOutro" class="input" placeholder="Digite o nome do bairro" />
      </div>

      <button
        type="button"
        class="gps-btn"
        :disabled="buscandoGps"
        @click="obterGps"
      >
        <MapPin :size="18" style="color:#7C3AED" />
        <span>
          {{ buscandoGps ? 'Obtendo localização...' : coords ? 'GPS capturado — tocar para atualizar' : 'Capturar localização por GPS' }}
        </span>
      </button>
      <p v-if="coords" class="text-xs text-neutral-400 text-center -mt-2">
        Posição exata registrada
      </p>
    </div>

    <!-- Recompensa -->
    <div class="card mb-5 flex flex-col gap-4">
      <h3 class="font-black text-neutral-900">Recompensa</h3>

      <label class="flex items-center gap-3 cursor-pointer select-none">
        <div class="relative">
          <input type="checkbox" v-model="recompensa" class="sr-only" />
          <div
            :class="['w-11 h-6 rounded-full transition-colors', recompensa ? 'bg-violet-600' : 'bg-neutral-300']"
          />
          <div
            :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', recompensa ? 'translate-x-5' : '']"
          />
        </div>
        <span class="font-semibold text-sm" style="color:#1A1626;">Oferecer recompensa por encontrar o pet</span>
      </label>

      <div v-if="recompensa" class="field">
        <label class="label">Valor da recompensa (opcional)</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold" style="color:#6B6578;">R$</span>
          <input
            v-model="valorRecompensa"
            type="text"
            class="input"
            style="padding-left:2.2rem;"
            placeholder="Ex: 200 (deixe em branco se não quiser informar)"
          />
        </div>
      </div>
    </div>

    <!-- Contato -->
    <div class="card mb-5 flex flex-col gap-4">
      <h3 class="font-black text-neutral-900">Contato</h3>

      <div class="obs-box">
        <Info :size="16" style="color:#7C3AED;flex-shrink:0;" />
        <p class="text-xs font-semibold" style="color:#7C3AED;line-height:1.5;">
          Mesmo sem contato, usuários da plataforma podem registrar que viram o pet — os avistamentos aparecem no histórico do cadastro.
        </p>
      </div>

      <label class="flex items-center gap-3 cursor-pointer select-none">
        <div class="relative">
          <input type="checkbox" v-model="contatoAtivado" class="sr-only" />
          <div :class="['w-11 h-6 rounded-full transition-colors', contatoAtivado ? 'bg-violet-600' : 'bg-neutral-300']" />
          <div :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', contatoAtivado ? 'translate-x-5' : '']" />
        </div>
        <span class="font-semibold text-sm" style="color:#1A1626;">Disponibilizar contato para quem encontrar</span>
      </label>

      <template v-if="contatoAtivado">
        <div
          v-for="(c, idx) in contatos"
          :key="idx"
          class="contato-row"
        >
          <!-- Seletor de tipo -->
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
          <!-- Input valor + remover -->
          <div class="flex gap-2 items-center">
            <input
              :value="c.valor"
              @input="onContatoInput(idx, c.tipo, $event)"
              class="input flex-1"
              :placeholder="c.tipo === 'whatsapp' ? 'Ex: 95 99999-9999' : c.tipo === 'instagram' ? 'Ex: @perfil ou link do Instagram' : 'Descreva o contato'"
              :type="c.tipo === 'whatsapp' ? 'tel' : 'text'"
              autocomplete="off"
              autocapitalize="none"
            />
            <button
              type="button"
              class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background:#FEE2E2"
              @click="removerContato(idx)"
            >
              <X :size="15" style="color:#EF4444" />
            </button>
          </div>
        </div>

        <button
          type="button"
          class="flex items-center gap-2 text-sm font-semibold self-start"
          style="color:#7C3AED"
          @click="adicionarContato"
        >
          <Plus :size="16" />
          Adicionar contato
        </button>
      </template>
    </div>

    <!-- Erro e enviar -->
    <div v-if="erro" class="insight-critical text-sm mb-4">{{ erro }}</div>

    <button
      type="button"
      class="btn-primary w-full py-4 text-base mb-10"
      :disabled="enviando || validandoFoto"
      @click="enviar"
    >
      <PawPrint :size="18" />
      {{ enviando ? 'Cadastrando...' : 'Cadastrar pet' }}
    </button>
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
.gps-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid #7C3AED;
  border-radius: 12px;
  padding: 12px 14px;
  background: #F5F3FF;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: #7C3AED;
  transition: background 0.15s;
}
.gps-btn:hover { background: #EDE9FE; }
.gps-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.contato-row {
  border-bottom: 1px solid #E5E0F0;
  padding-bottom: 12px;
}
.contato-row:last-of-type {
  border-bottom: none;
}
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
.obs-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #F5F3FF;
  border-radius: 10px;
  padding: 10px 12px;
}
</style>
