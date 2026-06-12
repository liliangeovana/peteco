import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { BAIRROS_BOA_VISTA, OPCAO_OUTRO, bairroMaisProximo } from '../../../constants/bairros';
import { SEM_RACA } from '../../../constants/racas';
import { validarFoto, criarPet, uploadFoto, lerBase64 } from '../model/petModel';
import { obterSessao } from '../../auth/model/authModel';

export default function useCadastrarController(onSuccess) {
  const [form, setForm] = useState({
    nome: '', especie: '', raca: '', cor: '', descricao: '',
    recompensa: false, valorRecompensa: '',
  });
  const [dataPerda, setDataPerda] = useState(null);
  const [bairroSelecionado, setBairroSelecionado] = useState('');
  const [bairroOutro, setBairroOutro]             = useState('');
  const [racaSelecionada, setRacaSelecionada]     = useState('');
  const [fotos, setFotos]                         = useState([]);
  const [fotosBase64, setFotosBase64]             = useState([]);
  const [fotosValidadas, setFotosValidadas]       = useState([]);
  const [validandoFoto, setValidandoFoto]         = useState(false);
  const [coords, setCoords]                       = useState(null);
  const [buscandoGps, setBuscandoGps]             = useState(false);
  const [enviando, setEnviando]                   = useState(false);
  const [contatoAtivado, setContatoAtivado]       = useState(false);
  const [contatos, setContatos]                   = useState([]);

  const toggleContatoAtivado = (val) => {
    setContatoAtivado(val);
    if (val) {
      setContatos(c => c.length === 0 ? [{ tipo: 'whatsapp', valor: '' }] : c);
    } else {
      setContatos([]);
    }
  };

  const set = (campo, valor) => {
    if (campo === 'recompensa' && !valor) {
      setForm(f => ({ ...f, recompensa: false, valorRecompensa: '' }));
    } else {
      setForm(f => ({ ...f, [campo]: valor }));
    }
  };

  const adicionarContato = () => setContatos(c => [...c, { tipo: 'whatsapp', valor: '' }]);
  const removerContato = (idx) => setContatos(c => c.filter((_, i) => i !== idx));
  const atualizarContato = (idx, campo, valor) => setContatos(c => {
    const n = [...c]; n[idx] = { ...n[idx], [campo]: valor }; return n;
  });

  const selecionarRaca = (raca) => {
    setRacaSelecionada(raca);
    set('raca', raca === SEM_RACA ? '' : raca);
  };

  const selecionarEspecie = (especie) => {
    set('especie', especie);
    if (especie === 'cachorro' || especie === 'gato') {
      setRacaSelecionada(SEM_RACA);
    } else {
      setRacaSelecionada('');
    }
    set('raca', '');
  };

  const removerFoto = (idx) => {
    setFotos(f => f.filter((_, i) => i !== idx));
    setFotosBase64(f => f.filter((_, i) => i !== idx));
    setFotosValidadas(f => f.filter((_, i) => i !== idx));
  };

  const resetFotos = () => {
    setFotos([]);
    setFotosBase64([]);
    setFotosValidadas([]);
    setValidandoFoto(false);
  };

  const selecionarFoto = async () => {
    if (fotos.length >= 3) {
      Alert.alert('Limite atingido', 'Você pode adicionar no máximo 3 fotos.');
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
      maxWidth: 800,
      maxHeight: 600,
    });
    if (res.canceled) return;

    const uri = res.assets[0].uri;
    const idx = fotos.length;
    setFotos(f => [...f, uri]);
    setFotosBase64(f => [...f, null]);
    setFotosValidadas(f => [...f, false]);
    setValidandoFoto(true);

    try {
      const [base64, session] = await Promise.all([lerBase64(uri), obterSessao()]);
      setFotosBase64(f => { const n = [...f]; n[idx] = base64; return n; });
      const resultado = await validarFoto(base64, session?.access_token);
      if (!resultado.data.aprovada) {
        removerFoto(idx);
        Alert.alert(
          'Foto não aprovada',
          resultado.data.motivo || 'A imagem não parece ser de um animal doméstico.',
        );
      } else {
        setFotosValidadas(f => { const n = [...f]; n[idx] = true; return n; });
      }
    } catch (err) {
      removerFoto(idx);
      const detalhe = err?.response?.data?.erro || err?.message || 'Erro desconhecido';
      Alert.alert('Erro na validação', detalhe);
    } finally {
      setValidandoFoto(false);
    }
  };

  const obterGps = async () => {
    setBuscandoGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da localização para cadastrar o pet.');
        return;
      }
      const local = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = local.coords;
      setCoords({ latitude, longitude });

      const bairro = bairroMaisProximo(latitude, longitude);
      setBairroSelecionado(bairro.nome);
      setBairroOutro('');
      Alert.alert('Localização capturada', `Bairro identificado: ${bairro.nome}`);
    } catch {
      Alert.alert('Erro', 'Não foi possível obter a localização');
    } finally {
      setBuscandoGps(false);
    }
  };

  const resetarFormulario = () => {
    setForm({ nome: '', especie: '', raca: '', cor: '', descricao: '', recompensa: false, valorRecompensa: '' });
    setDataPerda(null);
    setBairroSelecionado('');
    setBairroOutro('');
    setRacaSelecionada('');
    setCoords(null);
    setContatoAtivado(false);
    setContatos([]);
    resetFotos();
  };

  const enviar = async () => {
    if (!form.nome || !form.especie) {
      Alert.alert('Preencha pelo menos o nome e a espécie');
      return;
    }
    const bairroFinal = bairroSelecionado === OPCAO_OUTRO ? bairroOutro.trim() : bairroSelecionado;
    if (!bairroFinal) {
      Alert.alert('Selecione o bairro onde o pet foi visto');
      return;
    }
    if (fotos.length > 0 && fotosValidadas.some(v => !v)) {
      Alert.alert('Foto inválida', 'Há fotos não aprovadas pela IA. Remova-as antes de continuar.');
      return;
    }
    setEnviando(true);
    try {
      const session = await obterSessao();
      let foto_url = null;
      if (fotos.length > 0) {
        const urls = await Promise.all(fotos.map(f => uploadFoto(f)));
        foto_url = JSON.stringify(urls);
      }

      const latBairro = coords?.latitude  ?? BAIRROS_BOA_VISTA.find(b => b.nome === bairroSelecionado)?.lat;
      const lngBairro = coords?.longitude ?? BAIRROS_BOA_VISTA.find(b => b.nome === bairroSelecionado)?.lng;

      const contatosFiltrados = contatoAtivado
        ? contatos.filter(c => c.valor.trim())
        : [];

      const novoPet = await criarPet(
        {
          ...form,
          data_perda: dataPerda ? dataPerda.toISOString().split('T')[0] : null,
          bairro: bairroFinal,
          cidade: 'Boa Vista',
          foto_url,
          latitude: latBairro,
          longitude: lngBairro,
          recompensa: form.recompensa,
          valor_recompensa: form.recompensa && form.valorRecompensa ? parseFloat(form.valorRecompensa) : null,
          contatos: contatosFiltrados.length > 0 ? JSON.stringify(contatosFiltrados) : null,
        },
        session?.access_token,
      );

      resetarFormulario();
      onSuccess(novoPet.id);
    } catch (err) {
      Alert.alert('Erro ao cadastrar', err.response?.data?.erro || err.message);
    } finally {
      setEnviando(false);
    }
  };

  return {
    form,
    set,
    fotos,
    fotosValidadas,
    validandoFoto,
    coords,
    bairroSelecionado,
    bairroOutro,
    setBairroSelecionado,
    setBairroOutro,
    racaSelecionada,
    selecionarRaca,
    selecionarEspecie,
    buscandoGps,
    enviando,
    dataPerda,
    setDataPerda,
    selecionarFoto,
    removerFoto,
    obterGps,
    enviar,
    contatoAtivado,
    setContatoAtivado: toggleContatoAtivado,
    contatos,
    adicionarContato,
    removerContato,
    atualizarContato,
  };
}
