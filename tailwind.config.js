/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: {
        max: '576px'
      },
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      colors: {
        primary: '#DF6951',
        secondary: 'rgba(223, 105, 81, 0.20)',
        gray: '#7D7D7D',
        blue: '#080080',
        purple: '#3E334E',
        'gray-2': 'rgba(217, 217, 217, 0.70)',
        'gray-3': 'rgba(255, 255, 255, 0.50)'
      }
    }
  },
  corePlugins: { preflight: false },
  plugins: []
}
