import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius } from '../../constants/theme';

export default function SelectModal({
  visible,
  title,
  data,
  value,
  onSelect,
  onClose,
  renderItem,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.header}>
          <Text style={s.titulo}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.textMid} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          keyExtractor={item => String(item)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const selected = item === value;
            if (renderItem) return renderItem(item, selected);
            return (
              <TouchableOpacity
                style={[s.item, selected && s.itemAtivo]}
                onPress={() => onSelect(item)}
                activeOpacity={0.7}
              >
                <Text style={[s.itemTexto, selected && s.itemTextoAtivo]}>{item}</Text>
                {selected && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '70%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titulo: {
    fontSize: 16,
    ...font.black,
    color: colors.textDark,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemAtivo: {
    backgroundColor: colors.primaryLight,
  },
  itemTexto: {
    fontSize: 14,
    color: colors.textDark,
  },
  itemTextoAtivo: {
    color: colors.primary,
    ...font.bold,
  },
});
