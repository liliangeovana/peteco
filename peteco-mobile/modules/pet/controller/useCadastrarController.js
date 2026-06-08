import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { BAIRROS_BOA_VISTA, OPCAO_OUTRO, bairroMaisProximo } from '../../../constants/bairros';
import { SEM_RACA } from '../../../constants/racas';
import { validarFoto, buscarSimilares, criarPet, uploadFoto, lerBase64 } from '../model/petModel';
import { obterSessao } from '../../auth/model/authModel';

function ddmmAAAA_para_iso(data) {
  if (!data || data.length < 10) return data || null;
  const [dd, mm, aaaa] = data.split('/');
  if (!dd || !mm || !aaaa || aaaa.length < 4) return null;
  return `${aaaa}-${mm}-${dd}`;
}

export default function useCadastrarController(onSuccess) {
  const [form, setForm] = useState({
    nome: '', especie: 'cachorro', raca: '', cor: '',
    descricao: '', data_perda: '',
  });
  const [bairroSelecionado, setBairroSelecionado] = useState('');
  const [bairroOutro, setBairroOutro]             = useState('');
  const [racaSelecionada, setRacaSelecionada]     = useState('');
  const [foto, setFoto]                           = useState(null);
  const [fotoBase64, setFotoBase64]               = useState(null);
  const [coords, setCoords]                       = useState(null);
  const [buscandoGps, setBuscandoGps]             = useState(false);
  const [enviando, setEnviando]                   = useState(false);
  const [validandoFoto, setValidandoFoto]         = useState(false);
  const [fotoValidada, setFotoValidada]           = useState(false);

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const selecionarRaca = (raca) => {
    setRacaSelecionada(raca);
    set('raca', raca === SEM_RACA ? '' : raca);
  };

  const selecionarEspecie = (especie) => {
    set('especie', especie);
    setRacaSelecionada('');
    set('raca', '');
  };

  const resetFoto = () => {
    setFoto(null);
    setFotoBase64(null);
    setFotoValidada(false);
  };

  const handleDataPerda = (texto) => {
    const nums = texto.replace(/\D/g, '').slice(0, 8);
    let formatado = nums;
    if (nums.length > 4) formatado = `${nums.slice(0,2)}/${nums.slice(2,4)}/${nums.slice(4)}`;
    else if (nums.length > 2) formatado = `${nums.slice(0,2)}/${nums.slice(2)}`;
    set('data_perda', formatado);
  };

  const selecionarFoto = async () => {
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
    resetFoto();
    setFoto(uri);
    setValidandoFoto(true);
    try {
      const [base64, session] = await Promise.all([lerBase64(uri), obterSessao()]);
      setFotoBase64(base64);
      const resultado = await validarFoto(base64, session?.access_token);
      if (!resultado.data.aprovada) {
        resetFoto();
        Alert.alert(
          'Foto não aprovada',
          resultado.data.motivo || 'A imagem não parece ser de um animal doméstico.',
        );
      } else {
        setFotoValidada(true);
      }
    } catch (err) {
      resetFoto();
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

  const verificarSimilares = async () => {
    if (!foto || !fotoValidada || !fotoBase64) return true;
    try {
      const session = await obterSessao();
      const bairroFinal = bairroSelecionado === OPCAO_OUTRO ? bairroOutro : bairroSelecionado;
      const res = await buscarSimilares({
        imagemBase64: fotoBase64,
        especie: form.especie,
        cor: form.cor,
        raca: form.raca,
        cidade: 'Boa Vista',
      }, session?.access_token);
      if (res.data?.length > 0) {
        const nomes = res.data.map(s => `• ${s.pet.nome} (${s.justificativa})`).join('\n');
        return await new Promise(resolve => {
          Alert.alert(
            'Pets similares encontrados',
            `Encontramos ${res.data.length} pet(s) que pode(m) ser o mesmo animal:\n\n${nomes}\n\nDeseja continuar cadastrando mesmo assim?`,
            [
              { text: 'Cancelar', onPress: () => resolve(false), style: 'cancel' },
              { text: 'Continuar', onPress: () => resolve(true) },
            ]
          );
        });
      }
    } catch (err) {
      console.warn('[verificarSimilares]', err?.message);
    }
    return true;
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
    if (foto && !fotoValidada) {
      Alert.alert('Foto inválida', 'A foto selecionada não foi aprovada pela IA. Selecione uma foto do seu pet.');
      return;
    }
    setEnviando(true);
    try {
      const deveConfirmar = await verificarSimilares();
      if (!deveConfirmar) return;

      const session = await obterSessao();
      let foto_url = null;
      if (foto) foto_url = await uploadFoto(foto);

      const latBairro = coords?.latitude  ?? BAIRROS_BOA_VISTA.find(b => b.nome === bairroSelecionado)?.lat;
      const lngBairro = coords?.longitude ?? BAIRROS_BOA_VISTA.find(b => b.nome === bairroSelecionado)?.lng;

      await criarPet(
        {
          ...form,
          data_perda: ddmmAAAA_para_iso(form.data_perda),
          bairro: bairroFinal,
          cidade: 'Boa Vista',
          foto_url,
          latitude: latBairro,
          longitude: lngBairro,
        },
        session?.access_token,
      );

      Alert.alert('Pet cadastrado! 🐾', 'Agora ele aparece no feed e no mapa.', [
        { text: 'OK', onPress: onSuccess },
      ]);
    } catch (err) {
      Alert.alert('Erro ao cadastrar', err.response?.data?.erro || err.message);
    } finally {
      setEnviando(false);
    }
  };

  return {
    form,
    set,
    foto,
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
    validandoFoto,
    fotoValidada,
    selecionarFoto,
    obterGps,
    handleDataPerda,
    enviar,
  };
}
