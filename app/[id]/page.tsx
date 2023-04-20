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
    select: {
      id: true,
      title: true,
      code: true,
      settings: true,
      userId: true,
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
    select: {
      count: true,
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const partialSnippet = await getSnippet(params.id);

  return {
    title: partialSnippet?.title ?? "Untitled",
    twitter: {
      card: "summary_large_image",
      title: partialSnippet?.title ?? "Untitled snippet",
      description: "Yet another code sharing app...",
      creator: "@dragidavid",
    },
    themeColor: "#000",
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getSession();

  const partialSnippet = await getSnippet(params.id);
  const views = partialSnippet && (await increaseViewCount(params.id));

  const editable = session?.user?.id === partialSnippet?.userId;
  const isAuthenticated = !!session;

  if (!partialSnippet) {
    notFound();
  }

  return (
    <Editor
      partialSnippet={partialSnippet}
      views={views?.count}
      editable={editable}
      isAuthenticated={isAuthenticated}
    />
  );
}
