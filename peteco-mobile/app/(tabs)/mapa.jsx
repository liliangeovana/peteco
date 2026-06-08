import { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, font, radius, shadow } from '../../constants/theme';
import useMapaController from '../../modules/pet/controller/useMapaController';

function EspecieIcon({ especie, size = 18, color }) {
  const cor = color ?? colors.primary;
  if (especie === 'cachorro') return <MaterialCommunityIcons name="dog" size={size} color={cor} />;
  if (especie === 'gato')     return <MaterialCommunityIcons name="cat" size={size} color={cor} />;
  return <Ionicons name="paw-outline" size={size} color={cor} />;
}

export default function PorBairro() {
  const router = useRouter();
  const { pets, loading } = useMapaController();
  const [expandido, setExpandido] = useState(null);

  const bairros = useMemo(() => {
    const mapa = {};
    for (const pet of pets) {
      const b = pet.bairro || 'Não informado';
      if (!mapa[b]) mapa[b] = [];
      mapa[b].push(pet);
    }
    return Object.entries(mapa)
      .sort((a, b) => b[1].length - a[1].length);
  }, [pets]);

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
        <Text style={s.titulo}>Pets por bairro</Text>
        <Text style={s.sub}>
          {pets.length} pet{pets.length !== 1 ? 's' : ''} em {bairros.length} bairro{bairros.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView contentContainerStyle={s.lista} showsVerticalScrollIndicator={false}>
        {bairros.length === 0 ? (
          <View style={s.vazio}>
            <Ionicons name="location-outline" size={48} color={colors.textLight} />
            <Text style={s.vazioTexto}>Nenhum pet cadastrado</Text>
          </View>
        ) : (
          bairros.map(([bairro, lista]) => {
            const aberto = expandido === bairro;
            return (
              <View key={bairro} style={s.grupo}>
                <TouchableOpacity
                  style={s.grupoCabecalho}
                  onPress={() => setExpandido(aberto ? null : bairro)}
                  activeOpacity={0.8}
                >
                  <View style={s.grupoEsquerda}>
                    <View style={s.pinIcon}>
                      <Ionicons name="location" size={18} color={colors.primary} />
                    </View>
                    <Text style={s.grupoNome}>{bairro}</Text>
                  </View>
                  <View style={s.grupoDireita}>
                    <View style={s.badge}>
                      <Text style={s.badgeTexto}>{lista.length}</Text>
                    </View>
                    <Ionicons
                      name={aberto ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.textMid}
                    />
                  </View>
                </TouchableOpacity>

                {aberto && (
                  <View style={s.grupoLista}>
                    {lista.map(pet => (
                      <TouchableOpacity
                        key={pet.id}
                        style={s.petItem}
                        onPress={() => router.push(`/pet/${pet.id}`)}
                        activeOpacity={0.8}
                      >
                        {pet.foto_url ? (
                          <Image source={{ uri: pet.foto_url }} style={s.petFoto} />
                        ) : (
                          <View style={[s.petFoto, s.petFotoVazia]}>
                            <EspecieIcon especie={pet.especie} size={20} />
                          </View>
                        )}
                        <View style={s.petInfo}>
                          <Text style={s.petNome}>{pet.nome}</Text>
                          <View style={s.petDetalhe}>
                            <EspecieIcon especie={pet.especie} size={12} color={colors.textLight} />
                            <Text style={s.petSub}>
                              {pet.especie}{pet.raca ? ` · ${pet.raca}` : ''}
                            </Text>
                          </View>
                        </View>
                        <View style={[s.statusDot, pet.status === 'perdido' ? s.dotPerdido : s.dotEncontrado]} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
        <View style={{ height: 24 }} />
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
    paddingBottom: 12,
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
  lista: {
    paddingHorizontal: 20,
    gap: 10,
  },
  vazio: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  vazioTexto: {
    fontSize: 16,
    ...font.bold,
    color: colors.textMid,
  },
  grupo: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  grupoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  grupoEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pinIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grupoNome: {
    fontSize: 15,
    ...font.bold,
    color: colors.textDark,
    flex: 1,
  },
  grupoDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeTexto: {
    color: '#fff',
    fontSize: 12,
    ...font.bold,
  },
  grupoLista: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  petFoto: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
  },
  petFotoVazia: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petInfo: {
    flex: 1,
  },
  petNome: {
    fontSize: 14,
    ...font.bold,
    color: colors.textDark,
  },
  petDetalhe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  petSub: {
    fontSize: 12,
    color: colors.textLight,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotPerdido:    { backgroundColor: colors.danger },
  dotEncontrado: { backgroundColor: colors.success },
});
