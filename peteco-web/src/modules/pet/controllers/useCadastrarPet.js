import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '../../../client/http.js'
import { supabase } from '../../../lib/supabase.js'
import { useAuth } from '../../auth/controllers/useAuth.js'
import { BAIRROS_BOA_VISTA, OPCAO_OUTRO, bairroMaisProximo } from '../../../constants/bairros.js'
import { SEM_RACA, RACAS } from '../../../constants/racas.js'

export function useCadastrarPet() {
  const router = useRouter()
  const { usuario } = useAuth()

  const form = reactive({ nome: '', especie: '', raca: '', cor: '', descricao: '' })
  const dataPerda         = ref(null)
  const bairroSelecionado = ref('')
  const bairroOutro       = ref('')
  const racaSelecionada   = ref('')
  const fotos             = ref([])   // File objects
  const fotosPreview      = ref([])   // data URL strings for preview
  const fotosValidadas    = ref([])
  const validandoFoto     = ref(false)
  const coords            = ref(null)
  const buscandoGps       = ref(false)
  const recompensa        = ref(false)
  const valorRecompensa   = ref('')
  const contatoAtivado    = ref(false)
  const contatos          = ref([])   // [{ tipo: 'whatsapp'|'instagram'|'outro', valor: '' }]
  const enviando          = ref(false)
  const erro              = ref('')

  function set(campo, valor) {
    form[campo] = valor
  }

  watch(recompensa, (val) => {
    if (!val) valorRecompensa.value = ''
  })

  watch(contatoAtivado, (val) => {
    if (val) {
      if (contatos.value.length === 0) contatos.value = [{ tipo: 'whatsapp', valor: '' }]
    } else {
      contatos.value = []
    }
  })

  function adicionarContato() {
    contatos.value = [...contatos.value, { tipo: 'whatsapp', valor: '' }]
  }

  function removerContato(idx) {
    contatos.value = contatos.value.filter((_, i) => i !== idx)
  }

  function atualizarContato(idx, campo, valor) {
    const updated = contatos.value.map((c, i) => i === idx ? { ...c, [campo]: valor } : c)
    contatos.value = updated
  }

  function selecionarEspecie(especie) {
    form.especie = especie
    if (especie === 'cachorro' || especie === 'gato') {
      racaSelecionada.value = SEM_RACA
    } else {
      racaSelecionada.value = ''
    }
    form.raca = ''
  }

  function selecionarRaca(raca) {
    racaSelecionada.value = raca
    form.raca = raca === SEM_RACA ? '' : raca
  }

  function racasDisponiveis() {
    return RACAS[form.especie] ?? RACAS.outro
  }

  async function adicionarFoto(file) {
    if (fotos.value.length >= 3) return
    const preview = URL.createObjectURL(file)
    const idx = fotos.value.length
    fotos.value = [...fotos.value, file]
    fotosPreview.value = [...fotosPreview.value, preview]
    fotosValidadas.value = [...fotosValidadas.value, false]
    validandoFoto.value = true
    erro.value = ''

    try {
      const base64 = await fileToBase64(file)
      const { data } = await http.post('/pets/validar-foto', { imagemBase64: base64 }, { timeout: 60000 })
      if (!data.aprovada) {
        removerFoto(idx)
        erro.value = data.motivo || 'A imagem não parece ser de um animal doméstico.'
      } else {
        const updated = [...fotosValidadas.value]
        updated[idx] = true
        fotosValidadas.value = updated
      }
    } catch (e) {
      removerFoto(idx)
      erro.value = e?.response?.data?.erro || 'Erro ao validar a foto.'
    } finally {
      validandoFoto.value = false
    }
  }

  function removerFoto(idx) {
    fotos.value        = fotos.value.filter((_, i) => i !== idx)
    fotosPreview.value = fotosPreview.value.filter((_, i) => i !== idx)
    fotosValidadas.value = fotosValidadas.value.filter((_, i) => i !== idx)
  }

  async function obterGps() {
    if (!navigator.geolocation) {
      erro.value = 'Seu navegador não suporta geolocalização.'
      return
    }
    buscandoGps.value = true
    erro.value = ''
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        })
      )
      const { latitude, longitude } = pos.coords
      coords.value = { latitude, longitude }
      const bairro = bairroMaisProximo(latitude, longitude)
      bairroSelecionado.value = bairro.nome
      bairroOutro.value = ''
    } catch (e) {
      if (e?.code === 1) {
        erro.value = 'Permissão de localização negada. Habilite o GPS nas configurações do navegador.'
      } else if (e?.code === 2) {
        erro.value = 'Posição indisponível. Verifique se o GPS/Wi-Fi está ativo.'
      } else if (e?.code === 3) {
        erro.value = 'Tempo esgotado ao obter localização. Tente novamente.'
      } else {
        erro.value = 'Não foi possível obter a localização.'
      }
    } finally {
      buscandoGps.value = false
    }
  }

  async function uploadFoto(file) {
    const bytes = await file.arrayBuffer()
    const nome = `pets/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`
    const { error } = await supabase.storage
      .from('fotos-pets')
      .upload(nome, bytes, { contentType: 'image/jpeg' })
    if (error) throw error
    const { data } = supabase.storage.from('fotos-pets').getPublicUrl(nome)
    return data.publicUrl
  }

  async function enviar() {
    erro.value = ''
    if (!form.nome || !form.especie) {
      erro.value = 'Preencha pelo menos o nome e a espécie.'
      return
    }
    const bairroFinal = bairroSelecionado.value === OPCAO_OUTRO
      ? bairroOutro.value.trim()
      : bairroSelecionado.value
    if (!bairroFinal) {
      erro.value = 'Selecione o bairro onde o pet foi visto.'
      return
    }
    if (fotos.value.length > 0 && fotosValidadas.value.some(v => !v)) {
      erro.value = 'Há fotos não aprovadas. Remova-as antes de continuar.'
      return
    }

    enviando.value = true
    try {
      let foto_url = null
      if (fotos.value.length > 0) {
        const urls = await Promise.all(fotos.value.map(f => uploadFoto(f)))
        foto_url = JSON.stringify(urls)
      }

      const bairroObj = BAIRROS_BOA_VISTA.find(b => b.nome === bairroSelecionado.value)
      const lat = coords.value?.latitude  ?? bairroObj?.lat ?? null
      const lng = coords.value?.longitude ?? bairroObj?.lng ?? null

      const contatosFiltrados = contatoAtivado.value
        ? contatos.value.filter(c => c.valor.trim())
        : []

      const { data } = await http.post('/pets', {
        ...form,
        data_perda:      dataPerda.value || null,
        bairro:          bairroFinal,
        cidade:          'Boa Vista',
        foto_url,
        latitude:        lat,
        longitude:       lng,
        recompensa:      recompensa.value,
        valor_recompensa: recompensa.value && valorRecompensa.value.trim()
          ? valorRecompensa.value.trim()
          : null,
        contatos: contatosFiltrados.length > 0 ? JSON.stringify(contatosFiltrados) : null,
      })

      router.push(`/pet/${data.id}`)
    } catch (e) {
      erro.value = e?.response?.data?.erro || 'Erro ao cadastrar o pet.'
    } finally {
      enviando.value = false
    }
  }

  return {
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
    BAIRROS_BOA_VISTA, OPCAO_OUTRO,
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      resolve(result.includes(',') ? result.split(',')[1] : result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
