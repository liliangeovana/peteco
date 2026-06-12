import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CardPet from '../../modules/pet/components/CardPet';
import { colors, radius, font, shadow } from '../../constants/theme';
import useMeusPetsController from '../../modules/pet/controller/useMeusPetsController';
import LoadingCentro from '../../shared/components/LoadingCentro';
import EmptyState from '../../shared/components/EmptyState';

export default function MeusPets() {
  const router = useRouter();
  const {
    petsFiltrados, loading, refreshing,
    filtro, setFiltro, stats, onRefresh,
  } = useMeusPetsController(() => router.replace('/(auth)/login'));

  if (loading) return <LoadingCentro />;

  return (
    <View style={s.container}>
      <FlatList
        data={petsFiltrados}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <CardPet pet={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={s.lista}
        ListHeaderComponent={() => (
          <View>
            <Text style={s.titulo}>Meus pets</Text>

            <View style={s.statsRow}>
              {[
                { label: 'Total',       valor: stats.total,       cor: colors.primary },
                { label: 'Perdidos',    valor: stats.perdidos,    cor: colors.danger },
                { label: 'Encontrados', valor: stats.encontrados, cor: colors.success },
              ].map(({ label, valor, cor }) => (
                <View key={label} style={[s.statCard, { borderTopColor: cor }]}>
                  <Text style={[s.statNum, { color: cor }]}>{valor}</Text>
                  <Text style={s.statLabel}>{label}</Text>
                </View>
              ))}
            </View>

            <View style={s.filtroRow}>
              {[
                { key: 'todos',      label: 'Todos',       icon: null,      cor: null },
                { key: 'perdido',    label: 'Perdidos',    icon: 'ellipse', cor: colors.danger },
                { key: 'encontrado', label: 'Encontrados', icon: 'ellipse', cor: colors.success },
              ].map(({ key, label, icon, cor }) => (
                <TouchableOpacity
                  key={key}
                  style={[s.filtroChip, filtro === key && s.filtroChipAtivo]}
                  onPress={() => setFiltro(key)}
                >
                  {icon && <Ionicons name={icon} size={8} color={filtro === key ? '#fff' : cor} />}
                  <Text style={[s.filtroLabel, filtro === key && s.filtroLabelAtivo]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.secaoTitulo}>
              {petsFiltrados.length} pet{petsFiltrados.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="paw-outline"
            title="Nenhum pet cadastrado"
            action={() => router.push('/(tabs)/cadastrar')}
            actionLabel="Cadastrar pet perdido"
          />
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lista: {
    padding: 20,
    paddingTop: 56,
  },
  titulo: {
    fontSize: 26,
    ...font.black,
    color: colors.textDark,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 14,
    borderTopWidth: 3,
    ...shadow.card,
  },
  statNum: {
    fontSize: 22,
    ...font.black,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMid,
    ...font.medium,
    marginTop: 2,
  },
  filtroRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filtroChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingVertical: 8,
  },
  filtroChipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filtroLabel: {
    fontSize: 11,
    color: colors.textMid,
    ...font.bold,
  },
  filtroLabelAtivo: {
    color: '#fff',
  },
  secaoTitulo: {
    fontSize: 14,
    color: colors.textMid,
    marginBottom: 12,
  },
});
