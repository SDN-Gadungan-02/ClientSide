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
        backgroundColor: 'ffffff',
        greyColor: '#F5F5F5',
        blackColor: '#333333',
        darkBlueColor: '#0a4275',
        lightBlueColor: '#1a73e8',
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

