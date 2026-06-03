import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { buscarPetPorId, marcarEncontrado as marcarEncontradoModel, listarSimilares } from '../model/petModel';
import { obterUsuario, obterSessao } from '../../auth/model/authModel';

export default function useDetalhePetController(id, onNaoEncontrado) {
  const [pet, setPet]                         = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [usuario, setUsuario]                 = useState(null);
  const [salvando, setSalvando]               = useState(false);
  const [similares, setSimilares]             = useState([]);
  const [loadingSimilares, setLoadingSimilares] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [petData, user] = await Promise.all([
          buscarPetPorId(id),
          obterUsuario(),
        ]);
        setPet(petData);
        setUsuario(user);
        buscarSim();
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
    try {
      const data = await listarSimilares(id);
      setSimilares(data);
    } catch {
      // silencia — similares é opcional
    } finally {
      setLoadingSimilares(false);
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

  return { pet, loading, usuario, salvando, similares, loadingSimilares, marcarEncontrado };
}
