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
        "primary": "0 0 6px #f59e0b",
        "success": "0 0 6px #3e803b",
        "danger": "0 0 6px #80403b"
      }
    }
  },
  plugins: [],
}

