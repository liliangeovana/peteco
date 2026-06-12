import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { colors, radius, font } from '../../constants/theme';
import useCadastroController from '../../modules/auth/controller/useCadastroController';
import { BAIRROS_BOA_VISTA } from '../../constants/bairros';
import { useMascaraTelefone } from '../../shared/hooks/useMascaraTelefone';
import SelectModal from '../../shared/components/SelectModal';

export default function Cadastro() {
  const router = useRouter();
  const { mascaraTelefone } = useMascaraTelefone();
  const {
    nome, setNome, email, setEmail,
    telefone, setTelefone, senha, setSenha,
    bairro, setBairro,
    loading, handleCadastro,
  } = useCadastroController(
    () => router.replace('/(tabs)/feed'),
    () => router.push('/(auth)/login'),
  );

  const [modalBairro, setModalBairro] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/splash')}
        style={s.voltar}
      >
        <Text style={s.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={s.pata}>🐾</Text>
      <Text style={s.titulo}>Criar conta</Text>
      <Text style={s.sub}>Junte-se à comunidade PETECO</Text>

      <View style={s.form}>
        {[
          { label: 'Nome completo',       value: nome,     set: setNome,     placeholder: 'Seu nome',          keyboard: 'default' },
          { label: 'E-mail',              value: email,    set: setEmail,    placeholder: 'seu@email.com',      keyboard: 'email-address', auto: 'none' },
          { label: 'Telefone / WhatsApp', value: telefone, set: v => setTelefone(mascaraTelefone(v)), placeholder: '95 99999-9999', keyboard: 'phone-pad' },
        ].map(({ label, value, set, placeholder, keyboard, auto }) => (
          <View key={label} style={s.campo}>
            <Text style={s.label}>{label}</Text>
            <TextInput
              style={s.input}
              value={value}
              onChangeText={set}
              placeholder={placeholder}
              placeholderTextColor={colors.textLight}
              keyboardType={keyboard}
              autoCapitalize={auto}
            />
          </View>
        ))}

        {/* Bairro */}
        <View style={s.campo}>
          <Text style={s.label}>Bairro *</Text>
          <TouchableOpacity
            style={[s.input, s.pickerBtn, !bairro && { borderColor: colors.border }]}
            onPress={() => setModalBairro(true)}
            activeOpacity={0.75}
          >
            <Text style={bairro ? s.pickerTexto : s.pickerPlaceholder}>
              {bairro || 'Selecione seu bairro'}
            </Text>
            <Text style={s.pickerSeta}>▾</Text>
          </TouchableOpacity>
        </View>

        <View style={s.campo}>
          <Text style={s.label}>Senha</Text>
          <TextInput
            style={s.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.textLight}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={s.btnPrimario}
          onPress={handleCadastro}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnTexto}>Criar conta</Text>
          }
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={s.linkArea}>
        <Text style={s.linkTexto}>
          Já tem conta?{' '}
          <Text style={{ color: colors.primary, ...font.bold }}>Entrar</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>

    <SelectModal
      visible={modalBairro}
      title="Selecione seu bairro"
      data={BAIRROS_BOA_VISTA.map(b => b.nome)}
      value={bairro}
      onSelect={item => { setBairro(item); setModalBairro(false); }}
      onClose={() => setModalBairro(false)}
    />

    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: 28, paddingTop: 60, paddingBottom: 40 },
  voltar: { marginBottom: 32 },
  voltarTexto: { color: colors.textMid, fontSize: 14, ...font.medium },
  pata: { fontSize: 36, marginBottom: 8 },
  titulo: { fontSize: 28, ...font.black, color: colors.textDark, marginBottom: 6 },
  sub: { fontSize: 14, color: colors.textMid, marginBottom: 36 },
  form: { gap: 16 },
  campo: { gap: 6 },
  label: { fontSize: 12, color: colors.textMid, ...font.bold, letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.textDark,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerTexto: { fontSize: 15, color: colors.textDark, flex: 1 },
  pickerPlaceholder: { fontSize: 15, color: colors.textLight, flex: 1 },
  pickerSeta: { fontSize: 14, color: colors.textMid },
  btnPrimario: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  btnTexto: { color: '#fff', fontSize: 16, ...font.bold },
  linkArea: { marginTop: 28, alignItems: 'center' },
  linkTexto: { fontSize: 14, color: colors.textMid },

});
