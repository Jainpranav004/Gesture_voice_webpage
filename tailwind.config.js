/** @type {import('tailwindcss').Config} */
module.exports = {
  mode :'jit',
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {
      colors: {
        'wrc' : "#C39B3A",
      }
    },
  },
  plugins: [],
}

