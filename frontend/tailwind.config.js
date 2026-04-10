/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f4f3f0',
          100: '#e8e6e0',
          200: '#d1cec4',
          300: '#b5b0a3',
          400: '#948e80',
          500: '#7a7466',
          600: '#635d51',
          700: '#504b41',
          800: '#3d3932',
          900: '#2a2722',
          950: '#1a1814',
        },
        accent: {
          50: '#fef3ee',
          100: '#fde4d4',
          200: '#fac5a8',
          300: '#f79d71',
          400: '#f36c37',
          500: '#f04e16',
          600: '#e1360c',
          700: '#bb270c',
          800: '#952212',
          900: '#781f13',
        },
        sage: {
          50: '#f2f7f2',
          100: '#e0ece0',
          200: '#c2d9c2',
          300: '#98be98',
          400: '#699d69',
          500: '#4a7f4a',
          600: '#39663a',
          700: '#2e5130',
          800: '#264127',
          900: '#1f3521',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'check': 'check 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        check: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}