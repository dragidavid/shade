import Code from "components/Code";
import Settings from "components/Settings";

import prisma from "lib/prisma";
import { exists } from "lib/exists";
import { getServerSession } from "lib/auth";

import type { GetServerSidePropsContext } from "next";
import type { Snippet } from "lib/types";

interface SingleSnippetPageProps {
  snippet: Snippet;
  editAllowed: boolean;
}

export default function SingleSnippetPage({
  snippet,
  editAllowed,
}: SingleSnippetPageProps) {
  return (
    <>
      <Code snippet={snippet} />

      {editAllowed && <Settings settings={snippet.settings} />}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res);
  const { id } = context.query;

  let editAllowed = false;

  const snippet = await prisma.snippet.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!exists(snippet)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (exists(session) && session.user.id === snippet!.authorId) {
    editAllowed = true;
  }

  return {
    props: {
      snippet: JSON.parse(JSON.stringify(snippet)),
      editAllowed,
    },
  };
}
