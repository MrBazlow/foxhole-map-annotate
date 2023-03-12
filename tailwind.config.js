/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './views/**/*.{html,js,njk}',
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    './frontend/components/**/*.jsx'],
  theme: {
    extend: {
      colors: {
        warden: {
          50: '#f3f7fc',
          100: '#e6eff8',
          200: '#c8deef',
          300: '#97c1e2',
          400: '#60a1d0',
          500: '#3b85bc',
          600: '#2b6a9e',
          700: '#245682',
          800: '#21496b',
          900: '#203e5a',
        },
        colonial: {
          50: '#f3f7ee',
          100: '#e2ead7',
          200: '#cddbbb',
          300: '#adc492',
          400: '#8fac6f',
          500: '#729151',
          600: '#58723e',
          700: '#445932',
          800: '#39482c',
          900: '#323f28',
        },
      },
      keyframes: {
        indeterminate: {
          from: {
            left: '-50%',
          },
          to: {
            left: '100%',
          },
        },
        tickTock: {
          '0%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(0deg)',
          },
          '8.3333%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(30deg)',
          },
          '16.6666%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(60deg)',
          },
          '25%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(90deg)',
          },
          '33.3333%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(120deg)',
          },
          '41.6666%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(150deg)',
          },
          '50%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(180deg)',
          },
          '58.3333%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(210deg)',
          },
          '66.6666%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(240deg)',
          },
          '75%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(270deg)',
          },
          '83.3333%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(300deg)',
          },
          '91.6666%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(330deg)',
          },
          '100%': {
            'animation-timing-function': 'cubic-bezier(.5, -0.5, 0.5, 1.5)',
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        load: 'indeterminate 2s linear infinite',
        clock: 'tickTock 12s linear infinite',
      },
    },
  },
  plugins: [
    require('@headlessui/tailwindcss'),
  ],
};
