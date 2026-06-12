import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

export default function EspecieIcon({ especie, size = 32, color }) {
  const cor = color ?? colors.primary;
  if (especie === 'cachorro') return <MaterialCommunityIcons name="dog" size={size} color={cor} />;
  if (especie === 'gato') return <MaterialCommunityIcons name="cat" size={size} color={cor} />;
  return <Ionicons name="paw-outline" size={size} color={cor} />;
}
