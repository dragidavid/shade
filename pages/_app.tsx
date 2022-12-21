import clsx from "clsx";
import {
  Inter,
  Fira_Code,
  JetBrains_Mono,
  Inconsolata,
  Source_Code_Pro,
  IBM_Plex_Mono,
} from "@next/font/google";

import { SettingsProvider } from "contexts/SettingsContext";

import type { AppProps } from "next/app";

import "styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-ibm-plex-mono",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SettingsProvider>
      <main
        id="main"
        className={clsx(
          inter.variable,
          firaCode.variable,
          jetBrainsMono.variable,
          inconsolata.variable,
          sourceCodePro.variable,
          ibmPlexMono.variable,
          "flex min-h-full flex-col items-center justify-center",
          "font-sans"
        )}
      >
        <Component {...pageProps} />
      </main>
    </SettingsProvider>
  );
}
