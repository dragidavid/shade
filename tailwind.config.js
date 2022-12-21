const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
    },
    fontFamily: {
      "fira-code": ["var(--font-fira-code)", ...fontFamily.mono],
      "jetbrains-mono": ["var(--font-jetbrains-mono)", ...fontFamily.mono],
      inconsolata: ["var(--font-inconsolata)", ...fontFamily.mono],
      "source-code-pro": ["var(--font-source-code-pro)", ...fontFamily.mono],
      "ibm-plex-mono": ["var(--font-ibm-plex-mono)", ...fontFamily.mono],
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
