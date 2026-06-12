import { useEffect, useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Switch, TextInput,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, radius, shadow } from '../../../constants/theme';
import { useMascaraTelefone } from '../../../shared/hooks/useMascaraTelefone';
import SelectModal from '../../../shared/components/SelectModal';
import DatePickerField from '../../../shared/components/DatePickerField';
import { RACAS, SEM_RACA } from '../../../constants/racas';
import { BAIRROS_BOA_VISTA } from '../../../constants/bairros';
import TemplateStory from './TemplateStory';
import TemplatePost from './TemplatePost';

const STORY_W = 360;
const STORY_H = 640;
const POST_W  = 360;
const POST_H  = 360;

const PREVIEW_SCALE_STORY = 0.62;
const PREVIEW_SCALE_POST  = 0.75;

const FORMATOS = [
  { key: 'story', label: 'Story (9:16)', icon: 'phone-portrait-outline' },
  { key: 'post',  label: 'Post (1:1)',   icon: 'square-outline' },
];

const OPCOES_BAIRRO = BAIRROS_BOA_VISTA.map(b => b.nome);

const CAMPOS_EXTRAS = [
  {
    campo: 'raca',
    label: 'Raça',
    overrideKey: 'raca',
    placeholder: 'Selecionar raça',
    isSelect: 'raca',
  },
  {
    campo: 'cor',
    label: 'Cor / marcações',
    overrideKey: 'cor',
    placeholder: 'Ex: preto e branco, caramelo...',
  },
  {
    campo: 'bairro',
    label: 'Bairro',
    overrideKey: 'bairro',
    placeholder: 'Selecionar bairro',
    isSelect: 'bairro',
  },
  {
    campo: 'dataPerda',
    label: 'Data de desaparecimento',
    overrideKey: 'dataPerda',
    placeholder: 'Selecionar data',
    isSelect: 'data',
  },
  {
    campo: 'descricao',
    label: 'Descrição',
    overrideKey: 'descricao',
    placeholder: 'Ex: mancha branca no peito, usa coleira vermelha...',
    multiline: true,
  },
  {
    campo: 'recompensa',
    label: 'Recompensa',
    overrideKey: 'recompensaValor',
    placeholder: 'Valor da recompensa (ex: R$ 200) — opcional',
  },
];

function parseContatos(raw) {
  try {
    const lista = JSON.parse(raw || '[]');
    return Array.isArray(lista) ? lista : [];
  } catch { return []; }
}

function PreviewContainer({ template, shotRef, pet, campos, contatoAvulso, overrides, contatoNomes, contatosExtras, ocultarInstaNoPost }) {
  const isStory = template === 'story';
  const scale   = isStory ? PREVIEW_SCALE_STORY : PREVIEW_SCALE_POST;
  const natW    = isStory ? STORY_W : POST_W;
  const natH    = isStory ? STORY_H : POST_H;
  const boxW    = natW * scale;
  const boxH    = natH * scale;
  const offX    = -(natW - boxW) / 2;
  const offY    = -(natH - boxH) / 2;

  const templateNode = isStory
    ? <TemplateStory pet={pet} campos={campos} contatoAvulso={contatoAvulso} overrides={overrides} contatoNomes={contatoNomes} contatosExtras={contatosExtras} ocultarInstaNoPost={ocultarInstaNoPost} />
    : <TemplatePost  pet={pet} campos={campos} contatoAvulso={contatoAvulso} overrides={overrides} contatoNomes={contatoNomes} contatosExtras={contatosExtras} ocultarInstaNoPost={ocultarInstaNoPost} />;

  return (
    <View style={[s.previewBox, { width: boxW, height: boxH }]}>
      <View style={{
        position: 'absolute',
        width: natW,
        height: natH,
        transform: [{ translateX: offX }, { translateY: offY }, { scale }],
      }}>
        <ViewShot ref={shotRef} options={{ format: 'png', quality: 1 }}>
          {templateNode}
        </ViewShot>
      </View>
    </View>
  );
}

function ToggleItem({ label, value, onToggle, disabled }) {
  return (
    <View style={[s.toggleRow, disabled && s.toggleRowDisabled]}>
      <Text style={s.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.textLight}
      />
    </View>
  );
}

function OverrideInput({ placeholder, value, onChange, multiline }) {
  return (
    <TextInput
      style={[s.overrideInput, multiline && s.overrideInputMulti]}
      placeholder={placeholder}
      placeholderTextColor={colors.textLight}
      value={value}
      onChangeText={onChange}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  );
}

function ContatoSection({
  pet, contatoAvulso, atualizarContatoAvulso,
  contatoNomes, atualizarContatoNome,
  contatosExtras, adicionarContatoExtra, removerContatoExtra, atualizarContatoExtra,
  ocultarInstaNoPost, setOcultarInstaNoPost,
}) {
  const { mascaraTelefone } = useMascaraTelefone();
  const contatos = parseContatos(pet?.contatos);

  // Instagram primeiro, depois os demais
  const contatosOrdenados = [
    ...contatos.map((c, i) => ({ ...c, _idx: i })).filter(c => c.tipo === 'instagram'),
    ...contatos.map((c, i) => ({ ...c, _idx: i })).filter(c => c.tipo !== 'instagram'),
  ];

  // Total efetivo: cadastrados (ou 1 avulso se não há cadastrados) + extras
  const totalEfetivo = (contatos.length === 0 ? 1 : contatos.length) + contatosExtras.length;
  const podeAdicionarMais = totalEfetivo < 3;

  return (
    <View style={s.contatoSection}>
      {/* Contatos cadastrados (Instagram primeiro) */}
      {contatosOrdenados.map(c => {
        const idx       = c._idx;
        const iconName  = c.tipo === 'whatsapp' ? 'logo-whatsapp' : c.tipo === 'instagram' ? 'logo-instagram' : 'chatbubble-ellipses-outline';
        const iconColor = c.tipo === 'whatsapp' ? '#16a34a'       : c.tipo === 'instagram' ? '#db2777'        : colors.primary;
        const valorFmt  = c.tipo === 'whatsapp' ? mascaraTelefone(c.valor) : c.valor;

        return (
          <View key={idx} style={[s.contatoRegItem, c.tipo === 'instagram' && s.contatoRegItemInsta]}>
            <View style={s.contatoRegInfo}>
              <Ionicons name={iconName} size={14} color={iconColor} />
              <Text style={s.contatoRegValor}>{valorFmt}</Text>
              <View style={s.tagCadastrado}><Text style={s.tagCadastradoTxt}>cadastrado</Text></View>
              {/* Toggle ocultar Instagram no post */}
              {c.tipo === 'instagram' && (
                <TouchableOpacity
                  style={s.btnOcultarInsta}
                  onPress={() => setOcultarInstaNoPost(!ocultarInstaNoPost)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={ocultarInstaNoPost ? 'eye-off-outline' : 'eye-outline'}
                    size={16}
                    color={ocultarInstaNoPost ? colors.textLight : colors.primary}
                  />
                  <Text style={[s.btnOcultarInstaTxt, ocultarInstaNoPost && { color: colors.textLight }]}>
                    {ocultarInstaNoPost ? 'oculto no post' : 'visível no post'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {c.tipo !== 'instagram' && (
              <OverrideInput
                placeholder="Nome de quem atende (ex: João, Família Silva...)"
                value={contatoNomes[String(idx)] || ''}
                onChange={v => atualizarContatoNome(idx, v)}
              />
            )}
          </View>
        );
      })}

      {/* Sem contato cadastrado: campo avulso */}
      {contatos.length === 0 && (
        <>
          <OverrideInput
            placeholder="Número de WhatsApp *"
            value={contatoAvulso.numero}
            onChange={v => atualizarContatoAvulso('numero', mascaraTelefone(v))}
          />
          <View style={{ height: 6 }} />
          <OverrideInput
            placeholder="Nome de quem atende"
            value={contatoAvulso.nome}
            onChange={v => atualizarContatoAvulso('nome', v)}
          />
        </>
      )}

      {/* Contatos extras adicionados pelo usuário */}
      {contatosExtras.map((c, idx) => {
        const instaJaUsado =
          contatos.some(r => r.tipo === 'instagram') ||
          contatosExtras.some((e, i) => i !== idx && e.tipo === 'instagram');

        return (
        <View key={`extra-${idx}`} style={s.contatoExtraItem}>
          <View style={s.contatoExtraHeader}>
            <View style={s.contatoExtraTipos}>
              {[
                { tipo: 'whatsapp',  icon: 'logo-whatsapp' },
                { tipo: 'instagram', icon: 'logo-instagram' },
                { tipo: 'outro',     icon: 'ellipsis-horizontal' },
              ].map(({ tipo, icon }) => {
                const ativo      = c.tipo === tipo;
                const bloqueado  = tipo === 'instagram' && instaJaUsado && !ativo;
                return (
                  <TouchableOpacity
                    key={tipo}
                    style={[s.tipoChipExtra, ativo && s.tipoChipExtraAtivo, bloqueado && s.tipoChipExtraBloqueado]}
                    onPress={() => !bloqueado && atualizarContatoExtra(idx, 'tipo', tipo)}
                    activeOpacity={bloqueado ? 1 : 0.7}
                  >
                    <Ionicons name={icon} size={14} color={ativo ? '#fff' : bloqueado ? colors.border : colors.textMid} />
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity onPress={() => removerContatoExtra(idx)} style={s.btnRemoverExtra}>
              <Ionicons name="trash-outline" size={14} color={colors.danger} />
            </TouchableOpacity>
          </View>
          <OverrideInput
            placeholder={
              c.tipo === 'whatsapp'  ? 'Ex: 95 99999-9999' :
              c.tipo === 'instagram' ? 'Ex: @perfil' :
              'Descreva o contato'
            }
            value={c.tipo === 'whatsapp' ? mascaraTelefone(c.valor) : c.valor}
            onChange={v => atualizarContatoExtra(idx, 'valor', c.tipo === 'whatsapp' ? mascaraTelefone(v) : v)}
          />
          {c.tipo !== 'instagram' && (
            <>
              <View style={{ height: 4 }} />
              <OverrideInput
                placeholder="Nome de quem é (ex: Maria)"
                value={c.nome}
                onChange={v => atualizarContatoExtra(idx, 'nome', v)}
              />
            </>
          )}
        </View>
        );
      })}

      {/* Botão adicionar contato */}
      {podeAdicionarMais ? (
        <TouchableOpacity style={s.btnAdicionarContato} onPress={adicionarContatoExtra} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={15} color={colors.primary} />
          <Text style={s.btnAdicionarContatoTxt}>Adicionar outro contato</Text>
        </TouchableOpacity>
      ) : (
        <Text style={s.limiteContatosTxt}>Limite de 3 contatos atingido</Text>
      )}
    </View>
  );
}

export default function PostSocialModal({
  visible, onClose, pet,
  shotRef, template, setTemplate,
  campos, toggleCampo,
  overrides, atualizarOverride,
  contatoNomes, atualizarContatoNome,
  contatoAvulso, atualizarContatoAvulso,
  contatosExtras, adicionarContatoExtra, removerContatoExtra, atualizarContatoExtra,
  ocultarInstaNoPost, setOcultarInstaNoPost,
  inicializarComPet,
  gerando, onGerar,
}) {
  const insets = useSafeAreaInsets();
  const [modalRacaVisivel, setModalRacaVisivel]     = useState(false);
  const [modalBairroVisivel, setModalBairroVisivel] = useState(false);
  const [dataPickerValue, setDataPickerValue]       = useState(null);

  useEffect(() => {
    if (visible && pet && inicializarComPet) {
      inicializarComPet(pet);
      setDataPickerValue(pet?.data_perda ? new Date(pet.data_perda) : null);
    }
  }, [visible]);

  function handleDataChange(date) {
    setDataPickerValue(date);
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    atualizarOverride('dataPerda', `${d}/${m}/${y}`);
  }

  const racasDisponiveis = RACAS[pet?.especie] ?? [SEM_RACA];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[s.container, { paddingTop: insets.top }]}>

        <View style={s.header}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={22} color={colors.textMid} />
          </TouchableOpacity>
          <Text style={s.headerTitulo}>Gerar post</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Formato */}
          <Text style={s.secaoTitulo}>Formato</Text>
          <View style={s.chipRow}>
            {FORMATOS.map(({ key, label, icon }) => (
              <TouchableOpacity
                key={key}
                style={[s.chip, template === key && s.chipAtivo]}
                onPress={() => setTemplate(key)}
                activeOpacity={0.75}
              >
                <Ionicons name={icon} size={15} color={template === key ? '#fff' : colors.textMid} />
                <Text style={[s.chipTexto, template === key && s.chipTextoAtivo]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Preview */}
          <Text style={s.secaoTitulo}>Preview</Text>
          <View style={s.previewWrapper}>
            <PreviewContainer
              template={template}
              shotRef={shotRef}
              pet={pet}
              campos={campos}
              contatoAvulso={contatoAvulso}
              overrides={overrides}
              contatoNomes={contatoNomes}
              contatosExtras={contatosExtras}
              ocultarInstaNoPost={ocultarInstaNoPost}
            />
          </View>

          {/* Toggles + campos */}
          <Text style={s.secaoTitulo}>O que exibir</Text>
          <View style={s.togglesCard}>
            {/* Foto */}
            <ToggleItem label="Foto do pet" value={campos.foto} onToggle={() => toggleCampo('foto')} />

            {/* Campos extras */}
            {CAMPOS_EXTRAS.map(({ campo, label, overrideKey, placeholder, multiline, isSelect }) => (
              <View key={campo}>
                <View style={s.divisor} />
                <ToggleItem label={label} value={campos[campo]} onToggle={() => toggleCampo(campo)} />
                {campos[campo] && (
                  isSelect === 'raca' ? (
                    <TouchableOpacity style={s.selectBtn} onPress={() => setModalRacaVisivel(true)} activeOpacity={0.8}>
                      <Text style={[s.selectBtnTxt, !overrides[overrideKey] && s.selectBtnPlaceholder]}>
                        {overrides[overrideKey] || placeholder}
                      </Text>
                      <Ionicons name="chevron-down" size={14} color={colors.textLight} />
                    </TouchableOpacity>
                  ) : isSelect === 'bairro' ? (
                    <TouchableOpacity style={s.selectBtn} onPress={() => setModalBairroVisivel(true)} activeOpacity={0.8}>
                      <Text style={[s.selectBtnTxt, !overrides[overrideKey] && s.selectBtnPlaceholder]}>
                        {overrides[overrideKey] || placeholder}
                      </Text>
                      <Ionicons name="chevron-down" size={14} color={colors.textLight} />
                    </TouchableOpacity>
                  ) : isSelect === 'data' ? (
                    <DatePickerField
                      value={dataPickerValue}
                      onChange={handleDataChange}
                      placeholder={placeholder}
                      style={s.datePickerOverride}
                    />
                  ) : (
                    <OverrideInput
                      placeholder={placeholder}
                      value={overrides[overrideKey] || ''}
                      onChange={v => atualizarOverride(overrideKey, v)}
                      multiline={multiline}
                    />
                  )
                )}
              </View>
            ))}

            {/* Contato */}
            <View style={s.divisor} />
            <ToggleItem label="Contato" value={campos.contato} onToggle={() => toggleCampo('contato')} />
            {campos.contato && (
              <ContatoSection
                pet={pet}
                contatoAvulso={contatoAvulso}
                atualizarContatoAvulso={atualizarContatoAvulso}
                contatoNomes={contatoNomes}
                atualizarContatoNome={atualizarContatoNome}
                contatosExtras={contatosExtras}
                adicionarContatoExtra={adicionarContatoExtra}
                removerContatoExtra={removerContatoExtra}
                atualizarContatoExtra={atualizarContatoExtra}
                ocultarInstaNoPost={ocultarInstaNoPost}
                setOcultarInstaNoPost={setOcultarInstaNoPost}
              />
            )}

            {/* Marca Peteco (fixo) */}
            <View style={s.divisor} />
            <ToggleItem label="Marca Peteco" value disabled />
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={[s.rodape, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            style={[s.btnGerar, gerando && s.btnGerarOff]}
            onPress={() => onGerar(pet?.nome)}
            disabled={gerando}
            activeOpacity={0.85}
          >
            {gerando
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Ionicons name="share-social-outline" size={20} color="#fff" />
                  <Text style={s.btnGerarTexto}>Gerar e compartilhar</Text>
                </>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* Select de raça */}
      <SelectModal
        visible={modalRacaVisivel}
        title="Selecionar raça"
        data={racasDisponiveis}
        value={overrides.raca}
        onSelect={v => { atualizarOverride('raca', v); setModalRacaVisivel(false); }}
        onClose={() => setModalRacaVisivel(false)}
      />

      {/* Select de bairro */}
      <SelectModal
        visible={modalBairroVisivel}
        title="Selecionar bairro"
        data={OPCOES_BAIRRO}
        value={overrides.bairro}
        onSelect={v => { atualizarOverride('bairro', v); setModalBairroVisivel(false); }}
        onClose={() => setModalBairroVisivel(false)}
      />
    </Modal>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitulo: {
    ...font.bold,
    fontSize: 16,
    color: colors.textDark,
  },
  scroll: {
    padding: 16,
  },
  secaoTitulo: {
    ...font.bold,
    fontSize: 13,
    color: colors.textMid,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 6,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  chipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipTexto: {
    ...font.medium,
    fontSize: 13,
    color: colors.textMid,
  },
  chipTextoAtivo: {
    color: '#fff',
  },
  previewWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    ...shadow.card,
  },
  previewBox: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  togglesCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    ...shadow.card,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  toggleRowDisabled: {
    opacity: 0.45,
  },
  toggleLabel: {
    ...font.medium,
    fontSize: 14,
    color: colors.textDark,
  },
  divisor: {
    height: 1,
    backgroundColor: colors.border,
  },
  overrideInput: {
    height: 40,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.textDark,
    marginBottom: 10,
  },
  overrideInputMulti: {
    height: 66,
    paddingTop: 10,
  },
  datePickerOverride: {
    height: 40,
    borderWidth: 1,
    borderRadius: radius.sm,
    marginBottom: 10,
  },
  selectBtn: {
    height: 40,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectBtnTxt: {
    fontSize: 13,
    color: colors.textDark,
    flex: 1,
  },
  selectBtnPlaceholder: {
    color: colors.textLight,
  },

  // ─ Contato registrado
  contatoSection: {
    paddingBottom: 10,
  },
  contatoRegItem: {
    marginBottom: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: 10,
  },
  contatoRegInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 8,
  },
  contatoRegValor: {
    fontSize: 13,
    color: colors.textDark,
    ...font.medium,
    flex: 1,
  },
  contatoRegItemInsta: {
    borderColor: 'rgba(219,39,119,0.25)',
    backgroundColor: '#fff0f6',
  },
  btnOcultarInsta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 'auto',
  },
  btnOcultarInstaTxt: {
    fontSize: 10,
    color: colors.primary,
    ...font.medium,
  },
  tagCadastrado: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  tagCadastradoTxt: {
    fontSize: 9,
    color: '#fff',
    ...font.bold,
  },

  // ─ Contato extra
  contatoExtraItem: {
    marginBottom: 8,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
  },
  contatoExtraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contatoExtraTipos: {
    flexDirection: 'row',
    gap: 6,
  },
  tipoChipExtra: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipoChipExtraAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tipoChipExtraBloqueado: {
    opacity: 0.3,
  },
  btnRemoverExtra: {
    padding: 6,
  },
  btnAdicionarContato: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  btnAdicionarContatoTxt: {
    fontSize: 13,
    color: colors.primary,
    ...font.bold,
  },
  limiteContatosTxt: {
    fontSize: 12,
    color: colors.textLight,
    ...font.medium,
    paddingVertical: 10,
  },

  // ─ Rodapé
  rodape: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btnGerar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 15,
  },
  btnGerarOff: {
    opacity: 0.65,
  },
  btnGerarTexto: {
    color: '#fff',
    ...font.bold,
    fontSize: 15,
  },
});
