import { useState } from 'react';
import { Alert } from 'react-native';
import { login as loginModel } from '../model/authModel';
import { traduzirErro } from '../../../shared/lib/erros';

export default function useLoginController(onSuccess) {
  const [email, setEmail]       = useState('');
  const [senha, setSenha]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [senhaVis, setSenhaVis] = useState(false);

  // Realizar login
  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      await loginModel(email, senha);
      onSuccess?.();
    } catch (err) {
      Alert.alert('Erro ao entrar', traduzirErro(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    senha,
    setSenha,
    loading,
    senhaVis,
    setSenhaVis,
    handleLogin
  };
}
