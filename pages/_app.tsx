import clsx from "clsx";
import { motion } from "framer-motion";
import {
  Inter,
  Fira_Code,
  JetBrains_Mono,
  Inconsolata,
  Source_Code_Pro,
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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SettingsProvider>
      <motion.main
        id="main"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.3 }}
        className={clsx(
          inter.variable,
          firaCode.variable,
          jetBrainsMono.variable,
          inconsolata.variable,
          sourceCodePro.variable,
          "flex min-h-full flex-col items-center justify-center",
          "font-sans"
        )}
      >
        <Component {...pageProps} />
      </motion.main>
    </SettingsProvider>
  );
}
