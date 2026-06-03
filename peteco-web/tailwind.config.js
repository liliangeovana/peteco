/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      colors: {
        // Espelho exato do theme.js do mobile
        peteco: {
          bg:           '#F7F5FB',
          card:         '#FFFFFF',
          primary:      '#7C3AED',
          primaryDark:  '#5B21B6',
          primaryLight: '#EDE9FE',
          textDark:     '#1A1626',
          textMid:      '#6B6578',
          textLight:    '#A099B0',
          border:       '#E5E0F0',
          success:      '#2EBD7A',
          successLight: '#E6F9F0',
          danger:       '#E63946',
          dangerLight:  '#FDECEA',
        },
        // alias 'brand' → roxo para manter classes existentes
        brand: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(59,31,110,0.07)',
      },
      borderRadius: {
        xl:  '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
    },
  },
  plugins: [],
}
