import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, font, shadow } from '../../constants/theme';
import useDetalhePetController from '../../modules/pet/controller/useDetalhePetController';

function isoParaPtBR(iso) {
  if (!iso) return '—';
  const [a, m, d] = iso.split('T')[0].split('-');
  return `${d}/${m}/${a}`;
}

export default function DetalhePet() {
  const { id }   = useLocalSearchParams();
  const router   = useRouter();
  const {
    pet, loading, usuario, salvando,
    similares, loadingSimilares,
    marcarEncontrado,
  } = useDetalhePetController(id, () => router.back());

  if (loading) {
    return (
      <View style={s.centro}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const ehDono  = usuario?.id === pet?.usuario_id;
  const perdido = pet?.status === 'perdido';

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Foto grande */}
        <View style={s.fotoContainer}>
          {pet.foto_url ? (
            <Image source={{ uri: pet.foto_url }} style={s.foto} />
          ) : (
            <View style={[s.foto, s.fotoVazia]}>
              {pet.especie === 'cachorro'
                ? <MaterialCommunityIcons name="dog" size={80} color={colors.primary} />
                : pet.especie === 'gato'
                ? <MaterialCommunityIcons name="cat" size={80} color={colors.primary} />
                : <Ionicons name="paw-outline" size={80} color={colors.primary} />
              }
            </View>
          )}
          <TouchableOpacity style={s.btnVoltar} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.textDark} />
          </TouchableOpacity>
          <View style={[s.statusBadge, perdido ? s.badgePerdido : s.badgeEncontrado]}>
            <Ionicons name="ellipse" size={8} color={perdido ? colors.danger : colors.success} />
            <Text style={s.statusTexto}>{perdido ? 'Perdido' : 'Encontrado'}</Text>
          </View>
        </View>

        <View style={s.conteudo}>
          {/* Nome e espécie */}
          <View style={s.cabecalho}>
            <Text style={s.nome}>{pet.nome}</Text>
            <View style={s.especieTag}>
              {pet.especie === 'cachorro'
                ? <MaterialCommunityIcons name="dog" size={14} color={colors.primary} />
                : pet.especie === 'gato'
                ? <MaterialCommunityIcons name="cat" size={14} color={colors.primary} />
                : <Ionicons name="paw-outline" size={14} color={colors.primary} />
              }
              <Text style={s.especieTexto}>{pet.especie}</Text>
            </View>
          </View>

          {/* Informações em grid */}
          <View style={s.infoGrid}>
            {[
              { icon: 'pricetag-outline',      label: 'Raça',   valor: pet.raca   || '—' },
              { icon: 'color-palette-outline',  label: 'Cor',    valor: pet.cor    || '—' },
              { icon: 'location-outline',       label: 'Bairro', valor: pet.bairro || '—' },
              { icon: 'business-outline',       label: 'Cidade', valor: pet.cidade || '—' },
              { icon: 'calendar-outline', label: 'Perdido em', valor: isoParaPtBR(pet.data_perda) },
            ].map(({ icon, label, valor }) => (
              <View key={label} style={s.infoCard}>
                <Ionicons name={icon} size={18} color={colors.primary} style={{ marginBottom: 4 }} />
                <Text style={s.infoLabel}>{label}</Text>
                <Text style={s.infoValor} numberOfLines={1}>{valor}</Text>
              </View>
            ))}
          </View>

          {/* Descrição */}
          {pet.descricao ? (
            <View style={s.descricaoCard}>
              <Text style={s.descricaoTitulo}>Descrição</Text>
              <Text style={s.descricaoTexto}>{pet.descricao}</Text>
            </View>
          ) : null}

          {/* Localização */}
          {(pet.lat && pet.lng) ? (
            <View style={s.locCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="location-outline" size={14} color={colors.primary} />
                <Text style={s.locTexto}>{pet.lat?.toFixed(4)}, {pet.lng?.toFixed(4)}</Text>
              </View>
            </View>
          ) : null}

          {/* Pets similares */}
          {(loadingSimilares || similares.length > 0) && (
            <View style={s.similaresSecao}>
              <Text style={s.similaresTitulo}>Pets similares na região</Text>
              {loadingSimilares ? (
                <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                  {similares.map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={s.similarCard}
                      onPress={() => router.push(`/pet/${item.id}`)}
                      activeOpacity={0.8}
                    >
                      {item.foto_url ? (
                        <Image source={{ uri: item.foto_url }} style={s.similarFoto} />
                      ) : (
                        <View style={[s.similarFoto, s.similarFotoVazia]}>
                          <Ionicons name="paw-outline" size={28} color={colors.primary} />
                        </View>
                      )}
                      <Text style={s.similarNome} numberOfLines={1}>{item.nome}</Text>
                      <Text style={s.similarBairro} numberOfLines={1}>{item.bairro || item.cidade || '—'}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botão de ação */}
      {ehDono && perdido && (
        <View style={s.rodape}>
          <TouchableOpacity
            style={s.btnEncontrado}
            onPress={marcarEncontrado}
            disabled={salvando}
            activeOpacity={0.85}
          >
            {salvando
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={s.btnEncontradoTexto}>Encontrei meu pet!</Text>
                </>
            }
          </TouchableOpacity>
        </View>
      )}
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
  fotoContainer: {
    position: 'relative',
  },
  foto: {
    width: '100%',
    height: 300,
  },
  fotoVazia: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnVoltar: {
    position: 'absolute',
    top: 48,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  statusBadge: {
    position: 'absolute',
    top: 48,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  badgePerdido: {
    backgroundColor: colors.dangerLight,
  },
  badgeEncontrado: {
    backgroundColor: colors.successLight,
  },
  statusTexto: {
    fontSize: 12,
    ...font.bold,
  },
  conteudo: {
    padding: 20,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nome: {
    fontSize: 28,
    ...font.black,
    color: colors.textDark,
    flex: 1,
  },
  especieTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  especieTexto: {
    fontSize: 13,
    color: colors.primary,
    ...font.bold,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    width: '47%',
    ...shadow.card,
  },
  infoLabel: {
    fontSize: 10,
    color: colors.textLight,
    ...font.medium,
    letterSpacing: 0.5,
  },
  infoValor: {
    fontSize: 14,
    color: colors.textDark,
    ...font.bold,
    marginTop: 2,
  },
  descricaoCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    ...shadow.card,
  },
  descricaoTitulo: {
    fontSize: 13,
    color: colors.textMid,
    ...font.bold,
    marginBottom: 6,
  },
  descricaoTexto: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 21,
  },
  locCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 12,
  },
  locTexto: {
    fontSize: 13,
    color: colors.primary,
    ...font.medium,
  },
  similaresSecao: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    ...shadow.card,
  },
  similaresTitulo: {
    fontSize: 13,
    color: colors.textMid,
    ...font.bold,
  },
  similarCard: {
    width: 100,
    marginRight: 12,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  similarFoto: {
    width: 100,
    height: 80,
  },
  similarFotoVazia: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  similarNome: {
    fontSize: 12,
    ...font.bold,
    color: colors.textDark,
    padding: 6,
    paddingBottom: 2,
  },
  similarBairro: {
    fontSize: 10,
    color: colors.textLight,
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
  rodape: {
    padding: 20,
    paddingBottom: 32,
  },
  btnEncontrado: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.success,
    borderRadius: radius.full,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  btnEncontradoTexto: {
    color: '#fff',
    fontSize: 16,
    ...font.bold,
  },
});
