import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, font } from '../../constants/theme';
import useLoginController from '../../modules/auth/controller/useLoginController';

export default function Login() {
  const router = useRouter();
  const {
    email, setEmail, senha, setSenha,
    loading, senhaVis, setSenhaVis, handleLogin,
  } = useLoginController(() => router.replace('/(tabs)/feed'));

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

      <Ionicons name="paw-outline" size={36} color={colors.primary} style={{ marginBottom: 8 }} />
      <Text style={s.titulo}>Bem-vindo de volta</Text>
      <Text style={s.sub}>Entre para continuar ajudando pets perdidos</Text>

      <View style={s.form}>
        <View style={s.campo}>
          <Text style={s.label}>E-mail</Text>
          <TextInput
            style={s.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={colors.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={s.campo}>
          <Text style={s.label}>Senha</Text>
          <View style={s.inputRow}>
            <TextInput
              style={[s.input, {
                flex: 1,
                borderRightWidth: 0,
                borderRadius: 0,
                borderTopLeftRadius: radius.md,
                borderBottomLeftRadius: radius.md,
              }]}
              value={senha}
              onChangeText={setSenha}
              placeholder="••••••••"
              placeholderTextColor={colors.textLight}
              secureTextEntry={!senhaVis}
            />
            <TouchableOpacity style={s.olho} onPress={() => setSenhaVis(v => !v)}>
              <Ionicons
                name={senhaVis ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={s.btnPrimario}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnTexto}>Entrar</Text>
          }
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')} style={s.linkArea}>
        <Text style={s.linkTexto}>
          Não tem conta?{' '}
          <Text style={{ color: colors.primary, ...font.bold }}>Criar conta</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  voltar: {
    marginBottom: 32,
  },
  voltarTexto: {
    color: colors.textMid,
    fontSize: 14,
    ...font.medium,
  },
  titulo: {
    fontSize: 28,
    ...font.black,
    color: colors.textDark,
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    color: colors.textMid,
    marginBottom: 36,
  },
  form: {
    gap: 16,
  },
  campo: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: colors.textMid,
    ...font.bold,
    letterSpacing: 0.5,
  },
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
  inputRow: {
    flexDirection: 'row',
  },
  olho: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderLeftWidth: 0,
    borderTopRightRadius: radius.md,
    borderBottomRightRadius: radius.md,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  btnTexto: {
    color: '#fff',
    fontSize: 16,
    ...font.bold,
  },
  linkArea: {
    marginTop: 28,
    alignItems: 'center',
  },
  linkTexto: {
    fontSize: 14,
    color: colors.textMid,
  },
});
