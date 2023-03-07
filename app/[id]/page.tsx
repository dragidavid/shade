import { notFound } from "next/navigation";

import Editor from "components/Editor";

import { prisma } from "lib/prisma";
import { getSession } from "lib/auth";

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

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getSession();

  const partialSnippet = await getSnippet(params.id);

  const editable = session?.user?.id === partialSnippet?.userId;
  const signedIn = !!session;

  if (!partialSnippet) {
    notFound();
  }

  return (
    <Editor
      partialSnippet={partialSnippet}
      editable={editable}
      signedIn={signedIn}
    />
  );
}
