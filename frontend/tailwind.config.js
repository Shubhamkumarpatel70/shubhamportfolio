/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0D1117',
        'card-bg': '#161B22',
        'primary': '#58A6FF',
        'accent': '#F78166',
        'text-primary': '#C9D1D9',
      },
      backgroundColor: {
        'bg-dark': '#0D1117',
        'card-bg': '#161B22',
        'primary': '#58A6FF',
        'accent': '#F78166',
      },
      textColor: {
        'text-primary': '#C9D1D9',
        'primary': '#58A6FF',
        'accent': '#F78166',
      },
      borderColor: {
        'card-bg': '#161B22',
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out',
        'fade-in': 'fadeIn 1s ease-out',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}

