import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { listarPets } from '../model/petModel';
import { obterUsuario } from '../../auth/model/authModel';

export default function useMapaController() {
  const [pets, setPets]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [bairroUsuario, setBairroUsuario] = useState('');

  useEffect(() => {
    obterUsuario().then(u => {
      const b = u?.user_metadata?.bairro;
      if (b) setBairroUsuario(b);
    });
  }, []);

  useFocusEffect(useCallback(() => {
    setLoading(true);
    listarPets({ status: 'perdido' })
      .then(setPets)
      .catch(() => setPets([]))
      .finally(() => setLoading(false));
  }, []));

  return { pets, loading, bairroUsuario };
}
