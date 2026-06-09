import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  buscarPetPorId,
  marcarEncontrado as marcarEncontradoModel,
  listarSimilares,
  listarAvistamentos,
  criarAvistamento,
  marcarAvistamentosVistos,
  uploadFoto,
  atualizarPet,
  excluirPet as excluirPetModel,
  validarFoto,
  lerBase64,
} from '../model/petModel';
import { obterUsuario, obterSessao } from '../../auth/model/authModel';
import { BAIRROS_BOA_VISTA, OPCAO_OUTRO } from '../../../constants/bairros';
import { SEM_RACA } from '../../../constants/racas';

export default function useDetalhePetController(id, onNaoEncontrado) {
  const [pet, setPet]                           = useState(null);
  const [loading, setLoading]                   = useState(true);
  const [usuario, setUsuario]                   = useState(null);
  const [salvando, setSalvando]                 = useState(false);
  const [similares, setSimilares]               = useState([]);
  const [loadingSimilares, setLoadingSimilares] = useState(false);
  const [avistamentos, setAvistamentos]         = useState([]);
  const [loadingAvist, setLoadingAvist]         = useState(false);

  // edição do pet
  const [formEdit, setFormEdit]                   = useState({});
  const [dataEditPerda, setDataEditPerda]         = useState(null);
  const [fotosEdit, setFotosEdit]                 = useState([]);
  const [fotosEditValidadas, setFotosEditValidadas] = useState([]);
  const [validandoFotoEdit, setValidandoFotoEdit] = useState(false);
  const [racaEditSel, setRacaEditSel]             = useState('');
  const [bairroEditSel, setBairroEditSel]         = useState('');
  const [bairroEditOutro, setBairroEditOutro]     = useState('');
  const [salvandoEdicao, setSalvandoEdicao]       = useState(false);
  const [excluindo, setExcluindo]                 = useState(false);

  // formulário de avistamento
  const [formAvist, setFormAvist]             = useState({ bairro: '', rua: '', descricao: '' });
  const [bairroAvistSel, setBairroAvistSel]   = useState('');
  const [bairroAvistOutro, setBairroAvistOutro] = useState('');
  const [fotosAvist, setFotosAvist]           = useState([]);
  const [enviandoAvist, setEnviandoAvist]     = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [petData, user] = await Promise.all([buscarPetPorId(id), obterUsuario()]);
        setPet(petData);
        setUsuario(user);
        buscarSim();
        buscarAvist();

        // marca avistamentos como vistos se o usuário logado é o dono
        if (user && petData && user.id === petData.usuario_id) {
          obterSessao().then(session => {
            if (session?.access_token)
              marcarAvistamentosVistos(id, session.access_token).catch(() => {});
          });
        }
      } catch {
        Alert.alert('Erro', 'Pet não encontrado');
        onNaoEncontrado?.();
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id]);

  const buscarSim = async () => {
    setLoadingSimilares(true);
    try { setSimilares(await listarSimilares(id)); }
    catch { /* silencia */ }
    finally { setLoadingSimilares(false); }
  };

  const buscarAvist = async () => {
    setLoadingAvist(true);
    try { setAvistamentos(await listarAvistamentos(id)); }
    catch { /* silencia */ }
    finally { setLoadingAvist(false); }
  };

  const setAvist = (campo, valor) => setFormAvist(f => ({ ...f, [campo]: valor }));

  const selecionarFotoAvist = async () => {
    if (fotosAvist.length >= 3) {
      Alert.alert('Limite atingido', 'Máximo de 3 fotos por avistamento.');
      return;
    }

    const origem = await new Promise(resolve =>
      Alert.alert('Adicionar foto', 'Escolha a origem', [
        { text: 'Câmera',  onPress: () => resolve('camera') },
        { text: 'Galeria', onPress: () => resolve('galeria') },
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
      ])
    );
    if (!origem) return;

    if (origem === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à câmera.');
        return;
      }
      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true, aspect: [4, 3], quality: 0.3,
      });
      if (!res.canceled) setFotosAvist(f => [...f, res.assets[0].uri]);
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à galeria.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3],
        quality: 0.3, maxWidth: 800, maxHeight: 600,
      });
      if (!res.canceled) setFotosAvist(f => [...f, res.assets[0].uri]);
    }
  };

  const removerFotoAvist = (idx) => setFotosAvist(f => f.filter((_, i) => i !== idx));

  const registrarAvistamento = async () => {
    const bairroFinal = bairroAvistSel === OPCAO_OUTRO
      ? bairroAvistOutro.trim()
      : bairroAvistSel;

    if (!bairroFinal) {
      Alert.alert('Bairro obrigatório', 'Informe o bairro onde viu o pet.');
      return false;
    }
    if (!formAvist.descricao.trim()) {
      Alert.alert('Descrição obrigatória', 'Conte como e onde você viu o pet.');
      return false;
    }
    setEnviandoAvist(true);
    try {
      const session = await obterSessao();

      let fotos_url = null;
      if (fotosAvist.length > 0) {
        const urls = await Promise.all(fotosAvist.map(f => uploadFoto(f)));
        fotos_url = JSON.stringify(urls);
      }

      const novo = await criarAvistamento(
        id,
        { bairro: bairroFinal, rua: formAvist.rua || null, descricao: formAvist.descricao.trim(), fotos_url },
        session?.access_token,
      );
      setAvistamentos(prev => [novo, ...prev]);
      setFormAvist({ bairro: '', rua: '', descricao: '' });
      setBairroAvistSel('');
      setBairroAvistOutro('');
      setFotosAvist([]);
      Alert.alert('Avistamento registrado!', 'Obrigado por ajudar a encontrar este pet 🐾');
      return true;
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.erro || err.message);
      return false;
    } finally {
      setEnviandoAvist(false);
    }
  };

  const iniciarEditar = () => {
    setFormEdit({
      nome: pet?.nome || '',
      especie: pet?.especie || '',
      cor: pet?.cor || '',
      descricao: pet?.descricao || '',
    });
    setDataEditPerda(pet?.data_perda ? new Date(pet.data_perda.split('T')[0] + 'T12:00:00') : null);
    setBairroEditSel(pet?.bairro || '');
    setBairroEditOutro('');
    setRacaEditSel(pet?.raca || SEM_RACA);
    try {
      const urls = JSON.parse(pet?.foto_url || '[]');
      const fotos = Array.isArray(urls) ? urls : pet?.foto_url ? [pet.foto_url] : [];
      setFotosEdit(fotos);
      setFotosEditValidadas(fotos.map(() => true));
    } catch {
      const fotos = pet?.foto_url ? [pet.foto_url] : [];
      setFotosEdit(fotos);
      setFotosEditValidadas(fotos.map(() => true));
    }
  };

  const setEdit = (campo, valor) => setFormEdit(f => ({ ...f, [campo]: valor }));

  const selecionarEspecieEdit = (especie) => {
    setEdit('especie', especie);
    setRacaEditSel(especie === 'cachorro' || especie === 'gato' ? SEM_RACA : '');
  };

  const selecionarFotoEdit = async () => {
    if (fotosEdit.length >= 3) {
      Alert.alert('Limite atingido', 'Máximo de 3 fotos.');
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3],
      quality: 0.3, maxWidth: 800, maxHeight: 600,
    });
    if (res.canceled) return;

    const uri = res.assets[0].uri;
    const idx = fotosEdit.length;
    setFotosEdit(f => [...f, uri]);
    setFotosEditValidadas(f => [...f, false]);
    setValidandoFotoEdit(true);
    try {
      const [base64, session] = await Promise.all([lerBase64(uri), obterSessao()]);
      const resultado = await validarFoto(base64, session?.access_token);
      if (!resultado.data.aprovada) {
        removerFotoEdit(idx);
        Alert.alert('Foto não aprovada', resultado.data.motivo || 'A imagem não parece ser de um animal doméstico.');
      } else {
        setFotosEditValidadas(f => { const n = [...f]; n[idx] = true; return n; });
      }
    } catch (err) {
      removerFotoEdit(idx);
      Alert.alert('Erro na validação', err?.response?.data?.erro || err?.message || 'Erro desconhecido');
    } finally {
      setValidandoFotoEdit(false);
    }
  };

  const removerFotoEdit = (idx) => {
    setFotosEdit(f => f.filter((_, i) => i !== idx));
    setFotosEditValidadas(f => f.filter((_, i) => i !== idx));
  };

  const salvarEdicao = async () => {
    if (!formEdit.nome?.trim()) {
      Alert.alert('Nome obrigatório', 'Informe o nome do pet.');
      return false;
    }
    const bairroFinal = bairroEditSel === OPCAO_OUTRO ? bairroEditOutro.trim() : bairroEditSel;
    if (!bairroFinal) {
      Alert.alert('Bairro obrigatório', 'Selecione o bairro onde o pet foi visto por último.');
      return false;
    }
    if (fotosEdit.some((f, i) => !f.startsWith('http') && !fotosEditValidadas[i])) {
      Alert.alert('Foto pendente', 'Aguarde a validação das fotos antes de salvar.');
      return false;
    }
    setSalvandoEdicao(true);
    try {
      const session = await obterSessao();
      const urlsFinais = await Promise.all(
        fotosEdit.map(f => f.startsWith('http') ? f : uploadFoto(f))
      );
      const petAtualizado = await atualizarPet(
        id,
        {
          ...formEdit,
          nome: formEdit.nome.trim(),
          data_perda: dataEditPerda ? dataEditPerda.toISOString().split('T')[0] : null,
          bairro: bairroFinal,
          foto_url: urlsFinais.length > 0 ? JSON.stringify(urlsFinais) : null,
          raca: racaEditSel === SEM_RACA ? '' : racaEditSel,
        },
        session?.access_token,
      );
      setPet(p => ({ ...p, ...petAtualizado }));
      Alert.alert('Salvo!', 'As informações foram atualizadas.');
      return true;
    } catch (err) {
      Alert.alert('Erro ao salvar', err.response?.data?.erro || err.message);
      return false;
    } finally {
      setSalvandoEdicao(false);
    }
  };

  const confirmarExcluir = () => {
    Alert.alert(
      'Excluir pet',
      `Tem certeza que deseja excluir o registro de ${pet?.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () =>
            Alert.alert(
              'Confirmar exclusão',
              'Esta ação é permanente. Todos os avistamentos também serão removidos.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sim, excluir', style: 'destructive', onPress: executarExclusao },
              ]
            ),
        },
      ]
    );
  };

  const executarExclusao = async () => {
    setExcluindo(true);
    try {
      const session = await obterSessao();
      await excluirPetModel(id, session?.access_token);
      onNaoEncontrado?.();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.erro || err.message);
    } finally {
      setExcluindo(false);
    }
  };

  const marcarEncontrado = async () => {
    setSalvando(true);
    try {
      const session = await obterSessao();
      await marcarEncontradoModel(id, session?.access_token);
      setPet(p => ({ ...p, status: 'encontrado' }));
      Alert.alert('🎉 Ótima notícia!', `${pet.nome} foi marcado como encontrado!`);
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o status');
    } finally {
      setSalvando(false);
    }
  };

  return {
    pet, loading, usuario, salvando,
    similares, loadingSimilares,
    avistamentos, loadingAvist,
    formAvist, setAvist,
    bairroAvistSel, setBairroAvistSel,
    bairroAvistOutro, setBairroAvistOutro,
    fotosAvist, selecionarFotoAvist, removerFotoAvist,
    enviandoAvist, registrarAvistamento,
    marcarEncontrado,
    // edição
    formEdit, setEdit,
    dataEditPerda, setDataEditPerda,
    fotosEdit, fotosEditValidadas, validandoFotoEdit,
    selecionarFotoEdit, removerFotoEdit,
    bairroEditSel, setBairroEditSel,
    bairroEditOutro, setBairroEditOutro,
    racaEditSel, setRacaEditSel,
    selecionarEspecieEdit,
    salvandoEdicao, salvarEdicao, iniciarEditar,
    // exclusão
    excluindo, confirmarExcluir,
  };
}
