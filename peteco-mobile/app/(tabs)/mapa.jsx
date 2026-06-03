import {
  View, Text, StyleSheet, ActivityIndicator,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, font, radius, shadow } from '../../constants/theme';
import useMapaController from '../../modules/pet/controller/useMapaController';

export default function Mapa() {
  const router = useRouter();
  const { pets, loading } = useMapaController();

  if (loading) {
    return (
      <View style={s.centro}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.titulo}>Mapa de ocorrências</Text>
        <Text style={s.sub}>{pets.length} pet{pets.length !== 1 ? 's' : ''} localizado{pets.length !== 1 ? 's' : ''}</Text>
      </View>

      <View style={s.banner}>
        <Ionicons name="map-outline" size={28} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={s.bannerTitulo}>Visualização geográfica</Text>
          <Text style={s.bannerSub}>O mapa interativo está disponível no dashboard web em tempo real.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.lista} showsVerticalScrollIndicator={false}>
        {pets.length === 0 ? (
          <View style={s.vazio}>
            <Ionicons name="map-outline" size={48} color={colors.textLight} />
            <Text style={s.vazioTexto}>Nenhum pet com localização</Text>
          </View>
        ) : (
          pets.map(pet => (
            <TouchableOpacity
              key={pet.id}
              style={s.card}
              onPress={() => router.push(`/pet/${pet.id}`)}
              activeOpacity={0.85}
            >
              <View style={s.pin}>
                {pet.especie === 'cachorro'
                  ? <MaterialCommunityIcons name="dog" size={22} color={colors.primary} />
                  : pet.especie === 'gato'
                  ? <MaterialCommunityIcons name="cat" size={22} color={colors.primary} />
                  : <Ionicons name="paw-outline" size={22} color={colors.primary} />
                }
              </View>
              <View style={s.cardInfo}>
                <Text style={s.cardNome}>{pet.nome}</Text>
                <View style={s.cardLocalRow}>
                  <Ionicons name="location-outline" size={12} color={colors.textMid} />
                  <Text style={s.cardLocal}>{pet.bairro || 'Bairro não informado'}, {pet.cidade || ''}</Text>
                </View>
                {(pet.lat && pet.lng) && (
                  <Text style={s.cardCoords}>
                    {pet.lat?.toFixed(4)}, {pet.lng?.toFixed(4)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 56,
  },
  titulo: {
    fontSize: 24,
    ...font.black,
    color: colors.textDark,
  },
  sub: {
    fontSize: 13,
    color: colors.textMid,
    marginTop: 2,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 20,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 16,
  },
  bannerTitulo: {
    fontSize: 13,
    ...font.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  bannerSub: {
    fontSize: 11,
    color: colors.textMid,
    lineHeight: 15,
  },
  lista: {
    padding: 20,
    paddingTop: 0,
    gap: 10,
  },
  vazio: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 12,
  },
  vazioTexto: {
    fontSize: 16,
    ...font.bold,
    color: colors.textMid,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 14,
    ...shadow.card,
  },
  pin: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: 15,
    ...font.bold,
    color: colors.textDark,
  },
  cardLocalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  cardLocal: {
    fontSize: 12,
    color: colors.textMid,
  },
  cardCoords: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
    fontFamily: 'monospace',
  },
});
