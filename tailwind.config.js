/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    extend: {
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right top, #fe8c00, #f59f00)',
        'main-bg': "url('/images/sun-tornado.svg')",
      },
      boxShadow: {
        main: 'inset 0px 2px 0px 0px rgba(255,255,255,.15), 0px 3px 0px 0px rgba(255,255,255,0.15)',
      },
      border: {
        main: 'rgba(29,29,27,0.15)',
      },
      fontFamily: {
        test: ['Kanit'],
        pressStart2P: [
          'PressStart2P',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      gridTemplateColumns: {
        layout: 'minmax(1rem, 1fr) minmax(0,110rem) minmax(1rem, 1fr)',
      },
      container: {
        center: true,
        padding: { DEFAULT: '1rem', lg: '2rem' },
      },
      screens: {
        '2xl': '1400px',
      },
      colors: {
        dots: 'var(--_g)',
        'bg-primary': 'hsla(21, 90%, 48%, 0.5)',
        'primary-light': 'hsla(25, 95%, 53%, 0.7)',
        'primary-dark': 'hsla(21, 90%, 48%, 0.6)',
        'main-border': 'rgba(29,29,27,0.15)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        flash: {
          '0%': {
            opacity: 1,
          },
          '50%': {
            opacity: 1,
          },
          '100%': {
            opacity: 1,
          },
          '25%': {
            opacity: 0,
          },
          ' 75%': {
            opacity: 0,
          },
        },
        dots: {
          '0%': {
            'background-position':
              'calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%,    calc(2 * 100% / 3) 50%, calc(3 * 100% / 3) 50%',
          },
          '16.67%': {
            'background-position':
              'calc(0 * 100% / 3) 0, calc(1 * 100% / 3) 50%,     calc(2 * 100% / 3) 50%, calc(3 * 100% / 3) 50%',
          },
          '33.33%': {
            'background-position':
              'calc(0 * 100% / 3) 100%, calc(1 * 100% / 3) 0,      calc(2 * 100% / 3) 50%, calc(3 * 100% / 3) 50%',
          },
          '50%': {
            'background-position':
              'calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 100%, calc(2 * 100% / 3) 0, calc(3 * 100% / 3) 50%',
          },
          '66.67%': {
            'background-position':
              'calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%,      calc(2 * 100% / 3) 100%, calc(3 * 100% / 3) 0',
          },
          '83.33%': {
            'background-position':
              'calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%,      calc(2 * 100% / 3) 50%, calc(3 * 100% / 3) 100%',
          },
          '100%': {
            'background-position':
              'calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%,      calc(2 * 100% / 3) 50%, calc(3 * 100% / 3) 50%',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        flash: 'flash 2.5s infinite ease-in-out',
        dots: 'dots 1s infinite linear',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss-debug-screens'),
  ],
}
