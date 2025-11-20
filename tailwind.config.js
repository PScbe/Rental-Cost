/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FACC15', // Yellow-400
        dark: '#000000',
        'dark-light': '#1f2937', // Gray-800
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'pop-in': 'popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        slideDown: {
          'from': { opacity: '0', transform: 'translateY(-10px)', maxHeight: '0' },
          'to': { opacity: '1', transform: 'translateY(0)', maxHeight: '500px' },
        },
        popIn: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '70%': { transform: 'scale(1.2) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px #FACC15' },
          '50%': { boxShadow: '0 0 20px #FACC15' },
        }
      }
    },
  },
  plugins: [],
}
