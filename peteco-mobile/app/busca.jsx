import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CardPet from '../modules/pet/components/CardPet';
import { colors, radius, font, shadow } from '../constants/theme';
import useBuscaController from '../modules/pet/controller/useBuscaController';

const ESPECIES = ['cachorro', 'gato', 'outro'];

export default function Busca() {
  const router = useRouter();
  const { resultados, loading, buscou, filtros, set, buscar } = useBuscaController();

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.voltar}>
          <Ionicons name="arrow-back" size={20} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={s.titulo}>Busca avançada</Text>
      </View>

      <View style={s.filtrosCard}>
        <View style={s.campo}>
          <Text style={s.label}>Cidade</Text>
          <TextInput
            style={s.input}
            value={filtros.cidade}
            onChangeText={v => set('cidade', v)}
            placeholder="Ex: Boa Vista"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={s.campo}>
          <Text style={s.label}>Espécie</Text>
          <View style={s.chipRow}>
            {['', ...ESPECIES].map(e => (
              <TouchableOpacity
                key={e}
                style={[s.chip, filtros.especie === e && s.chipAtivo]}
                onPress={() => set('especie', e)}
              >
                <Text style={[s.chipLabel, filtros.especie === e && s.chipLabelAtivo]}>
                  {e === ''         ? 'Todos'
                    : e === 'cachorro' ? 'Cachorro'
                    : e === 'gato'     ? 'Gato'
                    : 'Outro'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={s.btnBuscar} onPress={buscar} activeOpacity={0.85}>
          <Ionicons name="search" size={18} color="#fff" />
          <Text style={s.btnBuscarTexto}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={s.centro}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={i => i.id}
          renderItem={({ item }) => <CardPet pet={item} />}
          contentContainerStyle={s.lista}
          ListEmptyComponent={
            buscou ? (
              <View style={s.vazio}>
                <Ionicons name="search-outline" size={40} color={colors.textLight} />
                <Text style={s.vazioTexto}>Nenhum resultado</Text>
                <Text style={s.vazioSub}>Tente outros filtros</Text>
              </View>
            ) : (
              <View style={s.vazio}>
                <Ionicons name="paw-outline" size={40} color={colors.textLight} />
                <Text style={s.vazioSub}>Use os filtros acima para buscar</Text>
              </View>
            )
          }
        />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    paddingTop: 56,
  },
  voltar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  titulo: {
    fontSize: 22,
    ...font.black,
    color: colors.textDark,
  },
  filtrosCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: radius.lg,
    padding: 16,
    gap: 14,
    ...shadow.card,
    marginBottom: 16,
  },
  campo: {
    gap: 6,
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    fontSize: 12,
    color: colors.textMid,
    ...font.medium,
  },
  chipLabelAtivo: {
    color: '#fff',
    ...font.bold,
  },
  btnBuscar: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnBuscarTexto: {
    color: '#fff',
    fontSize: 15,
    ...font.bold,
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  vazio: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 8,
  },
  vazioTexto: {
    fontSize: 16,
    ...font.bold,
    color: colors.textDark,
  },
  vazioSub: {
    fontSize: 13,
    color: colors.textMid,
    textAlign: 'center',
  },
});
