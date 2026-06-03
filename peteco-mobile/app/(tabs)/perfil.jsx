import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, font, shadow } from '../../constants/theme';
import usePerfilController from '../../modules/perfil/controller/usePerfilController';

export default function Perfil() {
  const router = useRouter();
  const {
    usuario, perfil, setPerfil,
    loading, salvando, editando, setEditando,
    salvar, logout,
  } = usePerfilController(
    () => router.replace('/(auth)/login'),
    () => router.replace('/(auth)/splash'),
  );

  if (loading) {
    return (
      <View style={s.centro}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const inicial = perfil.nome?.charAt(0)?.toUpperCase() || '?';

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
      <View style={s.avatarArea}>
        <View style={s.avatar}>
          <Text style={s.avatarLetra}>{inicial}</Text>
        </View>
        <Text style={s.nome}>{perfil.nome || 'Sem nome'}</Text>
        <Text style={s.email}>{usuario?.email}</Text>
      </View>

      <View style={s.card}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitulo}>Dados pessoais</Text>
          <TouchableOpacity style={s.editarBtn} onPress={() => setEditando(e => !e)}>
            {!editando && <Ionicons name="create-outline" size={14} color={colors.primary} />}
            <Text style={s.editarTexto}>{editando ? 'Cancelar' : 'Editar'}</Text>
          </TouchableOpacity>
        </View>

        <View style={s.campo}>
          <Text style={s.label}>Nome</Text>
          <TextInput
            style={[s.input, !editando && s.inputReadOnly]}
            value={perfil.nome}
            onChangeText={v => setPerfil(p => ({ ...p, nome: v }))}
            placeholder="Seu nome"
            placeholderTextColor={colors.textLight}
            editable={editando}
          />
        </View>

        <View style={s.campo}>
          <Text style={s.label}>Telefone / WhatsApp</Text>
          <TextInput
            style={[s.input, !editando && s.inputReadOnly]}
            value={perfil.telefone}
            onChangeText={v => setPerfil(p => ({ ...p, telefone: v }))}
            placeholder="(95) 98765-4321"
            placeholderTextColor={colors.textLight}
            keyboardType="phone-pad"
            editable={editando}
          />
        </View>

        <View style={s.campo}>
          <Text style={s.label}>E-mail</Text>
          <TextInput
            style={[s.input, s.inputReadOnly]}
            value={usuario?.email}
            editable={false}
          />
        </View>

        {editando && (
          <TouchableOpacity style={s.btnSalvar} onPress={salvar} disabled={salvando} activeOpacity={0.85}>
            {salvando
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnTexto}>Salvar alterações</Text>
            }
          </TouchableOpacity>
        )}
      </View>

      <View style={s.opcoes}>
        {[
          { icon: 'paw-outline',    label: 'Meus pets cadastrados', acao: () => router.push('/(tabs)/meus-pets') },
          { icon: 'search-outline', label: 'Busca avançada',        acao: () => router.push('/busca') },
        ].map(({ icon, label, acao }) => (
          <TouchableOpacity key={label} style={s.opcaoItem} onPress={acao} activeOpacity={0.8}>
            <Ionicons name={icon} size={18} color={colors.primary} />
            <Text style={s.opcaoTexto}>{label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.btnLogout} onPress={logout} activeOpacity={0.85}>
        <Text style={s.btnLogoutTexto}>Sair da conta</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
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
    padding: 20,
    paddingTop: 56,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  avatarArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarLetra: {
    fontSize: 36,
    color: '#fff',
    ...font.black,
  },
  nome: {
    fontSize: 22,
    ...font.black,
    color: colors.textDark,
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: colors.textMid,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    ...shadow.card,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitulo: {
    fontSize: 15,
    ...font.black,
    color: colors.textDark,
  },
  editarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editarTexto: {
    fontSize: 13,
    color: colors.primary,
    ...font.bold,
  },
  campo: {
    gap: 5,
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    color: colors.textMid,
    ...font.bold,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 46,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.textDark,
  },
  inputReadOnly: {
    backgroundColor: colors.background,
    color: colors.textMid,
  },
  btnSalvar: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnTexto: {
    color: '#fff',
    fontSize: 15,
    ...font.bold,
  },
  opcoes: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    ...shadow.card,
    marginBottom: 16,
  },
  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  opcaoTexto: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
    ...font.medium,
  },
  btnLogout: {
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: radius.full,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLogoutTexto: {
    color: colors.danger,
    fontSize: 15,
    ...font.bold,
  },
});
