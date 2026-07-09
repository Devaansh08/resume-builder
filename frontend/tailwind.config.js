/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        handwriting: ['Caveat', 'cursive'],
        schoolbook: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        // ─── Marginalia Notebook Palette ──────────────────────────────────────
        paper: {
          DEFAULT: '#F5F0E8',
          50: '#FDFCF8',
          100: '#FAF7F0',
          200: '#F5F0E8',
          300: '#EDE5D5',
          400: '#DDD4BF',
          500: '#C8BAA0',
          600: '#A89880',
          700: '#8A7A60',
          800: '#6A5E48',
          900: '#4A4130',
        },
        margin: {
          DEFAULT: '#C41E3A',
          50: '#FEF0F2',
          100: '#FDDDE2',
          200: '#FBBBC6',
          300: '#F7899A',
          400: '#F0506A',
          500: '#C41E3A',
          600: '#A01830',
          700: '#7E1225',
          800: '#5C0D1A',
          900: '#3A080F',
        },
        ink: {
          DEFAULT: '#1A1A3E',
          50: '#EEEEF6',
          100: '#D5D5EB',
          200: '#ABABD7',
          300: '#8181C3',
          400: '#5757AF',
          500: '#2D2D6E',
          600: '#1A1A3E',
          700: '#151532',
          800: '#0F0F25',
          900: '#090918',
        },
        rule: {
          DEFAULT: '#B8D4E8',
          light: '#D4E8F5',
          dark: '#8AB8D4',
        },
        // ─── Stationery Accent Colors ─────────────────────────────────────────
        marker: '#F9C846',     // Yellow marker
        mint: '#A8D5BA',       // Mint green
        eraser: '#F5C0C0',     // Eraser pink
        graphite: '#6B6B6B',   // Graphite dark
        // ─── Brand (remapped to Marginalia red for CTAs) ──────────────────────
        brand: {
          50: '#FEF0F2',
          100: '#FDDDE2',
          200: '#FBBBC6',
          300: '#F7899A',
          400: '#F0506A',
          500: '#C41E3A',
          600: '#A01830',
          700: '#7E1225',
          800: '#5C0D1A',
          900: '#3A080F',
          950: '#200509',
        },
        surface: {
          DEFAULT: '#1A1A3E',
          50: '#F5F0E8',
          100: '#EDE5D5',
          200: '#D4C8B0',
          300: '#B5A48A',
          400: '#8A7A60',
          500: '#5C5040',
          600: '#3A3028',
          700: '#2A2220',
          800: '#1E1818',
          900: '#141010',
          950: '#0A0808',
        },
      },
      backgroundImage: {
        'ruled-paper': `repeating-linear-gradient(
          transparent,
          transparent 27px,
          #B8D4E8 27px,
          #B8D4E8 28px
        )`,
        'ruled-paper-dark': `repeating-linear-gradient(
          transparent,
          transparent 27px,
          rgba(100, 130, 160, 0.3) 27px,
          rgba(100, 130, 160, 0.3) 28px
        )`,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(228,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.08) 0px, transparent 50%)',
        'paper-texture': 'radial-gradient(ellipse at top, #FAF7F0 0%, #F5F0E8 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-up': 'scaleUp 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(196, 30, 58, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(196, 30, 58, 0.4)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      boxShadow: {
        'glow-brand': '0 0 30px rgba(196, 30, 58, 0.25)',
        'glow-sm': '0 0 15px rgba(196, 30, 58, 0.15)',
        'card': '0 2px 12px rgba(26, 26, 62, 0.08), 0 1px 3px rgba(26, 26, 62, 0.04)',
        'card-hover': '0 8px 32px rgba(26, 26, 62, 0.16), 0 2px 8px rgba(26, 26, 62, 0.08)',
        'sticky': '2px 4px 12px rgba(26, 26, 62, 0.15)',
        'glass': '0 8px 32px rgba(26, 26, 62, 0.12)',
        'paper': '0 1px 3px rgba(26, 26, 62, 0.1), 0 4px 16px rgba(26, 26, 62, 0.06)',
        'inset-paper': 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
