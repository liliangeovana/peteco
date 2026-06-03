import { useState } from 'react';
import { listarPets } from '../model/petModel';

export default function useBuscaController() {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [buscou, setBuscou]         = useState(false);
  const [filtros, setFiltros]       = useState({ especie: '', cidade: '' });

  const set = (campo, valor) => setFiltros(f => ({ ...f, [campo]: valor }));

  const buscar = async () => {
    setLoading(true);
    setBuscou(true);
    try {
      const params = { status: 'perdido' };
      if (filtros.especie) params.especie = filtros.especie;
      if (filtros.cidade)  params.cidade  = filtros.cidade;
      const data = await listarPets(params);
      setResultados(data);
    } catch {
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return { resultados, loading, buscou, filtros, set, buscar };
}
