import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { buscarCep } from '../../../shared/hooks/useCep';
import { validarFoto, buscarSimilares, criarPet, uploadFoto, lerBase64 } from '../model/petModel';
import { obterSessao } from '../../auth/model/authModel';

export default function useCadastrarController(onSuccess) {
  const [form, setForm] = useState({
    nome: '', especie: 'cachorro', raca: '', cor: '',
    descricao: '', data_perda: '', cep: '',
    endereco: '', bairro: '', cidade: '',
  });
  const [foto, setFoto]                   = useState(null);
  const [coords, setCoords]               = useState(null);
  const [buscandoCep, setBuscandoCep]     = useState(false);
  const [buscandoGps, setBuscandoGps]     = useState(false);
  const [enviando, setEnviando]           = useState(false);
  const [validandoFoto, setValidandoFoto] = useState(false);
  const [fotoValidada, setFotoValidada]   = useState(false);

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  // Selecionar foto da galeria
  const selecionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (res.canceled) return;

    const uri = res.assets[0].uri;
    setFoto(uri);
    setFotoValidada(false);
    setValidandoFoto(true);
    try {
      const base64 = await lerBase64(uri);
      const resultado = await validarFoto(base64);
      if (!resultado.data.aprovada) {
        setFoto(null);
        Alert.alert(
          'Foto não aprovada',
          resultado.data.motivo || 'A imagem não parece ser de um animal doméstico.',
        );
      } else {
        setFotoValidada(true);
      }
    } catch {
      setFotoValidada(true);
    } finally {
      setValidandoFoto(false);
    }
  };

  // Obter localização via GPS
  const obterGps = async () => {
    setBuscandoGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da localização para cadastrar o pet.');
        return;
      }
      const local = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setCoords({ latitude: local.coords.latitude, longitude: local.coords.longitude });
      Alert.alert('GPS capturado! 📍', `${local.coords.latitude.toFixed(4)}, ${local.coords.longitude.toFixed(4)}`);
    } catch {
      Alert.alert('Erro', 'Não foi possível obter a localização');
    } finally {
      setBuscandoGps(false);
    }
  };

  // Formatar e buscar endereço pelo CEP
  const handleCep = async (texto) => {
    const nums = texto.replace(/\D/g, '').slice(0, 8);
    const formatado = nums.length > 5 ? `${nums.slice(0, 5)}-${nums.slice(5)}` : nums;
    set('cep', formatado);
    if (nums.length === 8) {
      setBuscandoCep(true);
      try {
        const end = await buscarCep(nums);
        set('bairro', end.bairro);
        set('cidade', end.cidade);
      } catch (err) {
        Alert.alert('CEP não encontrado', err.message);
      } finally {
        setBuscandoCep(false);
      }
    }
  };

  // Verificar pets similares usando IA antes de enviar
  const verificarSimilares = async () => {
    if (!foto || !fotoValidada) return true;
    try {
      const base64 = await lerBase64(foto);
      const res = await buscarSimilares({
        imagemBase64: base64,
        especie: form.especie,
        cor: form.cor,
        raca: form.raca,
        cidade: form.cidade,
      });
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
    } catch {
      // silencia erros de IA — não bloqueia o cadastro
    }
    return true;
  };

  // Enviar dados para criar o pet
  const enviar = async () => {
    if (!form.nome || !form.especie) {
      Alert.alert('Preencha pelo menos o nome e a espécie');
      return;
    }
    setEnviando(true);
    try {
      const deveConfirmar = await verificarSimilares();
      if (!deveConfirmar) return;

      const session = await obterSessao();
      let foto_url = null;
      if (foto) foto_url = await uploadFoto(foto);

      await criarPet(
        { ...form, foto_url, latitude: coords?.latitude, longitude: coords?.longitude },
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
    buscandoCep,
    buscandoGps,
    enviando,
    validandoFoto,
    fotoValidada,
    selecionarFoto,
    obterGps,
    handleCep,
    enviar,
  };
}
