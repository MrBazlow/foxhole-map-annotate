/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./views/*.{html,js,njk}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        'warden': {
          '50': '#f3f7fc',
          '100': '#e6eff8',
          '200': '#c8deef',
          '300': '#97c1e2',
          '400': '#60a1d0',
          '500': '#3b85bc',
          '600': '#2b6a9e',
          '700': '#245682',
          '800': '#21496b',
          '900': '#203e5a',
        },
        'colonial': {
          '50': '#f3f7ee',
          '100': '#e2ead7',
          '200': '#cddbbb',
          '300': '#adc492',
          '400': '#8fac6f',
          '500': '#729151',
          '600': '#58723e',
          '700': '#445932',
          '800': '#39482c',
          '900': '#323f28',
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
