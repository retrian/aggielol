/**  tailwind.config.js  (CommonJS so it works in every Node setup) */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  
  theme: {
    extend: {
      /* ------------  custom design tokens  ------------ */
      colors: {
        /*   bg-background, text-foreground, etc.   */
        background:  'hsl(var(--background) / <alpha-value>)',
        foreground:  'hsl(var(--foreground) / <alpha-value>)',

        /*   <<< THIS is the one Vite keeps yelling about  */
        border:      'hsl(var(--border) / <alpha-value>)',

        input:       'hsl(var(--input) / <alpha-value>)',
        ring:        'hsl(var(--ring) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius)',
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),  // safe to delete if you don’t use it
  ],
};

// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",          // ⬅️  change from false → "class"
  theme: { extend: {} },
  plugins: [],
};

// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        maroon: {
          700: "#500000",
        },
      },
    },
  },
};
