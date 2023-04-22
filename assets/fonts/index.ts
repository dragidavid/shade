import {
  Inter,
  Fira_Code,
  JetBrains_Mono,
  Inconsolata,
  Source_Code_Pro,
  IBM_Plex_Mono,
} from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const inconsolata = Inconsolata({
  variable: "--font-inconsolata",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: "400",
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
});

export const fonts = {
  inter,
  firaCode,
  jetBrainsMono,
  inconsolata,
  sourceCodePro,
  ibmPlexMono,
};
