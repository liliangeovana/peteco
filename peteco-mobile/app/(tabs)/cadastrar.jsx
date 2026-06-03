import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Image,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, font, shadow } from '../../constants/theme';
import useCadastrarController from '../../modules/pet/controller/useCadastrarController';

const ESPECIES = ['cachorro', 'gato', 'outro'];

export default function CadastrarPet() {
  const router = useRouter();
  const {
    form, set, foto, coords,
    buscandoCep, buscandoGps, enviando, validandoFoto, fotoValidada,
    selecionarFoto, obterGps, handleCep, enviar,
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
        {validandoFoto ? (
          <View style={s.fotoPlaceholder}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={[s.fotoTexto, { marginTop: 8 }]}>Validando com IA...</Text>
          </View>
        ) : foto ? (
          <View>
            <Image source={{ uri: foto }} style={s.fotoPreview} />
            {fotoValidada && (
              <View style={s.fotoValidadaBadge}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={s.fotoValidadaTexto}>Validado pela IA</Text>
              </View>
            )}
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
                  onPress={() => set('especie', e)}
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

        {[
          { campo: 'raca', label: 'Raça', placeholder: 'Ex: Vira-lata' },
          { campo: 'cor',  label: 'Cor',  placeholder: 'Ex: Caramelo e branco' },
        ].map(({ campo, label, placeholder }) => (
          <View key={campo} style={s.campo}>
            <Text style={s.label}>{label}</Text>
            <TextInput
              style={s.input}
              value={form[campo]}
              onChangeText={v => set(campo, v)}
              placeholder={placeholder}
              placeholderTextColor={colors.textLight}
            />
          </View>
        ))}

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
            onChangeText={v => set('data_perda', v)}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      {/* Localização */}
      <View style={s.secao}>
        <Text style={s.secaoTitulo}>Localização</Text>

        <View style={s.campo}>
          <Text style={s.label}>CEP</Text>
          <View style={s.linha}>
            <TextInput
              style={[s.input, { flex: 1 }]}
              value={form.cep}
              onChangeText={handleCep}
              placeholder="00000-000"
              placeholderTextColor={colors.textLight}
              keyboardType="numeric"
              maxLength={9}
            />
            {buscandoCep && <ActivityIndicator color={colors.primary} style={{ marginLeft: 10 }} />}
          </View>
        </View>

        {form.bairro ? (
          <View style={s.enderecoResultado}>
            <Ionicons name="location-outline" size={22} color={colors.primary} />
            <View>
              <Text style={s.enderecoTexto}>{form.bairro}</Text>
              <Text style={s.enderecoSub}>{form.cidade}</Text>
            </View>
          </View>
        ) : null}

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
                  {coords ? 'GPS capturado — tocar para atualizar' : 'Capturar GPS automaticamente'}
                </Text>
              </>
          }
        </TouchableOpacity>
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
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
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
  enderecoResultado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: 12,
  },
  enderecoTexto: {
    fontSize: 14,
    color: colors.textDark,
    ...font.bold,
  },
  enderecoSub: {
    fontSize: 12,
    color: colors.primary,
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
});
