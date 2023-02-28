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

import { cn } from "lib/cn";

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

// background-color: black;
// background-image: linear-gradient(to right, #0F0F0F 1px,transparent 1px),linear-gradient(to bottom, #0f0f0f 1px,transparent 1px);
// background-position: calc(50% - 4rem/2) calc(50% - 4rem/2);
// background-size: 4rem 4rem;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div
        className={cn(
          "grid min-h-screen grid-rows-[auto,1fr]",
          inter.variable,
          firaCode.variable,
          jetBrainsMono.variable,
          inconsolata.variable,
          sourceCodePro.variable,
          ibmPlexMono.variable
        )}
      >
        <Top />
        <motion.div
          id="main"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn("flex flex-col items-center justify-center")}
        >
          <style jsx global>{`
            html {
              font-family: ${inter.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
        </motion.div>
      </div>
    </SessionProvider>
  );
}
