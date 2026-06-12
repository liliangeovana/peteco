import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, font, radius } from '../../constants/theme';

export default function EmptyState({
  icon,
  iconLib = 'Ionicons',
  iconSize = 48,
  iconColor,
  title,
  subtitle,
  action,
  actionLabel,
}) {
  const cor = iconColor ?? colors.textLight;
  const IconComponent = iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;

  return (
    <View style={s.container}>
      <IconComponent name={icon} size={iconSize} color={cor} style={s.icon} />
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
      {action && actionLabel ? (
        <TouchableOpacity style={s.btn} onPress={action} activeOpacity={0.85}>
          <Text style={s.btnTexto}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 12,
  },
  icon: {
    marginBottom: 0,
  },
  title: {
    fontSize: 16,
    ...font.bold,
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMid,
    textAlign: 'center',
    maxWidth: 240,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  btnTexto: {
    color: '#fff',
    ...font.bold,
    fontSize: 14,
  },
});
