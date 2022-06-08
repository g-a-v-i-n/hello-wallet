module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'no-print': { 'raw': '(min-height: 800px)' },
      },
    },
  },
  plugins: [],
}
