import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Image,
  KeyboardAvoidingView, Platform, Modal, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, font, shadow } from '../../constants/theme';
import { BAIRROS_BOA_VISTA, OPCAO_OUTRO } from '../../constants/bairros';
import { RACAS } from '../../constants/racas';
import useCadastrarController from '../../modules/pet/controller/useCadastrarController';

const ESPECIES = ['cachorro', 'gato', 'outro'];
const OPCOES_BAIRRO = [...BAIRROS_BOA_VISTA.map(b => b.nome), OPCAO_OUTRO];

export default function CadastrarPet() {
  const router = useRouter();
  const [modalBairro, setModalBairro] = useState(false);
  const [modalRaca, setModalRaca]     = useState(false);

  const {
    form, set, foto, coords,
    bairroSelecionado, bairroOutro, setBairroSelecionado, setBairroOutro,
    racaSelecionada, selecionarRaca, selecionarEspecie,
    buscandoGps, enviando, validandoFoto, fotoValidada,
    selecionarFoto, obterGps, handleDataPerda, enviar,
  } = useCadastrarController(() => router.replace('/(tabs)/feed'));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.titulo}>Cadastrar pet perdido</Text>
      <Text style={s.sub}>Preencha as informações para ajudar a encontrá-lo</Text>

      {/* Foto */}
      <TouchableOpacity style={s.fotoBtn} onPress={selecionarFoto} activeOpacity={0.8} disabled={validandoFoto}>
        {foto ? (
          <View>
            <Image source={{ uri: foto }} style={s.fotoPreview} />
            {validandoFoto && (
              <View style={s.fotoLoadingOverlay}>
                <ActivityIndicator color="#fff" size="large" />
                <Text style={s.fotoLoadingTexto}>Analisando com IA...</Text>
              </View>
            )}
            {!validandoFoto && fotoValidada && (
              <View style={s.fotoValidadaBadge}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={s.fotoValidadaTexto}>Validado pela IA</Text>
              </View>
            )}
          </View>
        ) : validandoFoto ? (
          <View style={s.fotoPlaceholder}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={[s.fotoTexto, { marginTop: 8 }]}>Analisando com IA...</Text>
          </View>
        ) : (
          <View style={s.fotoPlaceholder}>
            <Ionicons name="camera-outline" size={36} color={colors.primary} />
            <Text style={s.fotoTexto}>Adicionar foto</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Informações básicas */}
      <View style={s.secao}>
        <Text style={s.secaoTitulo}>Informações básicas</Text>

        <View style={s.campo}>
          <Text style={s.label}>Nome do pet *</Text>
          <TextInput
            style={s.input}
            value={form.nome}
            onChangeText={v => set('nome', v)}
            placeholder="Ex: Rex"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={s.campo}>
          <Text style={s.label}>Espécie *</Text>
          <View style={s.especieRow}>
            {ESPECIES.map(e => {
              const ativo = form.especie === e;
              const cor = ativo ? '#fff' : colors.textMid;
              return (
                <TouchableOpacity
                  key={e}
                  style={[s.especieChip, ativo && s.especieChipAtivo]}
                  onPress={() => selecionarEspecie(e)}
                >
                  {e === 'cachorro' ? <MaterialCommunityIcons name="dog" size={16} color={cor} />
                  : e === 'gato'    ? <MaterialCommunityIcons name="cat" size={16} color={cor} />
                  :                   <Ionicons name="paw-outline" size={16} color={cor} />}
                  <Text style={[s.especieLabel, ativo && s.especieLabelAtivo]}>{e}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={s.campo}>
          <Text style={s.label}>Raça</Text>
          <TouchableOpacity
            style={[s.input, s.selectBtn]}
            onPress={() => setModalRaca(true)}
            activeOpacity={0.8}
          >
            <Text style={racaSelecionada ? s.selectTexto : s.selectPlaceholder}>
              {racaSelecionada || 'Selecione a raça'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={s.campo}>
          <Text style={s.label}>Cor</Text>
          <TextInput
            style={s.input}
            value={form.cor}
            onChangeText={v => set('cor', v)}
            placeholder="Ex: Caramelo e branco"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={s.campo}>
          <Text style={s.label}>Descrição</Text>
          <TextInput
            style={[s.input, s.inputArea]}
            value={form.descricao}
            onChangeText={v => set('descricao', v)}
            placeholder="Detalhes que ajudem a identificar o pet..."
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={s.campo}>
          <Text style={s.label}>Data de perda</Text>
          <TextInput
            style={s.input}
            value={form.data_perda}
            onChangeText={handleDataPerda}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={colors.textLight}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>

      {/* Localização */}
      <View style={s.secao}>
        <Text style={s.secaoTitulo}>Localização</Text>

        {/* Select de bairro */}
        <View style={s.campo}>
          <Text style={s.label}>Bairro *</Text>
          <TouchableOpacity
            style={[s.input, s.selectBtn]}
            onPress={() => setModalBairro(true)}
            activeOpacity={0.8}
          >
            <Text style={bairroSelecionado ? s.selectTexto : s.selectPlaceholder}>
              {bairroSelecionado || 'Selecione o bairro'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Input livre quando "Outro" */}
        {bairroSelecionado === OPCAO_OUTRO && (
          <View style={s.campo}>
            <Text style={s.label}>Qual bairro?</Text>
            <TextInput
              style={s.input}
              value={bairroOutro}
              onChangeText={setBairroOutro}
              placeholder="Digite o nome do bairro"
              placeholderTextColor={colors.textLight}
            />
          </View>
        )}

        {/* Botão GPS */}
        <TouchableOpacity style={s.btnGps} onPress={obterGps} disabled={buscandoGps} activeOpacity={0.85}>
          {buscandoGps
            ? <ActivityIndicator color={colors.primary} />
            : <>
                <Ionicons
                  name={coords ? 'checkmark-circle-outline' : 'navigate-outline'}
                  size={20}
                  color={colors.primary}
                />
                <Text style={s.btnGpsTexto}>
                  {coords ? 'GPS capturado — tocar para atualizar' : 'Capturar localização por GPS'}
                </Text>
              </>
          }
        </TouchableOpacity>
        {coords && (
          <Text style={s.gpsHint}>
            Posição exata registrada — usada para o mapa
          </Text>
        )}
      </View>

      {/* Botão enviar */}
      <TouchableOpacity
        style={s.btnEnviar}
        onPress={enviar}
        disabled={enviando || validandoFoto}
        activeOpacity={0.85}
      >
        {enviando
          ? <ActivityIndicator color="#fff" />
          : <><Ionicons name="paw" size={18} color="#fff" /><Text style={s.btnEnviarTexto}>Cadastrar pet</Text></>
        }
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>

    {/* Modal select de bairros */}
    <Modal
      visible={modalBairro}
      transparent
      animationType="slide"
      onRequestClose={() => setModalBairro(false)}
    >
      <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setModalBairro(false)} />
      <View style={s.modalSheet}>
        <View style={s.modalHeader}>
          <Text style={s.modalTitulo}>Selecione o bairro</Text>
          <TouchableOpacity onPress={() => setModalBairro(false)}>
            <Ionicons name="close" size={22} color={colors.textMid} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={OPCOES_BAIRRO}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.modalItem, bairroSelecionado === item && s.modalItemAtivo]}
              onPress={() => {
                setBairroSelecionado(item);
                if (item !== OPCAO_OUTRO) setBairroOutro('');
                setModalBairro(false);
              }}
            >
              <Text style={[s.modalItemTexto, bairroSelecionado === item && s.modalItemTextoAtivo]}>
                {item}
              </Text>
              {bairroSelecionado === item && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>

    {/* Modal select de raça */}
    <Modal
      visible={modalRaca}
      transparent
      animationType="slide"
      onRequestClose={() => setModalRaca(false)}
    >
      <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setModalRaca(false)} />
      <View style={s.modalSheet}>
        <View style={s.modalHeader}>
          <Text style={s.modalTitulo}>Selecione a raça</Text>
          <TouchableOpacity onPress={() => setModalRaca(false)}>
            <Ionicons name="close" size={22} color={colors.textMid} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={RACAS[form.especie] ?? RACAS.outro}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.modalItem, racaSelecionada === item && s.modalItemAtivo]}
              onPress={() => {
                selecionarRaca(item);
                setModalRaca(false);
              }}
            >
              <Text style={[s.modalItemTexto, racaSelecionada === item && s.modalItemTextoAtivo]}>
                {item}
              </Text>
              {racaSelecionada === item && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    paddingTop: 56,
  },
  titulo: {
    fontSize: 24,
    ...font.black,
    color: colors.textDark,
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: colors.textMid,
    marginBottom: 24,
  },
  fotoBtn: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 24,
    ...shadow.card,
  },
  fotoPreview: {
    width: '100%',
    height: 200,
  },
  fotoPlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fotoTexto: {
    fontSize: 14,
    color: colors.primary,
    ...font.medium,
  },
  fotoLoadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  fotoLoadingTexto: {
    color: '#fff',
    fontSize: 13,
    ...font.bold,
  },
  fotoValidadaBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  fotoValidadaTexto: {
    fontSize: 11,
    color: colors.success,
    ...font.bold,
  },
  secao: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    ...shadow.card,
  },
  secaoTitulo: {
    fontSize: 15,
    ...font.black,
    color: colors.textDark,
    marginBottom: 4,
  },
  campo: {
    gap: 5,
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
    backgroundColor: colors.background,
  },
  inputArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectTexto: {
    fontSize: 14,
    color: colors.textDark,
  },
  selectPlaceholder: {
    fontSize: 14,
    color: colors.textLight,
  },
  especieRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  especieChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background,
  },
  especieChipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  especieLabel: {
    fontSize: 12,
    color: colors.textMid,
    ...font.medium,
  },
  especieLabelAtivo: {
    color: '#fff',
    ...font.bold,
  },
  btnGps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: 12,
    backgroundColor: colors.primaryLight,
  },
  btnGpsTexto: {
    fontSize: 13,
    color: colors.primary,
    ...font.medium,
    flex: 1,
  },
  gpsHint: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: -4,
  },
  btnEnviar: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  btnEnviarTexto: {
    color: '#fff',
    fontSize: 16,
    ...font.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '70%',
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitulo: {
    fontSize: 16,
    ...font.black,
    color: colors.textDark,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemAtivo: {
    backgroundColor: colors.primaryLight,
  },
  modalItemTexto: {
    fontSize: 14,
    color: colors.textDark,
  },
  modalItemTextoAtivo: {
    color: colors.primary,
    ...font.bold,
  },
});
