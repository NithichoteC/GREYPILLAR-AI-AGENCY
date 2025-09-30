/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lightest': '#F7F7F8',
        'very-light': '#f8f9fa',
        'light': '#e9ecef',
        'medium-light': '#ced4da',
        'medium': '#adb5bd',
        'medium-dark': '#6c757d',
        'dark': '#495057',
        'very-dark': '#343a40',
        'darkest': '#212529',
        'pure-white': '#FFFFFF',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}