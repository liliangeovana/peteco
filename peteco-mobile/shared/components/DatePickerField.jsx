import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, font } from '../../constants/theme';

function formatarData(date) {
  if (!date) return null;
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function DatePickerField({ value, onChange, placeholder = 'Selecionar data', style }) {
  const [aberto, setAberto] = useState(false);
  const [temp, setTemp]     = useState(value || new Date());

  const abrir = () => {
    setTemp(value || new Date());
    setAberto(true);
  };

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setAberto(false);
      if (event.type !== 'dismissed' && selectedDate) onChange(selectedDate);
    } else {
      if (selectedDate) setTemp(selectedDate);
    }
  };

  const confirmar = () => {
    setAberto(false);
    onChange(temp);
  };

  return (
    <>
      <TouchableOpacity style={[s.btn, style]} onPress={abrir} activeOpacity={0.8}>
        <Text style={value ? s.texto : s.placeholder}>
          {value ? formatarData(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={18} color={colors.textLight} />
      </TouchableOpacity>

      {/* Android: picker nativo direto */}
      {Platform.OS === 'android' && aberto && (
        <DateTimePicker
          value={temp}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date()}
          locale="pt-BR"
        />
      )}

      {/* iOS: spinner dentro de modal */}
      {Platform.OS === 'ios' && (
        <Modal visible={aberto} transparent animationType="slide" onRequestClose={() => setAberto(false)}>
          <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setAberto(false)} />
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <TouchableOpacity onPress={() => setAberto(false)}>
                <Text style={s.acao}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={s.sheetTitulo}>Selecionar data</Text>
              <TouchableOpacity onPress={confirmar}>
                <Text style={[s.acao, { color: colors.primary, ...font.bold }]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={temp}
              mode="date"
              display="spinner"
              onChange={handleChange}
              maximumDate={new Date()}
              locale="pt-BR"
              style={{ backgroundColor: '#fff' }}
            />
          </View>
        </Modal>
      )}
    </>
  );
}

const s = StyleSheet.create({
  btn: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 46,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  texto:       { fontSize: 14, color: colors.textDark },
  placeholder: { fontSize: 14, color: colors.textLight },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitulo: {
    fontSize: 15,
    ...font.black,
    color: colors.textDark,
  },
  acao: {
    fontSize: 14,
    color: colors.textMid,
  },
});
