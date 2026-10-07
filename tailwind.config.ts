import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        verda: {
          bg: '#F7F5F0',
          bgWarm: '#F3EFE8',
          card: '#FFFFFF',
          border: '#E5E0D8',
          spruce: '#13392E',
          spruceHover: '#1a473a',
          spruceDark: '#0D271F',
          lime: '#70B22C',
          limeBright: '#84CC16',
          mint: '#E8F3EB',
          mintBorder: '#CFE6D5',
          charcoal: '#15211B',
          muted: '#4B5548',
          sand: '#EDE8DF',
          sandBorder: '#D8D1C3',
        },
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#13392E',
          950: '#0b231c',
        },
      },
      boxShadow: {
        'verda-card': '0 8px 30px rgba(19, 57, 46, 0.06)',
        'verda-hover': '0 16px 40px rgba(19, 57, 46, 0.12)',
        'verda-pill': '0 4px 16px rgba(19, 57, 46, 0.15)',
        'verda-glow': '0 0 25px rgba(112, 178, 44, 0.25)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'soundwave': 'soundwave 1.2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scan-beam': 'scanBeam 2.5s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.03)' },
        },
        soundwave: {
          '0%': { height: '6px' },
          '100%': { height: '24px' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanBeam: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '92%' },
        },
      }
    },
  },
  plugins: [],
};
export default config;
