import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { listarPets, buscarNotificacoes } from '../model/petModel';
import { obterSessao } from '../../auth/model/authModel';

export default function useFeedController() {
  const [pets, setPets]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [categoria, setCategoria]     = useState('');
  const [busca, setBusca]             = useState('');
  const [notificacoes, setNotificacoes] = useState({});

  const carregarPets = useCallback(async (especie = categoria) => {
    try {
      const params = { status: 'perdido' };
      if (especie) params.especie = especie;
      const data = await listarPets(params);
      setPets(data);
    } catch {
      setPets([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categoria]);

  const carregarNotificacoes = useCallback(async () => {
    try {
      const session = await obterSessao();
      if (!session?.access_token) return;
      const data = await buscarNotificacoes(session.access_token);
      const mapa = {};
      data.forEach(n => { mapa[n.pet_id] = n.count; });
      setNotificacoes(mapa);
    } catch {
      // silencia — notificações são opcionais
    }
  }, []);

  useFocusEffect(useCallback(() => {
    carregarPets();
    carregarNotificacoes();
  }, [carregarPets, carregarNotificacoes]));

  const onRefresh = () => {
    setRefreshing(true);
    carregarPets();
    carregarNotificacoes();
  };

  const selecionarCategoria = (filtro) => {
    setCategoria(filtro);
    setLoading(true);
    carregarPets(filtro);
  };

  const petsFiltrados = pets.filter(p =>
    busca === '' ||
    p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    p.bairro?.toLowerCase().includes(busca.toLowerCase())
  );

  return {
    pets,
    petsFiltrados,
    loading,
    refreshing,
    categoria,
    busca,
    setBusca,
    notificacoes,
    onRefresh,
    selecionarCategoria,
  };
}
