/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF2ED',
          100: '#FFE5DB',
          200: '#FFD0B8',
          300: '#FFAF84',
          400: '#FF8D50',
          500: '#FF6B35', // Primary orange
          600: '#F04F14',
          700: '#D33A04',
          800: '#AA2F03',
          900: '#882403',
        },
        secondary: {
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#009FB7', // Complementary teal
          600: '#00838F',
          700: '#006064',
          800: '#004D51',
          900: '#003F43',
        },
        accent: {
          50: '#F3FAE7',
          100: '#E8F5CF',
          200: '#D4EB9F',
          300: '#BBE070',
          400: '#A3D64C',
          500: '#7CB518', // Accent green
          600: '#689E14',
          700: '#55830E',
          800: '#43690B',
          900: '#345207',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#F59E0B',
        },
        error: {
          500: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};