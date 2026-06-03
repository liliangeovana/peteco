import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../../shared/lib/api';
import { colors, font, radius, shadow } from '../../../constants/theme';

export default function CardInsightsIA() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro]       = useState(false);

  useEffect(() => {
    api.get('/analise/estatisticas')
      .then(res => setStats(res.data))
      .catch(() => setErro(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={s.card}>
        <View style={s.headerRow}>
          <Text style={s.icone}>📊</Text>
          <Text style={s.titulo}>Estatísticas</Text>
        </View>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
      </View>
    );
  }

  if (erro || !stats) {
    return (
      <View style={[s.card, s.cardErro]}>
        <View style={s.headerRow}>
          <Text style={s.icone}>📊</Text>
          <Text style={[s.titulo, { color: colors.textMid }]}>Estatísticas</Text>
        </View>
        <Text style={s.erroTexto}>Serviço indisponível no momento.</Text>
      </View>
    );
  }

  const taxaRetorno = stats.total_perdidos + stats.total_encontrados > 0
    ? Math.round((stats.total_encontrados / (stats.total_perdidos + stats.total_encontrados)) * 100)
    : 0;

  return (
    <View style={s.card}>
      <View style={s.headerRow}>
        <Text style={s.icone}>📊</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.titulo}>Estatísticas</Text>
          <Text style={s.subtitulo}>Dados em tempo real</Text>
        </View>
      </View>

      <View style={s.statsRow}>
        <View style={[s.statBox, { backgroundColor: colors.dangerLight }]}>
          <Text style={[s.statNum, { color: colors.danger }]}>{stats.total_perdidos}</Text>
          <Text style={s.statLabel}>Perdidos</Text>
        </View>
        <View style={[s.statBox, { backgroundColor: colors.successLight }]}>
          <Text style={[s.statNum, { color: colors.success }]}>{stats.total_encontrados}</Text>
          <Text style={s.statLabel}>Encontrados</Text>
        </View>
        <View style={[s.statBox, { backgroundColor: colors.primaryLight }]}>
          <Text style={[s.statNum, { color: colors.primary }]}>{taxaRetorno}%</Text>
          <Text style={s.statLabel}>Taxa retorno</Text>
        </View>
      </View>

      {stats.por_especie?.length > 0 && (
        <View style={s.especiesRow}>
          {stats.por_especie.slice(0, 3).map(e => (
            <View key={e.especie} style={s.especieChip}>
              <Text style={s.especieEmoji}>
                {e.especie === 'cachorro' ? '🐶' : e.especie === 'gato' ? '🐱' : '🐾'}
              </Text>
              <Text style={s.especieTexto}>{e.especie} · {e.total}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    ...shadow.card,
  },
  cardErro: {
    borderLeftColor: colors.textLight,
    opacity: 0.8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  icone:    { fontSize: 22 },
  titulo:   { fontSize: 15, ...font.black, color: colors.textDark },
  subtitulo:{ fontSize: 10, color: colors.textLight, marginTop: 1 },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: radius.sm,
    padding: 10,
    alignItems: 'center',
  },
  statNum:   { fontSize: 20, ...font.black },
  statLabel: { fontSize: 10, color: colors.textMid, marginTop: 2 },
  erroTexto: { fontSize: 12, color: colors.textLight, marginTop: 4 },
  especiesRow:  { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  especieChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  especieEmoji: { fontSize: 13 },
  especieTexto: { fontSize: 11, color: colors.primary, ...font.medium },
});
