/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        canvas: {
          DEFAULT: '#0A0D10',
          elevated: '#11161C',
          card: '#161D24',
          subtle: '#1C252E',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F4EFEA',
          200: '#EAE2D8',
          300: '#DCD1C2',
          400: '#B8AB98',
          500: '#948773',
          600: '#6E6250',
          800: '#2E271D',
          900: '#18140E',
        },
        champagne: {
          light: '#F5E7C8',
          DEFAULT: '#D4AF37',
          dark: '#B08D26',
        },
        azure: {
          light: '#BAE6FD',
          DEFAULT: '#38BDF8',
          dark: '#0284C7',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.5)',
        'glow-gold': '0 0 35px -5px rgba(212, 175, 55, 0.25)',
        'glow-azure': '0 0 35px -5px rgba(56, 189, 248, 0.25)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        pulseSubtle: 'pulseSubtle 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
