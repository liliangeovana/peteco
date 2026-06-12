import { useState, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, font, radius, shadow } from '../../constants/theme';
import useMapaController from '../../modules/pet/controller/useMapaController';
import { useParseFoto } from '../../shared/hooks/useParseFoto';
import EspecieIcon from '../../shared/components/EspecieIcon';
import LoadingCentro from '../../shared/components/LoadingCentro';
import EmptyState from '../../shared/components/EmptyState';

export default function PorBairro() {
  const router = useRouter();
  const { pets, loading, bairroUsuario } = useMapaController();
  const { primeiraFoto } = useParseFoto();
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    if (bairroUsuario) setExpandido(bairroUsuario);
  }, [bairroUsuario]);

  const bairros = useMemo(() => {
    const mapa = {};
    for (const pet of pets) {
      const b = pet.bairro || 'Não informado';
      if (!mapa[b]) mapa[b] = [];
      mapa[b].push(pet);
    }
    return Object.entries(mapa)
      .sort((a, b) => {
        if (a[0] === bairroUsuario) return -1;
        if (b[0] === bairroUsuario) return 1;
        return b[1].length - a[1].length;
      });
  }, [pets, bairroUsuario]);

  if (loading) return <LoadingCentro />;

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
          <EmptyState icon="location-outline" title="Nenhum pet cadastrado" />
        ) : (
          bairros.map(([bairro, lista]) => {
            const aberto = expandido === bairro;
            const isMeuBairro = bairro === bairroUsuario;
            return (
              <View key={bairro} style={[s.grupo, isMeuBairro && s.grupoDestaque]}>
                <TouchableOpacity
                  style={s.grupoCabecalho}
                  onPress={() => setExpandido(aberto ? null : bairro)}
                  activeOpacity={0.8}
                >
                  <View style={s.grupoEsquerda}>
                    <View style={[s.pinIcon, isMeuBairro && s.pinIconDestaque]}>
                      <Ionicons name="location" size={18} color={isMeuBairro ? '#fff' : colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.grupoNome}>{bairro}</Text>
                      {isMeuBairro && (
                        <Text style={s.meuBairroLabel}>Seu bairro</Text>
                      )}
                    </View>
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
                        {primeiraFoto(pet.foto_url) ? (
                          <Image source={{ uri: primeiraFoto(pet.foto_url) }} style={s.petFoto} />
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
  grupo: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  grupoDestaque: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pinIconDestaque: {
    backgroundColor: colors.primary,
  },
  meuBairroLabel: {
    fontSize: 10,
    color: colors.primary,
    ...font.bold,
    marginTop: 1,
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
