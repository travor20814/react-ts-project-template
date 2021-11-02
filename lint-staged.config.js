module.exports = {
  './client/**/*.{js,jsx,ts,tsx}': ['eslint --config ./client/.eslintrc --ext .js,.jsx,.ts,.tsx --fix'],
  '*.{css,sass,scss}': ['stylelint --config .stylelintrc --fix'],
};
