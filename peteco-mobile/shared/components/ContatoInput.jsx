import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius } from '../../constants/theme';
import { useMascaraTelefone } from '../hooks/useMascaraTelefone';
import { useNormalizarInstagram } from '../hooks/useNormalizarInstagram';

const TIPOS = [
  { tipo: 'whatsapp',  label: 'WhatsApp', icon: 'logo-whatsapp' },
  { tipo: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
  { tipo: 'outro',     label: 'Outro',     icon: 'ellipsis-horizontal' },
];

export default function ContatoInput({ contato, idx, onTipoChange, onValorChange, onRemove }) {
  const { mascaraTelefone }     = useMascaraTelefone();
  const { normalizarInstagram } = useNormalizarInstagram();

  function handleValorChange(v) {
    const transformado =
      contato.tipo === 'whatsapp'  ? mascaraTelefone(v) :
      contato.tipo === 'instagram' ? normalizarInstagram(v) :
      v;
    onValorChange(idx, transformado);
  }

  return (
    <View style={s.row}>
      <View style={s.tipos}>
        {TIPOS.map(({ tipo, label, icon }) => {
          const ativo = contato.tipo === tipo;
          return (
            <TouchableOpacity
              key={tipo}
              style={[s.tipoChip, ativo && s.tipoChipAtivo]}
              onPress={() => onTipoChange(idx, tipo)}
            >
              <Ionicons name={icon} size={14} color={ativo ? '#fff' : colors.textMid} />
              <Text style={[s.tipoTexto, ativo && s.tipoTextoAtivo]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={s.inputRow}>
        <TextInput
          style={[s.input, { flex: 1 }]}
          value={contato.valor}
          onChangeText={handleValorChange}
          placeholder={
            contato.tipo === 'whatsapp'  ? 'Ex: 95 99999-9999' :
            contato.tipo === 'instagram' ? 'Ex: @perfil ou link do Instagram' :
            'Descreva o contato'
          }
          placeholderTextColor={colors.textLight}
          keyboardType={contato.tipo === 'whatsapp' ? 'phone-pad' : 'default'}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => onRemove(idx)} style={s.remover}>
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 4,
  },
  tipos: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tipoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.background,
  },
  tipoChipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tipoTexto: {
    fontSize: 11,
    color: colors.textMid,
    ...font.medium,
  },
  tipoTextoAtivo: {
    color: '#fff',
    ...font.bold,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
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
  remover: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
