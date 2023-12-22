/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        // 'primary-gradient': 'linear-gradient(to right top, #f37435, #fdc830)',
        // 'primary-gradient':
        //   'linear-gradient( 109.6deg,  rgba(103,30,117,1) 11.2%, rgba(252,76,2,1) 91.1% )',
        // 'primary-gradient': 'linear-gradient(to right top, #fe8c00, #f83600)',
        'primary-gradient': 'linear-gradient(to right top, #fe8c00, #f59f00)',
      },
      colors: {
        // primary: '#ea580c',
        primary: '#f59f00',
        secondary: '#f97316',
        light: '#f5f5f4',
        dark: '#1c1917',
        accent: '#431407',
        'bg-dark': 'hsla(215, 25%, 27%, 0.2)',
      },
      container: {
        center: true,
        padding: '2rem',
      },
      fontFamily: {
        display: 'Galindo, sans-serif',
      },
      gridTemplateColumns: {
        layout: 'minmax(1rem, 1fr) minmax(0,75rem) minmax(1rem, 1fr)',
      },
    },
  },
  plugins: [require('tailwindcss-debug-screens')],
}
