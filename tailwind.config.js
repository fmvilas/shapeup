const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'opacity-50',
    'rounded',
    'py-0.5'
  ],
  theme: {
    stroke: theme => ({
      'white': theme('colors.white'),
      'gray-200': theme('colors.gray.200')
    }),
    fill: theme => ({
      'gray-300': theme('colors.gray.300'),
      'gray-500': theme('colors.gray.500')
    }),
    extend: {
      colors: {
        cyan: colors.cyan,
      },
      height: {
        100: '25rem'
      }
    }
  },
  variants: {
    margin: ['responsive', 'hover', 'focus', 'group-hover'],
  },
}