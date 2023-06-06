const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./{src,mdx}/**/*.{js,mjs,jsx,mdx}'],
  darkMode: 'class',
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
      },
      fontSize: {
        '2xs': '.6875rem',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Mona Sans', ...defaultTheme.fontFamily.sans],
      },
      opacity: {
        2.5: '0.025',
        7.5: '0.075',
        15: '0.15',
      },
    }
  },
  variants: {
    margin: ['responsive', 'hover', 'focus', 'group-hover'],
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}