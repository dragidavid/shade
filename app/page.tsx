import { redirect } from "next/navigation";

import Editor from "components/Editor";

import { getSession } from "lib/auth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "shade - Share some code",
  description: "Yet another code sharing app...",
  twitter: {
    card: "summary_large_image",
    title: "shade - Share some code",
    description: "Yet another code sharing app...",
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
