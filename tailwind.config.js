/** @type {import('tailwindcss').Config} */
module.exports = {
  mode:'jit',
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {
      screens:{
      '3xl': {'max':'1590px'},
    },
  },
  },
  plugins: [],
}

