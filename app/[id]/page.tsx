import { notFound } from "next/navigation";

import Editor from "components/Editor";

import { prisma } from "lib/prisma";
import { getSession } from "lib/auth";

import type { Metadata } from "next";

async function getSnippet(id: string) {
  return await prisma.snippet.findUnique({
    where: {
      id,
    },
    include: {
      views: true,
    },
  });
}

async function increaseViewCount(id: string) {
  return await prisma.view.update({
    where: {
      snippetId: id,
    },
    data: {
      count: {
        increment: 1,
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const snippet = await getSnippet(params.id);

  return {
    title: !snippet ? "404" : snippet?.title ?? "Untitled",
    description: "Yet another code sharing app...",
    openGraph: {
      title: !snippet ? "404" : snippet?.title ?? "Untitled",
      description: "Yet another code sharing app...",
      url: `https://shade.dragi.me/${params.id}`,
      siteName: "shade - Share some code",
      images: [
        {
          url: "https://shade.dragi.me/opengraph-image.png",
          width: 1200,
          height: 600,
        },
      ],
      locale: "en-US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: !snippet ? "404" : snippet?.title ?? "Untitled",
      creator: "@dragidavid",
      description: "Yet another code sharing app...",
      images: ["https://shade.dragi.me/opengraph-image.png"],
    },
    themeColor: "#000",
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getSession();

  const snippet = await getSnippet(params.id);

  let views;

  if (snippet) {
    views =
      session?.user?.id !== snippet.userId
        ? await increaseViewCount(params.id)
        : snippet.views;
  }

  const editable = session?.user?.id === snippet?.userId;
  const isAuthenticated = !!session;

  if (!snippet) {
    notFound();
  }

  return (
    <Editor
      snippet={snippet}
      views={views?.count}
      editable={editable}
      isAuthenticated={isAuthenticated}
    />
  );
}
