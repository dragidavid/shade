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
      colors: {
        "almost-black": "#0f0f0f",
        "almost-white": "#f2f2f2",
      },
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
  plugins: [require("tailwindcss-animate"), require("tailwindcss-radix")],
};
