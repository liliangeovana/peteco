import { useState, useRef } from 'react';
import { Alert } from 'react-native';
import * as Sharing from 'expo-sharing';

const SEM_RACA = 'Sem raça definida';

function tv(v) {
  return !!(v && String(v).trim() && v !== SEM_RACA);
}

function fmtDataBr(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('pt-BR'); } catch { return ''; }
}

const CAMPOS_INICIAL = {
  foto:       true,
  raca:       false,
  cor:        false,
  bairro:     false,
  dataPerda:  false,
  descricao:  false,
  recompensa: false,
  contato:    true,
};

const OVERRIDES_INICIAL = {
  raca:            '',
  cor:             '',
  bairro:          '',
  dataPerda:       '',
  descricao:       '',
  recompensaValor: '',
};

export default function useCompartilharController() {
  const [template, setTemplate]             = useState('story');
  const [campos, setCampos]                 = useState(CAMPOS_INICIAL);
  const [gerando, setGerando]               = useState(false);
  const [overrides, setOverrides]           = useState(OVERRIDES_INICIAL);
  const [contatoNomes, setContatoNomes]     = useState({});
  const [contatoAvulso, setContatoAvulso]   = useState({ nome: '', numero: '' });
  const [contatosExtras, setContatosExtras]         = useState([]);
  const [ocultarInstaNoPost, setOcultarInstaNoPost] = useState(false);
  const shotRef = useRef(null);

  const toggleCampo = (campo) =>
    setCampos(prev => ({ ...prev, [campo]: !prev[campo] }));

  const atualizarOverride = (campo, valor) =>
    setOverrides(prev => ({ ...prev, [campo]: valor }));

  const atualizarContatoNome = (idx, nome) =>
    setContatoNomes(prev => ({ ...prev, [String(idx)]: nome }));

  const atualizarContatoAvulso = (campo, valor) =>
    setContatoAvulso(prev => ({ ...prev, [campo]: valor }));

  const adicionarContatoExtra = () =>
    setContatosExtras(c => [...c, { tipo: 'whatsapp', valor: '', nome: '' }]);

  const removerContatoExtra = (idx) =>
    setContatosExtras(c => c.filter((_, i) => i !== idx));

  const atualizarContatoExtra = (idx, campo, valor) =>
    setContatosExtras(c => {
      const nova = [...c];
      nova[idx] = { ...nova[idx], [campo]: valor };
      return nova;
    });

  const inicializarComPet = (pet) => {
    setCampos({
      foto:       true,
      raca:       tv(pet?.raca),
      cor:        tv(pet?.cor),
      bairro:     tv(pet?.bairro),
      dataPerda:  tv(pet?.data_perda),
      descricao:  tv(pet?.descricao),
      recompensa: !!pet?.recompensa,
      contato:    true,
    });
    setOverrides({
      raca:            tv(pet?.raca) ? pet.raca : '',
      cor:             pet?.cor || '',
      bairro:          pet?.bairro || '',
      dataPerda:       fmtDataBr(pet?.data_perda),
      descricao:       pet?.descricao || '',
      recompensaValor: pet?.valor_recompensa ? String(pet.valor_recompensa) : '',
    });
    setContatoNomes({});
    setContatoAvulso({ nome: '', numero: '' });
    setContatosExtras([]);
    setOcultarInstaNoPost(false);
  };

  const gerarECompartilhar = async (nomePet) => {
    if (!shotRef.current) return;
    setGerando(true);
    try {
      const uri = await shotRef.current.capture();
      const disponivel = await Sharing.isAvailableAsync();
      if (!disponivel) {
        Alert.alert('Indisponível', 'Compartilhamento não suportado neste dispositivo.');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: `Compartilhar ${nomePet || 'pet'}`,
      });
    } catch {
      Alert.alert('Erro', 'Não foi possível gerar a imagem. Tente novamente.');
    } finally {
      setGerando(false);
    }
  };

  return {
    template, setTemplate,
    campos, toggleCampo,
    overrides, atualizarOverride,
    contatoNomes, atualizarContatoNome,
    contatoAvulso, atualizarContatoAvulso,
    contatosExtras, adicionarContatoExtra, removerContatoExtra, atualizarContatoExtra,
    ocultarInstaNoPost, setOcultarInstaNoPost,
    inicializarComPet,
    gerando, gerarECompartilhar,
    shotRef,
  };
}
