import { Analytics } from "@vercel/analytics/react";

import Header from "components/Header";

import Providers from "contexts/Providers";

import { cn } from "lib/cn";

import { fonts } from "assets/fonts";

import "styles/globals.css";

export const metadata = {
  title: {
    template: "%s | shade",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        fonts.inter.variable,
        fonts.firaCode.variable,
        fonts.jetBrainsMono.variable,
        fonts.inconsolata.variable,
        fonts.sourceCodePro.variable,
        fonts.ibmPlexMono.variable
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

          <main className={cn("grid place-items-center")}>
            {children}

            <Analytics />
          </main>
        </Providers>
      </body>
    </html>
  );
}
