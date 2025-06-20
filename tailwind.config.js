/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',                     // light = default, .dark = dark
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      /* HSL helpers that read from CSS variables set in :root /.dark */
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        border:      'hsl(var(--border) / <alpha-value>)',
        input:       'hsl(var(--input) / <alpha-value>)',
        ring:        'hsl(var(--ring) / <alpha-value>)',

        /* TAMU maroon shade for accents */
        maroon: {
          700: '#500000',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
