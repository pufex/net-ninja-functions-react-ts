/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{tsx,ts}",
    "./components/**/*.{tsx,ts}",
    "./pages/**/*.{tsx,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "primary": "0 0 6px #f59e0b"
      }
    }
  },
  plugins: [],
}

