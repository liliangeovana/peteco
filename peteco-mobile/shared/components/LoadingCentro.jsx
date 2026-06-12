import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function LoadingCentro({ color, size = 'large' }) {
  return (
    <View style={s.container}>
      <ActivityIndicator size={size} color={color ?? colors.primary} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
