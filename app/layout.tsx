import {
  Inter,
  Fira_Code,
  JetBrains_Mono,
  Inconsolata,
  Source_Code_Pro,
  IBM_Plex_Mono,
} from "next/font/google";

import Top from "components/Top";
import SupabaseListener from "components/SupabaseListener";

import Supabase from "contexts/Supabase";

import { cn } from "lib/cn";
import { createClient } from "lib/supabase/server";

import type { Metadata } from "next";

import "styles/globals.css";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

const inter = Inter({
  variable: "--font-inter",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
});

const inconsolata = Inconsolata({
  variable: "--font-inconsolata",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: "400",
  variable: "--font-ibm-plex-mono",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

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
          "grid min-h-screen grid-rows-[auto,1fr]",
          "bg-almost-black text-almost-white"
        )}
      >
        <Supabase session={session}>
          <SupabaseListener serverAccessToken={session?.access_token} />

          <Top />

          <main>{children}</main>
        </Supabase>
      </body>
    </html>
  );
}
