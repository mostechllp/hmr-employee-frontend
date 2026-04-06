/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2ecc71',
        'primary-dark': '#1a9e52',
        'primary-light': '#d4f7e4',
        'danger': '#e74c3c',
        'warning': '#f39c12',
        'info': '#3498db',
        'purple': '#9b59b6',
        'yellow': '#f1c40f',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'xl': '18px',
        'lg': '10px',
      },
      animation: {
        'slide-up': 'slideUp 0.2s ease',
      },
      keyframes: {
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}