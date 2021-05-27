module.exports = {
  './client/**/*.{js,jsx,ts,tsx}': ['eslint --config ./client/.eslintrc --ext .js,.jsx,.ts,.tsx --fix'],
  '*.{css,sass,scss}': ['prettier --write', 'stylelint --config .stylelintrc --fix'],
};
