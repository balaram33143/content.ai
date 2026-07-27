/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef6ff', 100: '#d9ebff', 200: '#bcdcff', 300: '#8ec5ff', 400: '#59a3ff',
          500: '#3380fc', 600: '#1d61f0', 700: '#164de0', 800: '#193fb5', 900: '#1a388f',
        },
        accent: {
          50: '#fef3f2', 100: '#fee4e2', 200: '#fecdca', 300: '#fda29b', 400: '#f97066',
          500: '#ef4444', 600: '#d92d20', 700: '#b42318', 800: '#912018', 900: '#7a271a',
        },
        neutral: {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8',
          500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
