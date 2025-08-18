/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ... tus extensiones de tema
    },
  },
  // ¡Asegúrate de que esta línea esté presente!
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: ["corporate"],
  },
};
export default config