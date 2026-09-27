/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tropical: {
          sky: '#e0f2fe',
          sun: '#fef08a',
          emerald: '#10b981',
          lime: '#84cc16',
          leaf: '#059669',
          wood: '#854d0e',
          woodDark: '#713f12',
          bark: '#92400e',
        },
        cosmic: {
          void: '#030712',
          deep: '#0b0f19',
          card: '#111827',
          neonBlue: '#38bdf8',
          neonPurple: '#c084fc',
          neonTeal: '#2dd4bf',
          neonPink: '#f472b6',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        '3d-amber': '0 4px 0 0 #b45309',
        '3d-emerald': '0 4px 0 0 #047857',
        '3d-blue': '0 4px 0 0 #1d4ed8',
        '3d-purple': '0 4px 0 0 #7e22ce',
        '3d-rose': '0 4px 0 0 #be123c',
        'neon-glow': '0 0 20px -2px rgba(56, 189, 248, 0.45)',
        'neon-purple': '0 0 20px -2px rgba(192, 132, 252, 0.45)',
        'glass-day': '0 12px 32px 0 rgba(16, 185, 129, 0.12)',
        'glass-night': '0 12px 32px 0 rgba(0, 0, 0, 0.55)',
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'twinkle-slow': 'twinkle 3s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        }
      }
    },
  },
  plugins: [],
}
