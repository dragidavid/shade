// const { fontFamily } = require("tailwindcss/defaultTheme");

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
        greyish: "#b0b0b0",
        "almost-white": "#efefef",
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
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-radix")],
};
