module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint . --ext ts --ext tsx --ext js --fix'],
  '**/*.ts?(x)': () => 'npm run build-types',
  '*.json': ['prettier --write'],
};
