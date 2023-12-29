/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right top, #fe8c00, #f59f00)',
        'main-bg': "url('/images/sun-tornado.svg')",
      },
      colors: {
        primary: 'hsl(15,86%,53%)',
        'primary-light': 'hsl(38,86%,53%)',
        // primary: '#f59f00',
        // secondary: '#f97316',
        secondary: 'hsl(162,86%,53%)',
        accent: 'hsl(162,75%,37%)',
        tertiary: 'hsl(38,75%,37%)',
        light: '#f5f5f4',
        dark: '#1c1917',
        'bg-dark': 'hsla(15, 86%, 53%, 0.5)',
        // 'bg-dark': 'hsla(15, 76%, 42%, 0.5)',
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
