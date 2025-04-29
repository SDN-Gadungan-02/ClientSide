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
        lightGreenColor: '#b5ea8c',
        lightGreenColor2: '#94bf73',
        mediumGreenColor1: '#739559',
        mediumGreenColor2: '#526a40',
        darkGreenColor: '###314026',
        darkGreenColor2: '#11150d',
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

