/** @type {import('tailwindcss').Config} */
module.exports = {
  mode :'jit',
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {
      screens:{
        'specfic-size':'1453px',
        'specfic-size-2':'850px',
      },
    },
  },
  plugins: [],
}
  