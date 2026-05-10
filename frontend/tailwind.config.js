/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:   '#063B18',   // deep logo green
        maroon: '#0B5D1E',   // dark green replacement
        orange: '#D89A10',   // gold from logo
        green:  '#2E8B2E',   // main green
        lime:   '#6DBB2D',   // light green accent
        bgray:  '#F4F7F2',   // soft green-gray background
        body:   '#2F3A2F',   // dark natural body text
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
