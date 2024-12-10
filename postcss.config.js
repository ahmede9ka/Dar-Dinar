
let tailwindcss = require('tailwindcss');
let autoprefixer = require('autoprefixer');
let postcssNested = require('postcss-nested');
let postcssImport = require('postcss-import');

module.exports = {
    plugins: {
      tailwindcss: {'./tailwind.config.js': {}},
      autoprefixer,
      postcssNested,
      postcssImport,
    }
  };
  