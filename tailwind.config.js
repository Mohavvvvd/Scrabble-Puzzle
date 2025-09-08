/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        successPulse: {
          '0%': { transform: 'scale(1.05)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1.05)' },
        },
        celebrate: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        successPulse: 'successPulse 0.6s ease',
        celebrate: 'celebrate 0.6s ease',
      },
    },
  },
  plugins: [],
};


