import {
  Inter,
  Fira_Code,
  JetBrains_Mono,
  Inconsolata,
  Source_Code_Pro,
  IBM_Plex_Mono,
} from "next/font/google";

import Header from "components/Header";

import Providers from "contexts/Providers";

import { cn } from "lib/cn";

import type { Metadata } from "next";

import "styles/globals.css";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        firaCode.variable,
        jetBrainsMono.variable,
        inconsolata.variable,
        sourceCodePro.variable,
        ibmPlexMono.variable
      )}
    >
      <body
        className={cn(
          "grid min-h-screen grid-rows-[auto,1fr] text-sm",
          "bg-almost-black text-greyish caret-fuchsia-500 selection:bg-fuchsia-500 selection:text-almost-white"
        )}
      >
        <Providers>
          <Header />

          <main className={cn("grid place-items-center")}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
