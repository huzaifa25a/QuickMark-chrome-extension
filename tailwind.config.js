/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      keyframes: {
        slideDownFade: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '30%': { transform: 'translateY(0)', opacity: '1' },
          '70%': { transform: 'translateY(10px)', opacity: '1' },
          '100%': { transform: 'translateY(30px)', opacity: '0' },
        },
      },
      animation: {
        slideMessage: 'slideDownFade 3s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};

