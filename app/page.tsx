import { redirect } from "next/navigation";

import Editor from "components/Editor";

import { getSession } from "lib/auth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "shade - Share some code",
  description: "Yet another code sharing app...",
  openGraph: {
    title: "shade - Share some code",
    description: "Yet another code sharing app...",
    url: "https://shade.dragi.me",
    siteName: "shade - Share some code",
    images: [
      {
        url: "https://shade.dragi.me/og.png",
        width: 1200,
        height: 600,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "shade",
    creator: "@dragidavid",
  },
  metadataBase: new URL("https://shade.dragi.me"),
  themeColor: "#000",
};

export default async function Page() {
  const session = await getSession();

  const isAuthenticated = !!session;

  if (session) {
    redirect("/dashboard");
  }

  return <Editor editable={true} isAuthenticated={isAuthenticated} />;
}
