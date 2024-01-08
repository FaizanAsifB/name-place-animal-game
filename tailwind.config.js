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
      // container: {
      //     center: true,
      //     padding: '2rem',
      //   },
      fontFamily: {
        display: 'Galindo, sans-serif',
      },
      gridTemplateColumns: {
        layout: 'minmax(1rem, 1fr) minmax(0,110rem) minmax(1rem, 1fr)',
      },
      container: {
        center: true,
        padding: '1rem',
      },
      screens: {
        '2xl': '1400px',
      },
      colors: {
        // primary: 'hsl(15,86%,53%)',
        // 'primary-light': 'hsl(38,86%,53%)',
        //  secondary: 'hsl(162,86%,53%)',
        // accent: 'hsl(162,75%,37%)',
        // tertiary: 'hsl(38,75%,37%)',
        // light: '#f5f5f4',
        // dark: '#1c1917',
        'bg-primary': 'hsla(21, 90%, 48%, 0.5)',
        'bg-primary-light': 'hsla(25, 95%, 53%, 0.7)',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss-debug-screens'),
  ],
}
