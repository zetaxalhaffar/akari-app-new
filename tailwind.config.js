/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx,jsx}',
    './components/**/*.{js,ts,tsx,jsx}',
    './screens/**/*.{js,ts,tsx,jsx}',
  ],
  safelist: [
    'rtl-view',
    'ltr-view',
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        pthin: ['Cairo-Thin', 'sans-serif'],
        pextralight: ['Cairo-ExtraLight', 'sans-serif'],
        plight: ['Cairo-Light', 'sans-serif'],
        pregular: ['Cairo-Regular', 'sans-serif'],
        pmedium: ['Cairo-Medium', 'sans-serif'],
        psemibold: ['Cairo-SemiBold', 'sans-serif'],
        pbold: ['Cairo-Bold', 'sans-serif'],
        pextrabold: ['Cairo-ExtraBold', 'sans-serif'],
        pblack: ['Cairo-Black', 'sans-serif'],
      },
      colors: {
        toast: {
          DEFAULT: '#a47764',
          50: '#f8f5f2',
          100: '#eae2db',
          200: '#d4c2b3',
          300: '#bda28c',
          400: '#ae8971',
          500: '#a47764',
          600: '#8d5e52',
          700: '#774b46',
          800: '#633e3d',
          900: '#523535',
          950: '#2d1b1b',
        },
      },
    },
  },
  plugins: [],
};
