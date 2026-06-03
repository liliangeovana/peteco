import { useState, useEffect, useCallback } from 'react';
import { listarPetsDoUsuario } from '../model/petModel';
import { obterUsuario } from '../../auth/model/authModel';

export default function useMeusPetsController(onNaoAutenticado) {
  const [pets, setPets]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtro, setFiltro]         = useState('todos');

  const carregar = useCallback(async () => {
    try {
      const user = await obterUsuario();
      if (!user) { onNaoAutenticado?.(); return; }
      const data = await listarPetsDoUsuario();
      setPets(data);
    } catch {
      setPets([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const onRefresh = () => { setRefreshing(true); carregar(); };

  const petsFiltrados = filtro === 'todos'
    ? pets
    : pets.filter(p => p.status === filtro);

  const stats = {
    total:       pets.length,
    perdidos:    pets.filter(p => p.status === 'perdido').length,
    encontrados: pets.filter(p => p.status === 'encontrado').length,
  };

  return { pets, petsFiltrados, loading, refreshing, filtro, setFiltro, stats, onRefresh };
}
