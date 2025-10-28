/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // or 'class', but you want only dark
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
      'y-cursor-head',
      'y-cursor-name',
      'y-selection',
    ],
  theme: {
    extend: {
      fontFamily: {
        jetbrains: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      colors: {
        background: 'oklch(0.145 0 0)',
        foreground: 'oklch(0.985 0 0)',
        card: {
          DEFAULT: 'oklch(0.205 0 0)',
          foreground: 'oklch(0.985 0 0)',
        },
        popover: {
          DEFAULT: 'oklch(0.205 0 0)',
          foreground: 'oklch(0.985 0 0)',
        },
        primary: {
          DEFAULT: 'oklch(0.6401 0.2112 36.78)',
          foreground: 'oklch(0.99 0 0)',
        },
        secondary: {
          DEFAULT: 'oklch(0.269 0 0)',
          foreground: 'oklch(0.985 0 0)',
        },
        muted: {
          DEFAULT: 'oklch(0.269 0 0)',
          foreground: 'oklch(0.708 0 0)',
        },
        accent: {
          DEFAULT: 'oklch(0.269 0 0)',
          foreground: 'oklch(0.985 0 0)',
        },
        destructive: {
          DEFAULT: 'oklch(0.704 0.191 22.216)',
          foreground: 'oklch(0.985 0 0)',
        },
        border: 'oklch(1 0 0 / 0%)',
        input: 'oklch(1 0 0 / 10%)',
        ring: 'oklch(0.556 0 0)',
        chart: {
          1: 'oklch(0.488 0.243 264.376)',
          2: 'oklch(0.696 0.17 162.48)',
          3: 'oklch(0.769 0.188 70.08)',
          4: 'oklch(0.627 0.265 303.9)',
          5: 'oklch(0.645 0.246 16.439)',
        },
        sidebar: {
          DEFAULT: 'oklch(0.205 0 0)',
          foreground: 'oklch(0.985 0 0)',
          primary: 'oklch(0.488 0.243 264.376)',
          'primary-foreground': 'oklch(0.985 0 0)',
          accent: 'oklch(0.269 0 0)',
          'accent-foreground': 'oklch(0.985 0 0)',
          border: 'oklch(1 0 0 / 10%)',
          ring: 'oklch(0.556 0 0)',
        },
        orange: {
          500: '#fe530d',
          600: '#f04a0b',
          700: '#d03f07',
        },
      },
      borderRadius: {
        lg: '0.625rem',
        md: 'calc(0.625rem - 2px)',
        sm: 'calc(0.625rem - 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
