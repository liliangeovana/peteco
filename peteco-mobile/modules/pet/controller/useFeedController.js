import { useState, useEffect, useCallback } from 'react';
import { listarPets } from '../model/petModel';

export default function useFeedController() {
  const [pets, setPets]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoria, setCategoria]   = useState('');
  const [busca, setBusca]           = useState('');

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

  useEffect(() => { carregarPets(); }, [carregarPets]);

  const onRefresh = () => {
    setRefreshing(true);
    carregarPets();
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
    onRefresh,
    selecionarCategoria,
  };
}
