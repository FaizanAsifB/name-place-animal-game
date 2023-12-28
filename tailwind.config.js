/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef

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
        'main-bg': "url('images/sun-tornado.svg')",
      },
      colors: {
        primary: '#EE5522',
        'primary-light': '#EE5522',
        // primary: '#f59f00',
        // secondary: '#f97316',
        light: '#f5f5f4',
        dark: '#1c1917',
        accent: '#22bbee',
        secondary: '#55ee22',
        tertiary: '#bb22ee',
        'bg-dark': 'hsla(15, 86%, 53%, 0.5)',
      },
      container: {
        center: true,
        padding: '2rem',
      },
      fontFamily: {
        display: 'Galindo, sans-serif',
      },
      gridTemplateColumns: {
        layout: 'minmax(1rem, 1fr) minmax(0,110rem) minmax(1rem, 1fr)',
      },
    },
  },
  plugins: [require('tailwindcss-debug-screens')],
}
