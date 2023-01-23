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

import Top from "components/Top";

import { StateProvider } from "contexts/State";

import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_THEMES,
  SUPPORTED_FONT_STYLES,
  SUPPORTED_PADDING_CHOICES,
} from "lib/values";

import { find } from "lib/find";
import { exists } from "lib/exists";

import type { AppProps } from "next/app";
import type { State } from "lib/types";

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
  const initialState: State | null = exists(pageProps.snippet)
    ? {
        code: pageProps.snippet.code,
        language: find(
          SUPPORTED_LANGUAGES,
          pageProps.snippet.settings.language
        ),
        theme: find(SUPPORTED_THEMES, pageProps.snippet.settings.theme),
        fontStyle: find(
          SUPPORTED_FONT_STYLES,
          pageProps.snippet.settings.fontStyle
        ),
        lineNumbers: pageProps.snippet.settings.lineNumbers,
        padding: find(
          SUPPORTED_PADDING_CHOICES,
          pageProps.snippet.settings.padding
        ),
      }
    : null;

  return (
    <SessionProvider session={session}>
      <StateProvider initialState={initialState}>
        <div
          className={clsx(
            inter.variable,
            firaCode.variable,
            jetBrainsMono.variable,
            inconsolata.variable,
            sourceCodePro.variable,
            ibmPlexMono.variable,
            "grid min-h-screen grid-rows-[auto,1fr]",
            "font-sans"
          )}
        >
          <Top />
          <motion.div
            id="main"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={clsx("flex flex-col items-center justify-center")}
          >
            <Component {...pageProps} />
          </motion.div>
        </div>
      </StateProvider>
    </SessionProvider>
  );
}
