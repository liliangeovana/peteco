import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius } from '../../constants/theme';

export default function ChipToggle({ items, value, onPress, style }) {
  return (
    <View style={[s.row, style]}>
      {items.map(item => {
        const ativo = item.valor === value;
        const cor = ativo ? '#fff' : colors.textMid;
        return (
          <TouchableOpacity
            key={String(item.valor)}
            style={[s.chip, ativo && s.chipAtivo]}
            onPress={() => onPress(item.valor)}
            activeOpacity={0.8}
          >
            {item.icon ? <Ionicons name={item.icon} size={16} color={cor} /> : null}
            <Text style={[s.label, ativo && s.labelAtivo]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
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
  chipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: 12,
    color: colors.textMid,
    ...font.medium,
  },
  labelAtivo: {
    color: '#fff',
    ...font.bold,
  },
});
