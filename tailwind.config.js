/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/index.html",
    "./src/**/**/*.jsx",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "./src/assets/*.{svg,png,jpg,jpeg,gif}",
  ],
  theme: {
    container: {
      center: true
    },
    extend: {
      colors: {
        whiteColor: '#ffffff',
        blackColor: '#000000',
        lightGreenColor: '#ECFAE5',
        normalGreenColor: '#DDF6D2',
        mediumGreenColor: '#CAE8BD',
        darkGreenColor: '#B0DB9C',
      },
      backgroundImage: {
        'logo': "url('./src/assets/react.svg')",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

