import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { obterUsuario, logout as logoutModel } from '../../auth/model/authModel';
import { buscarPerfil, salvarPerfil } from '../model/perfilModel';

export default function usePerfilController(onNaoAutenticado, onLogout) {
  const [usuario, setUsuario]   = useState(null);
  const [perfil, setPerfil]     = useState({ nome: '', telefone: '', bairro: '' });
  const [loading, setLoading]   = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        const user = await obterUsuario();
        if (!user) { onNaoAutenticado?.(); return; }
        setUsuario(user);
        const data = await buscarPerfil(user.id);
        if (data) setPerfil({ nome: data.nome || '', telefone: data.telefone || '', bairro: data.bairro || '' });
        else      setPerfil({ nome: user.user_metadata?.nome || '', telefone: '', bairro: user.user_metadata?.bairro || '' });
      } catch {
        /* mantém estado vazio */
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const salvar = async () => {
    setSalvando(true);
    try {
      await salvarPerfil(usuario.id, perfil.nome, perfil.telefone, perfil.bairro);
      setEditando(false);
      Alert.alert('Perfil atualizado! ✅');
    } catch (err) {
      Alert.alert('Erro ao salvar', err.message);
    } finally {
      setSalvando(false);
    }
  };

  const logout = () => {
    Alert.alert('Sair', 'Tem certeza que quer sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logoutModel();
          onLogout?.();
        },
      },
    ]);
  };

  return {
    usuario,
    perfil,
    setPerfil,
    loading,
    salvando,
    editando,
    setEditando,
    salvar,
    logout,
  };
}
