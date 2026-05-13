/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#1e3a8a',
          light: '#3b82f6',
          pale: '#eff6ff',
        },
        slate: {
          DEFAULT: '#1e293b',
          mid: '#475569',
          light: '#94a3b8',
        },
        bg: '#f4f6fb',
        gold: {
          DEFAULT: '#f59e0b',
        },
        border: '#e2e8f0',
      },

      borderRadius: {
        lg: "0.75rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      boxShadow: {
        card: "0 4px 32px rgba(30,58,138,0.08)",
      },

      keyframes: {
        attention: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.75',
            transform: 'scale(1.03)',
          },
        },
      },

      animation: {
        attention: 'attention 1.4s ease-in-out infinite',
      },

      // ✅ THIS COMMA WAS MISSING ↑

      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        serif: ["'Playfair Display'", "serif"],
      },
    },
  },
  plugins: [],
};