import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, shadow, font } from '../../../constants/theme';

function isoParaPtBR(iso) {
  if (!iso) return null;
  const [a, m, d] = iso.split('T')[0].split('-');
  return `${d}/${m}/${a}`;
}

function primeiraFoto(fotoUrl) {
  if (!fotoUrl) return null;
  try {
    const parsed = JSON.parse(fotoUrl);
    return Array.isArray(parsed) ? parsed[0] ?? null : fotoUrl;
  } catch {
    return fotoUrl;
  }
}

function EspecieIcon({ especie, size = 32, color }) {
  const cor = color ?? colors.primary;
  if (especie === 'cachorro') return <MaterialCommunityIcons name="dog" size={size} color={cor} />;
  if (especie === 'gato')     return <MaterialCommunityIcons name="cat" size={size} color={cor} />;
  return <Ionicons name="paw-outline" size={size} color={cor} />;
}

export default function CardPet({ pet, notificacoes = 0 }) {
  const router  = useRouter();
  const perdido = pet.status === 'perdido';

  return (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/pet/${pet.id}`)}
    >
      <View style={s.fotoContainer}>
        <View style={s.fotoWrapper}>
          {primeiraFoto(pet.foto_url) ? (
            <Image source={{ uri: primeiraFoto(pet.foto_url) }} style={s.foto} />
          ) : (
            <View style={[s.foto, s.fotoVazia]}>
              <EspecieIcon especie={pet.especie?.toLowerCase()} size={32} />
            </View>
          )}
        </View>
        {notificacoes > 0 && (
          <View style={s.notifBadge}>
            <Text style={s.notifBadgeTexto}>!</Text>
          </View>
        )}
      </View>

      <View style={s.info}>
        <View style={s.topoLinha}>
          <Text style={s.nome} numberOfLines={1}>{pet.nome}</Text>
          <View style={[s.badge, perdido ? s.badgePerdido : s.badgeEncontrado]}>
            <Ionicons name="ellipse" size={6} color={perdido ? colors.danger : colors.success} />
            <Text style={[s.badgeTexto, perdido ? s.badgeTextoPerdido : s.badgeTextoEncontrado]}>
              {perdido ? 'Perdido' : 'Encontrado'}
            </Text>
          </View>
        </View>

        <Text style={s.especie}>{pet.especie}{pet.raca ? ` · ${pet.raca}` : ''}</Text>

        <View style={s.rodape}>
          <Ionicons name="location-outline" size={11} color={colors.textLight} />
          <Text style={s.local} numberOfLines={1}>{pet.bairro || pet.cidade || 'Local não informado'}</Text>
          {pet.data_perda && (
            <Text style={s.data}>{isoParaPtBR(pet.data_perda)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: 12,
    ...shadow.card,
  },
  fotoContainer: {
    width: 90,
    height: 90,
  },
  fotoWrapper: {
    width: 90,
    height: 90,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    overflow: 'hidden',
  },
  foto: {
    width: 90,
    height: 90,
  },
  fotoVazia: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F97316',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  notifBadgeTexto: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 16,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  topoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  nome: {
    ...font.bold,
    fontSize: 15,
    color: colors.textDark,
    flex: 1,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgePerdido:     { backgroundColor: colors.dangerLight },
  badgeEncontrado:  { backgroundColor: colors.successLight },
  badgeTexto:       { fontSize: 10, ...font.bold },
  badgeTextoPerdido:   { color: colors.danger },
  badgeTextoEncontrado:{ color: colors.success },
  especie: {
    fontSize: 12,
    color: colors.textMid,
    ...font.medium,
    marginTop: 2,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  local: {
    fontSize: 11,
    color: colors.textLight,
    flex: 1,
  },
  data: {
    fontSize: 10,
    color: colors.textLight,
    ...font.medium,
  },
});
