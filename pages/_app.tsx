import clsx from "clsx";
import { motion } from "framer-motion";
import { SessionProvider } from "next-auth/react";

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
  display: "swap",
  variable: "--font-inter",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const inconsolata = Inconsolata({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inconsolata",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-code-pro",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
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
            ibmPlexMono.variable,
            "flex min-h-full flex-col items-center justify-center",
            "font-sans"
          )}
        >
          <Component {...pageProps} />
        </motion.main>
      </SettingsProvider>
    </SessionProvider>
  );
}
