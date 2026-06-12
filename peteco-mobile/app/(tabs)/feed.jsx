import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CardPet from '../../modules/pet/components/CardPet';
import { colors, radius, font, shadow } from '../../constants/theme';
import useFeedController from '../../modules/pet/controller/useFeedController';
import LoadingCentro from '../../shared/components/LoadingCentro';
import EmptyState from '../../shared/components/EmptyState';

const CATEGORIAS = [
  { label: 'Todos',     icon: 'apps',               lib: 'ion', filtro: '' },
  { label: 'Cachorros', icon: 'dog',                lib: 'mci', filtro: 'cachorro' },
  { label: 'Gatos',     icon: 'cat',                lib: 'mci', filtro: 'gato' },
  { label: 'Outros',    icon: 'ellipsis-horizontal', lib: 'ion', filtro: 'outro' },
];

export default function Feed() {
  const router = useRouter();
  const {
    petsFiltrados, loading, refreshing,
    categoria, busca, setBusca,
    notificacoes, onRefresh, selecionarCategoria,
  } = useFeedController();

  const Header = () => (
    <View>
      <View style={s.topo}>
        <View>
          <Text style={s.titulo}>Pets Perdidos</Text>
        </View>
        <TouchableOpacity style={s.btnBusca} onPress={() => router.push('/busca')}>
          <Ionicons name="search-outline" size={20} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      <View style={s.searchBox}>
        <Ionicons name="search-outline" size={16} color={colors.textLight} style={s.searchIcon} />
        <TextInput
          style={s.searchInput}
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar por nome ou bairro..."
          placeholderTextColor={colors.textLight}
        />
      </View>

      <Text style={s.secaoTitulo}>Categoria</Text>
      <FlatList
        data={CATEGORIAS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={i => i.filtro}
        contentContainerStyle={{ gap: 8, paddingRight: 8 }}
        style={{ marginBottom: 20 }}
        renderItem={({ item }) => {
          const ativo = item.filtro === categoria;
          return (
            <TouchableOpacity
              style={[s.chip, ativo && s.chipAtivo]}
              onPress={() => selecionarCategoria(item.filtro)}
              activeOpacity={0.75}
            >
              {item.lib === 'mci' ? (
                <MaterialCommunityIcons name={item.icon} size={15} color={ativo ? '#fff' : colors.textMid} />
              ) : (
                <Ionicons name={ativo ? item.icon : `${item.icon}-outline`} size={15} color={ativo ? '#fff' : colors.textMid} />
              )}
              <Text style={[s.chipLabel, ativo && s.chipLabelAtivo]}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={s.contadorRow}>
        <Text style={s.secaoTitulo}>
          {categoria ? CATEGORIAS.find(c => c.filtro === categoria)?.label : 'Todos os pets'}
        </Text>
        <Text style={s.contador}>
          {petsFiltrados.length} resultado{petsFiltrados.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );

  if (loading) return <LoadingCentro />;

  return (
    <View style={s.container}>
      <FlatList
        data={petsFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CardPet pet={item} notificacoes={notificacoes[item.id] ?? 0} />}
        ListHeaderComponent={Header}
        contentContainerStyle={s.lista}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="paw-outline"
            title="Nenhum pet encontrado"
            subtitle="Tente outra categoria ou cadastre um pet perdido"
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
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  boaVinda: {
    fontSize: 14,
    color: colors.textMid,
    ...font.medium,
  },
  titulo: {
    fontSize: 26,
    ...font.black,
    color: colors.textDark,
    marginTop: 2,
  },
  btnBusca: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    marginBottom: 20,
    ...shadow.card,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: colors.textDark,
    fontSize: 14,
  },
  secaoTitulo: {
    fontSize: 16,
    ...font.black,
    color: colors.textDark,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    fontSize: 13,
    color: colors.textMid,
    ...font.medium,
  },
  chipLabelAtivo: {
    color: '#fff',
    ...font.bold,
  },
  contadorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contador: {
    fontSize: 13,
    color: colors.textMid,
  },
});
