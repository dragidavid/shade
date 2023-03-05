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

  const snippet = await getSnippet(params.id);

  const editable = session?.user?.id === snippet?.userId;
  const signedIn = !!session;

  if (!snippet) {
    notFound();
  }

  return <Editor snippet={snippet} editable={editable} signedIn={signedIn} />;
}
