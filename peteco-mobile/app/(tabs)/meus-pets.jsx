import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CardPet from '../../modules/pet/components/CardPet';
import { colors, radius, font, shadow } from '../../constants/theme';
import useMeusPetsController from '../../modules/pet/controller/useMeusPetsController';

export default function MeusPets() {
  const router = useRouter();
  const {
    petsFiltrados, loading, refreshing,
    filtro, setFiltro, stats, onRefresh,
  } = useMeusPetsController(() => router.replace('/(auth)/login'));

  if (loading) {
    return (
      <View style={s.centro}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

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
          <View style={s.vazio}>
            <Ionicons name="paw-outline" size={48} color={colors.textLight} />
            <Text style={s.vazioTexto}>Nenhum pet cadastrado</Text>
            <TouchableOpacity
              style={s.btnCadastrar}
              onPress={() => router.push('/(tabs)/cadastrar')}
            >
              <Ionicons name="add-circle-outline" size={16} color="#fff" />
              <Text style={s.btnCadastrarTexto}>Cadastrar pet perdido</Text>
            </TouchableOpacity>
          </View>
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
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  vazio: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 12,
  },
  vazioTexto: {
    fontSize: 16,
    ...font.bold,
    color: colors.textDark,
  },
  btnCadastrar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  btnCadastrarTexto: {
    color: '#fff',
    ...font.bold,
    fontSize: 14,
  },
});
