import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, font } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export default function Splash() {
  const router = useRouter();

  return (
    <View style={s.container}>
      {/* Círculos decorativos — inspirados no design de referência */}
      <View style={[s.circulo, s.circuloPink]} />
      <View style={[s.circulo, s.circuloYellow]} />
      <View style={[s.circulo, s.circuloBlue]} />

      {/* Pets decorativos em emoji grande */}
      <View style={s.petsRow}>
        <View style={s.petBubble}>
          <MaterialCommunityIcons name="dog" size={48} color={colors.primary} />
        </View>
        <View style={[s.petBubble, s.petBubbleLarge]}>
          <MaterialCommunityIcons name="cat" size={64} color={colors.primaryDark} />
        </View>
      </View>

      {/* Texto principal */}
      <View style={s.textArea}>
        <Ionicons name="paw-outline" size={28} color={colors.primary} style={{ marginBottom: 4 }} />
        <Text style={s.appName}>PETECO</Text>
        <Text style={s.headline}>Encontre seu{'\n'}pet perdido</Text>
        <Text style={s.sub}>
          Cadastre, localize e acompanhe pets perdidos na sua cidade com geolocalização em tempo real.
        </Text>
      </View>

      {/* Botões */}
      <View style={s.botoes}>
        <TouchableOpacity
          style={s.btnPrimario}
          activeOpacity={0.85}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={s.btnPrimarioTexto}>Já tenho uma conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btnSecundario}
          activeOpacity={0.85}
          onPress={() => router.push('/(auth)/cadastro')}
        >
          <Text style={s.btnSecundarioTexto}>Começar agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 48,
  },

  // Círculos decorativos
  circulo: {
    position: 'absolute',
    borderRadius: radius.full,
    opacity: 0.35,
  },
  circuloPink: {
    width: 180,
    height: 180,
    backgroundColor: '#FFB5C8',
    top: -40,
    right: -50,
  },
  circuloYellow: {
    width: 120,
    height: 120,
    backgroundColor: '#FFE680',
    top: 60,
    left: -30,
  },
  circuloBlue: {
    width: 90,
    height: 90,
    backgroundColor: '#B5D4FF',
    top: 140,
    right: 30,
  },

  // Pets
  petsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  petBubble: {
    width: 90,
    height: 90,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  petBubbleLarge: {
    width: 120,
    height: 120,
  },
  // Textos
  textArea: {
    marginTop: 32,
    alignItems: 'center',
  },
  appName: {
    fontSize: 13,
    letterSpacing: 4,
    color: colors.primary,
    ...font.bold,
    marginBottom: 8,
  },
  headline: {
    fontSize: 36,
    ...font.black,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 14,
  },
  sub: {
    fontSize: 14,
    color: colors.textMid,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 280,
  },

  // Botões
  botoes: {
    marginTop: 'auto',
    gap: 12,
  },
  btnPrimario: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  btnPrimarioTexto: {
    color: '#fff',
    fontSize: 16,
    ...font.bold,
  },
  btnSecundario: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  btnSecundarioTexto: {
    color: colors.textMid,
    fontSize: 15,
    ...font.medium,
  },
});
