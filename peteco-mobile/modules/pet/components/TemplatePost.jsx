import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../../../constants/theme';
import EspecieIcon from '../../../shared/components/EspecieIcon';
import { useFormatarData } from '../../../shared/hooks/useFormatarData';
import { useParseFoto } from '../../../shared/hooks/useParseFoto';
import { useMascaraTelefone } from '../../../shared/hooks/useMascaraTelefone';

const APP_ICON = require('../../../assets/icon.png');
const SEM_RACA = 'Sem raça definida';

function resolveContatos(petContatos, contatoNomes, contatoAvulso, contatosExtras) {
  const lista = [];
  try {
    const registrados = JSON.parse(petContatos || '[]');
    if (Array.isArray(registrados)) {
      registrados.forEach((c, idx) => {
        lista.push({ ...c, nome: contatoNomes?.[String(idx)] || '' });
      });
    }
  } catch {}
  if (lista.length === 0 && contatoAvulso?.numero) {
    lista.push({ tipo: 'whatsapp', valor: contatoAvulso.numero, nome: contatoAvulso.nome || '' });
  }
  (contatosExtras || []).forEach(c => {
    if (c.valor?.trim()) lista.push(c);
  });
  return lista;
}

export default function TemplatePost({ pet, campos, contatoAvulso, overrides, contatoNomes, contatosExtras, ocultarInstaNoPost }) {
  const { isoParaPtBR }     = useFormatarData();
  const { primeiraFoto }    = useParseFoto();
  const { mascaraTelefone } = useMascaraTelefone();

  const fotoUrl = primeiraFoto(pet?.foto_url);

  const racaExibir    = overrides?.raca    || (pet?.raca && pet.raca !== SEM_RACA ? pet.raca : null);
  const corExibir     = overrides?.cor     || pet?.cor     || null;
  const bairroExibir  = overrides?.bairro  || pet?.bairro  || null;
  const dataExibir    = overrides?.dataPerda || (pet?.data_perda ? isoParaPtBR(pet.data_perda) : null);
  const descExibir    = overrides?.descricao || pet?.descricao || null;
  const recompAtiva   = pet?.recompensa || !!overrides?.recompensaValor;
  const recompValor   = overrides?.recompensaValor || pet?.valor_recompensa || null;

  const contatosRaw     = resolveContatos(pet?.contatos, contatoNomes, contatoAvulso, contatosExtras);
  const contatoInsta    = ocultarInstaNoPost ? null : (contatosRaw.find(c => c.tipo === 'instagram') ?? null);
  const contatosNormais = contatosRaw.filter(c => c.tipo !== 'instagram').slice(0, 3);
  const temContatos     = !!contatoInsta || contatosNormais.length > 0;

  // Calcula densidade para adaptar layout ao conteúdo
  const infoCount = [
    (campos.raca && racaExibir) || (campos.cor && corExibir),
    (campos.bairro && bairroExibir) || (campos.dataPerda && dataExibir),
    campos.descricao && descExibir,
    campos.recompensa && recompAtiva,
  ].filter(Boolean).length;
  const contactCount = (contatoInsta ? 1 : 0) + contatosNormais.length;
  const totalItems   = infoCount + contactCount;

  const d1 = totalItems >= 3; // compacto
  const d2 = totalItems >= 5; // muito compacto

  const photoSize    = d2 ? 66 : temContatos ? 88 : 112;
  const photoMargin  = d2 ? 3  : d1 ? 5 : 8;
  const padTop       = d2 ? 4  : d1 ? 7 : 10;
  const nomeSize     = d2 ? 13 : d1 ? 14 : 16;
  const nomeMargin   = d2 ? 1  : 2;
  const subSize      = d2 ? 9  : 11;
  const subMargin    = d2 ? 1  : 4;
  const detMargin    = d2 ? 1  : 4;
  const descLines    = d2 ? 1  : 2;
  const descSize     = d2 ? 9  : 10;
  const descMargin   = d2 ? 1  : 4;
  const rewPadH      = d2 ? 6  : 8;
  const rewPadV      = d2 ? 1  : 3;
  const rewSize      = d2 ? 8  : 9;
  const rewMargin    = d2 ? 1  : 4;
  const ctaGap       = d2 ? 2  : 3;
  const ctaMarginTop = d2 ? 2  : 4;
  const chipPadV     = d2 ? 2  : 4;

  return (
    <View style={s.container}>
      {/* Decorações de patinha */}
      <Ionicons name="paw" size={52} color="rgba(124,58,237,0.08)" style={[s.paw, { top: -8, right: -8, transform: [{ rotate: '25deg' }] }]} />
      <Ionicons name="paw" size={36} color="rgba(124,58,237,0.06)" style={[s.paw, { top: 90, left: -6, transform: [{ rotate: '-20deg' }] }]} />
      <Ionicons name="paw" size={42} color="rgba(124,58,237,0.07)" style={[s.paw, { bottom: 74, right: 6, transform: [{ rotate: '12deg' }] }]} />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headline}>ME PERDI!</Text>
      </View>

      {/* Conteúdo central */}
      <View style={[s.content, { paddingTop: padTop }]}>
        {/* Foto */}
        <View style={[s.photoFrame, { width: photoSize, height: photoSize, marginBottom: photoMargin }]}>
          {campos.foto && fotoUrl ? (
            <Image source={{ uri: fotoUrl }} style={s.photo} resizeMode="cover" />
          ) : (
            <View style={[s.photo, s.photoVazia]}>
              <EspecieIcon especie={pet?.especie} size={photoSize * 0.45} color={colors.primary} />
            </View>
          )}
        </View>

        {/* Nome */}
        <Text style={[s.nome, { fontSize: nomeSize, marginBottom: nomeMargin }]} numberOfLines={1}>
          {pet?.nome?.toUpperCase()}
        </Text>

        {((campos.raca && racaExibir) || (campos.cor && corExibir)) && (
          <Text style={[s.subtitulo, { fontSize: subSize, marginBottom: subMargin }]} numberOfLines={1}>
            {[campos.raca && racaExibir, campos.cor && corExibir].filter(Boolean).join(' · ')}
          </Text>
        )}

        {((campos.bairro && bairroExibir) || (campos.dataPerda && dataExibir)) && (
          <View style={[s.detalhesRow, { marginBottom: detMargin }]}>
            {campos.bairro && bairroExibir && (
              <View style={s.detalheItem}>
                <Ionicons name="location-outline" size={11} color={colors.textMid} />
                <Text style={s.detalheTexto}>{bairroExibir}</Text>
              </View>
            )}
            {campos.dataPerda && dataExibir && (
              <View style={s.detalheItem}>
                <Ionicons name="calendar-outline" size={11} color={colors.textMid} />
                <Text style={s.detalheTexto}>{dataExibir}</Text>
              </View>
            )}
          </View>
        )}

        {campos.descricao && descExibir && (
          <Text
            style={[s.descricao, { fontSize: descSize, lineHeight: descSize * 1.35, marginBottom: descMargin }]}
            numberOfLines={descLines}
          >
            {descExibir}
          </Text>
        )}

        {/* Recompensa */}
        {campos.recompensa && recompAtiva && (
          <View style={[s.recompensaBadge, { paddingHorizontal: rewPadH, paddingVertical: rewPadV, marginBottom: rewMargin }]}>
            <Ionicons name="gift-outline" size={rewSize} color="#92400E" />
            <Text style={[s.recompensaTexto, { fontSize: rewSize }]}>
              Recompensa{recompValor ? `: ${recompValor}` : ''}
            </Text>
          </View>
        )}

        {/* Contatos */}
        {campos.contato && temContatos && (
          <View style={[s.contatosArea, { gap: ctaGap, marginTop: ctaMarginTop }]}>
            {/* Instagram primeiro */}
            {contatoInsta && (
              <View style={[s.contatoInstaItem, { paddingVertical: chipPadV }]}>
                <Ionicons name="logo-instagram" size={9} color="#db2777" />
                <Text style={s.contatoInstaVal} numberOfLines={1}>{contatoInsta.valor}</Text>
              </View>
            )}

            {/* Contatos normais abaixo, um por linha */}
            {contatosNormais.map((c, idx) => {
              const icon = c.tipo === 'whatsapp' ? 'logo-whatsapp' : 'call-outline';
              const cor  = c.tipo === 'whatsapp' ? '#16a34a' : colors.primary;
              const val  = c.tipo === 'whatsapp' ? mascaraTelefone(c.valor) : c.valor;
              return (
                <View key={idx} style={[s.contatoChip, { paddingVertical: chipPadV }]}>
                  <Ionicons name={icon} size={9} color={cor} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    {c.nome ? <Text style={s.contatoNome} numberOfLines={1}>{c.nome}</Text> : null}
                    <Text style={[s.contatoVal, d2 && { fontSize: 7 }]} numberOfLines={1}>{val}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Rodapé Peteco */}
      <View style={s.ctaSection}>
        <Image source={APP_ICON} style={s.ctaIcon} />
        <View style={s.ctaTextos}>
          <Text style={s.ctaTitulo}>PETECO</Text>
          <Text style={s.ctaSubtitulo} numberOfLines={1}>Você pode ajudar a encontrar este pet!</Text>
        </View>
        <Text style={s.ctaBaixe}>Baixe o app</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: 360,
    height: 360,
    overflow: 'hidden',
    backgroundColor: '#EDE9FE',
  },
  paw: {
    position: 'absolute',
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    color: '#fff',
    ...font.black,
    fontSize: 26,
    letterSpacing: 5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  photoFrame: {
    width: 112,
    height: 112,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 4,
    shadowColor: '#3B1F6E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 9,
  },
  photoVazia: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: {
    fontSize: 16,
    ...font.black,
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 11,
    color: colors.textMid,
    ...font.medium,
    marginBottom: 4,
    textAlign: 'center',
  },
  detalhesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  detalheItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  detalheTexto: {
    color: colors.textMid,
    fontSize: 10,
    ...font.medium,
  },
  descricao: {
    fontSize: 10,
    color: colors.textMid,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 4,
    paddingHorizontal: 6,
    lineHeight: 14,
  },
  recompensaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF7E6',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginBottom: 4,
  },
  recompensaTexto: {
    color: '#92400E',
    fontSize: 9,
    ...font.bold,
  },
  // ─ Contatos
  contatosArea: {
    alignItems: 'center',
    gap: 3,
    width: '100%',
    marginTop: 4,
  },
  contatosLinha: {
    flexDirection: 'row',
    gap: 3,
    width: '100%',
  },
  contatoChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.15)',
    minWidth: 0,
  },
  contatoNome: {
    fontSize: 6,
    color: colors.textMid,
    ...font.medium,
    marginBottom: 1,
  },
  contatoVal: {
    fontSize: 8,
    color: colors.textDark,
    ...font.bold,
  },
  contatoInstaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(219,39,119,0.2)',
    alignSelf: 'center',
  },
  contatoInstaVal: {
    fontSize: 9,
    color: '#db2777',
    ...font.bold,
  },
  ctaSection: {
    backgroundColor: colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 9,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  ctaIcon: {
    width: 30,
    height: 30,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  ctaTextos: {
    flex: 1,
  },
  ctaTitulo: {
    color: '#fff',
    ...font.black,
    fontSize: 11,
    letterSpacing: 2.5,
  },
  ctaSubtitulo: {
    color: '#DDD6FE',
    ...font.medium,
    fontSize: 9,
    marginTop: 1,
  },
  ctaBaixe: {
    color: '#C4B5FD',
    fontSize: 10,
    ...font.bold,
  },
});
