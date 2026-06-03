import { useState, useEffect } from 'react';
import { listarPets } from '../model/petModel';

export default function useMapaController() {
  const [pets, setPets]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarPets({ status: 'perdido' })
      .then(setPets)
      .catch(() => setPets([]))
      .finally(() => setLoading(false));
  }, []);

  return { pets, loading };
}
