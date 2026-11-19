/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Nocturnal Spruce Dark Green (Matched directly to User Palette Reference #092421 & #27403C)
        darkgreen: {
          50: '#E9F6F4',
          100: '#C1E6E1',
          200: '#87C6BD',
          300: '#5EA299',
          400: '#428078',
          500: '#2F665F',
          600: '#27403C', // Middle muted band from uploaded image
          700: '#1B4A45',
          800: '#123632',
          900: '#092421', // Primary top band from uploaded image
          950: '#051412',
          DEFAULT: '#092421',
        },
        forest: {
          50: '#E9F6F4',
          100: '#C1E6E1',
          200: '#87C6BD',
          300: '#5EA299',
          400: '#428078',
          500: '#2F665F',
          600: '#27403C',
          700: '#1B4A45',
          800: '#123632',
          900: '#092421',
          950: '#051412',
          DEFAULT: '#092421',
        },

        // 2. Luminous Pista / Mint (Exact Accent Stripe #74D7CB & Pista Spectrum)
        pista: {
          50: '#F0FAF8',
          100: '#DEF5F1',
          200: '#BDECE4',
          300: '#98E0D5',
          400: '#74D7CB', // Luminous mint-pista stripe from uploaded image
          500: '#51C4B5',
          600: '#39A597',
          700: '#2B8075',
          800: '#1F5E56',
          900: '#16433D',
          DEFAULT: '#74D7CB',
        },

        // 3. Sage Green (Soft Eucalyptus / Natural Herbal Environmental Shade)
        sage: {
          50: '#F4F7F4',
          100: '#E5EDE5',
          200: '#CCDCCC',
          300: '#AFC5AF',
          400: '#8FA88F',
          500: '#6E8A6E',
          600: '#556E55',
          700: '#405440',
          800: '#2E3D2E',
          900: '#1F291F',
          DEFAULT: '#6E8A6E',
        },

        // 4. Skin-Beige (Warm Natural Skin-Beige Body Canvas)
        beige: {
          50: '#FAF5EF',
          100: '#F7EFE6', // Soft warm skin-beige
          200: '#EFE3D5',
          300: '#E4D2BF',
          400: '#D3BCA6',
          500: '#BFA289',
          600: '#A1846C',
          700: '#7F6652',
          800: '#5B4738',
          900: '#382A20',
          DEFAULT: '#F7EFE6',
        },
        offwhite: {
          50: '#FAF5EF',
          100: '#F7EFE6',
          200: '#EFE3D5',
          300: '#E4D2BF',
          400: '#D3BCA6',
          DEFAULT: '#F7EFE6',
        },

        // Botanical Green Accent
        botanical: {
          50: '#F0F9F5',
          100: '#DAF0E5',
          200: '#B5E1CB',
          300: '#83CCAA',
          400: '#52B487',
          500: '#2F9668',
          600: '#237853',
          700: '#1D6043',
          800: '#184C36',
          900: '#133E2C',
          DEFAULT: '#2F9668',
        },

        // Earthy Charcoal / Deep Espresso Typography
        charcoal: {
          50: '#F6F8F7',
          100: '#EDF1F0',
          200: '#DCE3E1',
          300: '#C5D0CD',
          400: '#94A39F',
          500: '#687773',
          600: '#4F5C58',
          700: '#384340',
          800: '#242D2B',
          900: '#131A19',
          DEFAULT: '#242D2B',
        },

        // Refined Pista / Mint Accent mapping for limeaccent
        limeaccent: {
          50: '#F0FAF8',
          100: '#DEF5F1',
          200: '#BDECE4',
          300: '#98E0D5',
          400: '#74D7CB', // Mapped to #74D7CB
          500: '#51C4B5',
          600: '#39A597',
          700: '#2B8075',
          800: '#1F5E56',
          900: '#16433D',
          DEFAULT: '#74D7CB',
        },
        paper: '#FAF8F3',
        brand: {
          dark: '#10241B',
          deep: '#1B4332',
          light: '#2D6A4F',
          pista: '#74D7CB',
          emerald: '#34D399',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Fraunces', 'Source Serif 4', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'soft-xs': '0 1px 2px rgba(24, 61, 43, 0.04)',
        'soft-sm': '0 1px 3px rgba(24, 61, 43, 0.06)',
        'soft': '0 2px 6px rgba(24, 61, 43, 0.06)',
        'soft-md': '0 4px 12px rgba(24, 61, 43, 0.08)',
        'soft-lg': '0 8px 20px rgba(24, 61, 43, 0.10)',
        'soft-xl': '0 10px 24px rgba(24, 61, 43, 0.12)',
        'glow-lime': '0 2px 6px rgba(24, 61, 43, 0.06)',
        'glow-forest': '0 2px 6px rgba(24, 61, 43, 0.06)',
        'glow-crimson': '0 2px 6px rgba(24, 61, 43, 0.06)',
        'glass': '0 2px 6px rgba(24, 61, 43, 0.06)',
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
