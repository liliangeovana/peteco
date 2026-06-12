import { useState } from 'react';
import { Alert } from 'react-native';
import { cadastrar as cadastrarModel } from '../model/authModel';
import { traduzirErro } from '../../../shared/lib/erros';

export default function useCadastroController(onSuccess, onIrParaLogin) {
  const [nome, setNome]         = useState('');
  const [email, setEmail]       = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha]       = useState('');
  const [bairro, setBairro]     = useState('');
  const [loading, setLoading]   = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Preencha nome, e-mail e senha');
      return;
    }
    if (!bairro) {
      Alert.alert('Bairro obrigatório', 'Selecione o bairro onde você mora.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const data = await cadastrarModel(email, senha, nome, telefone, bairro);
      if (data.session) {
        onSuccess?.();
      } else {
        Alert.alert(
          'Conta criada!',
          [{ text: 'OK', onPress: onIrParaLogin }]
        );
      }
    } catch (err) {
      Alert.alert('Erro ao cadastrar', traduzirErro(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    nome, setNome,
    email, setEmail,
    telefone, setTelefone,
    senha, setSenha,
    bairro, setBairro,
    loading,
    handleCadastro,
  };
}
