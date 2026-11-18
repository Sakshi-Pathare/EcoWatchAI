/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Dark Green (Deep Heritage Pine / Nordic Forest)
        darkgreen: {
          50: '#F0F5F2',
          100: '#DDE9E2',
          200: '#BDD4C8',
          300: '#94BAA6',
          400: '#64997E',
          500: '#3D7A5C',
          600: '#2A6146',
          700: '#1F4E37',
          800: '#183D2B',
          900: '#122B1E',
          950: '#0A1C13',
          DEFAULT: '#183D2B',
        },
        forest: {
          50: '#F0F5F2',
          100: '#DDE9E2',
          200: '#BDD4C8',
          300: '#94BAA6',
          400: '#64997E',
          500: '#3D7A5C',
          600: '#2A6146',
          700: '#1F4E37',
          800: '#183D2B',
          900: '#122B1E',
          950: '#0A1C13',
          DEFAULT: '#183D2B',
        },

        // 2. Sage Green (Soft Eucalyptus / Herbal Mist)
        sage: {
          50: '#F5F7F5',
          100: '#E7ECE6',
          200: '#D1DDD0',
          300: '#B3C5B1',
          400: '#90A88E',
          500: '#718B6F',
          600: '#597057',
          700: '#455743',
          800: '#354334',
          900: '#273226',
          DEFAULT: '#718B6F',
        },

        // 3. Beige (Warm Sand / Natural Linen / Parchment)
        beige: {
          50: '#FAF8F5',
          100: '#F5F1EB',
          200: '#ECE5DA',
          300: '#DFD5C4',
          400: '#CEBFAB',
          500: '#BAA68F',
          600: '#9E8A74',
          700: '#7F6E5B',
          800: '#5E5244',
          900: '#3D352C',
          DEFAULT: '#F5F1EB',
        },
        offwhite: {
          50: '#FAF8F5',
          100: '#F5F1EB',
          200: '#ECE5DA',
          300: '#DFD5C4',
          400: '#CEBFAB',
          DEFAULT: '#F5F1EB',
        },

        // 4. Botanical Green (Lush Leaf / Living Emerald)
        botanical: {
          50: '#F1F8F4',
          100: '#DCEDE3',
          200: '#BDDFC9',
          300: '#91CBA7',
          400: '#5EAF80',
          500: '#389360',
          600: '#2B774C',
          700: '#235E3D',
          800: '#1B472E',
          900: '#143422',
          DEFAULT: '#2B774C',
        },

        // Earthy Charcoal / Deep Espresso Typography
        charcoal: {
          50: '#F8F9F8',
          100: '#F0F2F1',
          200: '#E0E4E1',
          300: '#C9D0CB',
          400: '#97A29A',
          500: '#68756C',
          600: '#4D5950',
          700: '#364039',
          800: '#232C26',
          900: '#141A16',
          DEFAULT: '#232C26',
        },

        // Refined Botanical Lime Accent
        limeaccent: {
          50: '#F7FBEB',
          100: '#EDF7CE',
          200: '#DBEF9D',
          300: '#C4E365',
          400: '#A9D334',
          500: '#8DB820',
          600: '#719416',
          700: '#567112',
          DEFAULT: '#719416',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft-xs': '0 1px 2px 0 rgba(24, 61, 43, 0.04)',
        'soft-sm': '0 2px 4px 0 rgba(24, 61, 43, 0.05)',
        'soft': '0 4px 16px -2px rgba(24, 61, 43, 0.06), 0 2px 6px -1px rgba(24, 61, 43, 0.03)',
        'soft-md': '0 10px 25px -4px rgba(24, 61, 43, 0.08), 0 4px 10px -2px rgba(24, 61, 43, 0.04)',
        'soft-lg': '0 20px 40px -8px rgba(24, 61, 43, 0.12), 0 8px 16px -4px rgba(24, 61, 43, 0.06)',
        'soft-xl': '0 25px 50px -12px rgba(24, 61, 43, 0.18)',
        'glow-lime': '0 0 25px -5px rgba(141, 184, 32, 0.35)',
        'glow-forest': '0 0 30px -5px rgba(24, 61, 43, 0.25)',
        'glow-crimson': '0 0 25px -5px rgba(225, 29, 72, 0.35)',
        'glass': '0 8px 32px 0 rgba(24, 61, 43, 0.06)',
      },
      animation: {
        'radar-ping': 'radarPing 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'laser-scan': 'laserScan 2.4s ease-in-out infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        radarPing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '70%': { transform: 'scale(2.2)', opacity: '0' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        laserScan: {
          '0%': { top: '0%' },
          '50%': { top: '95%' },
          '100%': { top: '0%' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
