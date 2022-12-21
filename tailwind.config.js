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
        firaCode: ["var(--font-fira-code)", ...fontFamily.mono],
        jetBrainsMono: ["var(--font-jetbrains-mono)", ...fontFamily.mono],
        inconsolata: ["var(--font-inconsolata)", ...fontFamily.mono],
        sourceCodePro: ["var(--font-source-code-pro)", ...fontFamily.mono],
        ibmPlexMono: ["var(--font-ibm-plex-mono)", ...fontFamily.mono],
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
