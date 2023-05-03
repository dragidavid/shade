/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "almost-black": "#161616",
        greyish: "#b3b3b3",
        "almost-white": "#f2f2f2",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
    fontFamily: {
      "fira-code": ["var(--font-fira-code)"],
      "jetbrains-mono": ["var(--font-jetbrains-mono)"],
      inconsolata: ["var(--font-inconsolata)"],
      "source-code-pro": ["var(--font-source-code-pro)"],
      "ibm-plex-mono": ["var(--font-ibm-plex-mono)"],
      "kode-mono": ["var(--font-mono-code)"],
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-radix")],
};
