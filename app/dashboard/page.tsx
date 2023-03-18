import Snippets from "components/Dashboard/Snippets";

import { prisma } from "lib/prisma";
import { getSession } from "lib/auth";
import { serialize } from "lib/serialize";

async function getSnippets(userId: string) {
  return await prisma.snippet.findMany({
    where: {
      userId,
    },
  });
}

export default async function Page() {
  const session = await getSession();

  const snippets = await getSnippets(session.user.id);

  return <Snippets snippets={serialize(snippets)} />;
}
