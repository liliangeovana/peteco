export function useAvatarEmoji() {
  function avatarEmoji(especie) {
    return especie === 'cachorro' ? '🐕' : especie === 'gato' ? '🐈' : '🐾'
  }
  return { avatarEmoji }
}
