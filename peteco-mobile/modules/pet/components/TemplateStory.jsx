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

export default function TemplateStory({ pet, campos, contatoAvulso, overrides, contatoNomes, contatosExtras, ocultarInstaNoPost }) {
  const { isoParaPtBR }     = useFormatarData();
  const { primeiraFoto }    = useParseFoto();
  const { mascaraTelefone } = useMascaraTelefone();

  const fotoUrl = primeiraFoto(pet?.foto_url);

  const racaExibir   = overrides?.raca    || (pet?.raca && pet.raca !== SEM_RACA ? pet.raca : null);
  const corExibir    = overrides?.cor     || pet?.cor     || null;
  const bairroExibir = overrides?.bairro  || pet?.bairro  || null;
  const dataExibir   = overrides?.dataPerda || (pet?.data_perda ? isoParaPtBR(pet.data_perda) : null);
  const descExibir   = overrides?.descricao || pet?.descricao || null;
  const recompAtiva  = pet?.recompensa || !!overrides?.recompensaValor;
  const recompValor  = overrides?.recompensaValor || pet?.valor_recompensa || null;

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

  const d1 = totalItems >= 4; // compacto
  const d2 = totalItems >= 6; // muito compacto

  const photoSize    = d2 ? 120 : d1 ? 145 : 180;
  const photoPadV    = d2 ? 8   : d1 ? 12  : 20;
  const padTop       = d2 ? 2   : 4;
  const nomeSize     = d2 ? 18  : d1 ? 20  : 22;
  const nomeMargin   = d2 ? 2   : 4;
  const subSize      = d2 ? 11  : 13;
  const subMargin    = d2 ? 4   : 8;
  const detMargin    = d2 ? 4   : 8;
  const descLines    = d2 ? 2   : 3;
  const descMargin   = d2 ? 4   : 8;
  const rewMargin    = d2 ? 4   : 8;
  const ctaGap       = d2 ? 3   : 4;
  const chipPadV     = d2 ? 3   : 5;
  const chipFontSize = d2 ? 10  : 11;

  return (
    <View style={s.container}>
      {/* Decorações de patinha */}
      <Ionicons name="paw" size={70} color="rgba(124,58,237,0.07)" style={[s.paw, { top: 100, right: -12, transform: [{ rotate: '20deg' }] }]} />
      <Ionicons name="paw" size={50} color="rgba(124,58,237,0.06)" style={[s.paw, { top: 200, left: -10, transform: [{ rotate: '-15deg' }] }]} />
      <Ionicons name="paw" size={55} color="rgba(124,58,237,0.07)" style={[s.paw, { bottom: 200, right: 5, transform: [{ rotate: '10deg' }] }]} />
      <Ionicons name="paw" size={38} color="rgba(124,58,237,0.05)" style={[s.paw, { bottom: 130, left: 5, transform: [{ rotate: '-25deg' }] }]} />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headline}>ME PERDI!</Text>
        <Text style={s.headerSub}>Você pode ajudar a encontrá-lo!</Text>
      </View>

      {/* Foto */}
      <View style={[s.photoArea, { paddingVertical: photoPadV }]}>
        <View style={[s.photoFrame, { width: photoSize, height: photoSize }]}>
          {campos.foto && fotoUrl ? (
            <Image source={{ uri: fotoUrl }} style={s.photo} resizeMode="cover" />
          ) : (
            <View style={[s.photo, s.photoVazia]}>
              <EspecieIcon especie={pet?.especie} size={photoSize * 0.44} color={colors.primary} />
            </View>
          )}
        </View>
      </View>

      {/* Informações */}
      <View style={[s.infoSection, { paddingTop: padTop }]}>
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
                <Ionicons name="location-outline" size={d2 ? 11 : 13} color={colors.textMid} />
                <Text style={s.detalheTexto}>{bairroExibir}</Text>
              </View>
            )}
            {campos.dataPerda && dataExibir && (
              <View style={s.detalheItem}>
                <Ionicons name="calendar-outline" size={d2 ? 11 : 13} color={colors.textMid} />
                <Text style={s.detalheTexto}>{dataExibir}</Text>
              </View>
            )}
          </View>
        )}

        {campos.descricao && descExibir && (
          <Text style={[s.descricao, { marginBottom: descMargin }]} numberOfLines={descLines}>
            {descExibir}
          </Text>
        )}

        {campos.recompensa && recompAtiva && (
          <View style={[s.recompensaBadge, { marginBottom: rewMargin }]}>
            <Ionicons name="gift-outline" size={d2 ? 11 : 13} color="#92400E" />
            <Text style={s.recompensaTexto}>
              Recompensa{recompValor ? `: ${recompValor}` : ''}
            </Text>
          </View>
        )}

        {/* Contatos */}
        {campos.contato && temContatos && (
          <View style={[s.contatoArea, { gap: ctaGap }]}>
            <Text style={s.contatoCta}>Se você viu, entre em contato:</Text>

            {/* Instagram primeiro */}
            {contatoInsta && (
              <View style={[s.contatoInstaItem, { paddingVertical: chipPadV }]}>
                <Ionicons name="logo-instagram" size={d2 ? 10 : 12} color="#db2777" />
                <Text style={[s.contatoInstaVal, { fontSize: chipFontSize }]} numberOfLines={1}>
                  {contatoInsta.valor}
                </Text>
              </View>
            )}

            {/* Contatos normais abaixo, um por linha */}
            {contatosNormais.map((c, idx) => {
              const icon = c.tipo === 'whatsapp' ? 'logo-whatsapp' : 'call-outline';
              const cor  = c.tipo === 'whatsapp' ? '#16a34a' : colors.primary;
              const val  = c.tipo === 'whatsapp' ? mascaraTelefone(c.valor) : c.valor;
              return (
                <View key={idx} style={[s.contatoItem, { paddingVertical: chipPadV }]}>
                  <Ionicons name={icon} size={d2 ? 10 : 12} color={cor} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    {c.nome ? <Text style={s.contatoNome} numberOfLines={1}>{c.nome}</Text> : null}
                    <Text style={[s.contatoValor, { fontSize: chipFontSize }]} numberOfLines={1}>{val}</Text>
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
          <Text style={s.ctaSubtitulo} numberOfLines={1}>Ajude a reunir famílias com seus pets!</Text>
          <Text style={s.ctaDownload}>Baixe o app</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: 360,
    height: 640,
    backgroundColor: '#EDE9FE',
    overflow: 'hidden',
  },
  paw: {
    position: 'absolute',
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  headline: {
    color: '#fff',
    ...font.black,
    fontSize: 34,
    letterSpacing: 6,
  },
  headerSub: {
    color: '#DDD6FE',
    ...font.medium,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  photoArea: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  photoFrame: {
    width: 180,
    height: 180,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 5,
    shadowColor: '#3B1F6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 7,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  photoVazia: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 4,
    alignItems: 'center',
  },
  nome: {
    fontSize: 22,
    ...font.black,
    color: colors.primary,
    letterSpacing: 2.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textMid,
    ...font.medium,
    marginBottom: 8,
    textAlign: 'center',
  },
  detalhesRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  detalheItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detalheTexto: {
    color: colors.textMid,
    fontSize: 12,
    ...font.medium,
  },
  descricao: {
    fontSize: 12,
    color: colors.textMid,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 17,
    paddingHorizontal: 4,
  },
  recompensaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7E6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginBottom: 8,
  },
  recompensaTexto: {
    color: '#92400E',
    fontSize: 11,
    ...font.bold,
  },
  // ─ Contatos
  contatoArea: {
    alignItems: 'stretch',
    gap: 4,
    width: '100%',
    marginTop: 6,
  },
  contatoCta: {
    fontSize: 10,
    color: colors.textMid,
    fontStyle: 'italic',
    marginBottom: 1,
    textAlign: 'center',
  },
  contatoInstaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(219,39,119,0.25)',
    alignSelf: 'center',
  },
  contatoInstaVal: {
    fontSize: 12,
    color: '#db2777',
    ...font.bold,
  },
  contatoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.13)',
  },
  contatoNome: {
    fontSize: 8,
    color: colors.textMid,
    ...font.medium,
    marginBottom: 1,
  },
  contatoValor: {
    fontSize: 11,
    color: colors.textDark,
    ...font.bold,
  },
  ctaSection: {
    backgroundColor: colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 12,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  ctaIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  ctaTextos: {
    flex: 1,
  },
  ctaTitulo: {
    color: '#fff',
    ...font.black,
    fontSize: 13,
    letterSpacing: 3,
  },
  ctaSubtitulo: {
    color: '#DDD6FE',
    ...font.medium,
    fontSize: 10,
    marginTop: 1,
  },
  ctaDownload: {
    color: '#C4B5FD',
    fontSize: 10,
    ...font.regular,
    marginTop: 2,
  },
});
