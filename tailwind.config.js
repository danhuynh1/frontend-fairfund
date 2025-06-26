/** @type {import('tailwindcss').Config} */
module.exports = {
  // This content path is crucial. It tells Tailwind to scan all .js and .jsx files
  // inside your 'src' folder and any of its subfolders.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
