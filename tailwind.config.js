/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      width: {
        'bar': '350px',
      },
      borderWidth: {
        1: '1px'
      }
    },
    colors: {
      'bulle': {
        300: '#60666E',
        500: '#5B636B',
        700: '#7F8792',
        900: '#ACB9C9',
      },
      'bullebg': {
        0: '#11121400',
        100: '#0D0E10',
        200: '#181B1E',
      }
    }
  },
  plugins: [],
  purge: ["./index.html", './src/**/*.{js,svelte,ts}']
}

