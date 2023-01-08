import Code from "components/Code";
import Save from "components/Save";
import Settings from "components/Settings";

import prisma from "lib/prisma";
import { getServerSession } from "lib/auth";
import { exists } from "lib/exists";

import type { GetServerSidePropsContext } from "next";
import type { Snippet } from "lib/types";

interface SingleSnippetPageProps {
  editAllowed: boolean;
}

export default function SingleSnippetPage({
  editAllowed,
}: SingleSnippetPageProps) {
  return (
    <>
      <Code editAllowed={editAllowed} />

      {editAllowed && <Settings />}

      <Save />
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

  if (exists(session) && session.user.id === snippet!.userId) {
    editAllowed = true;
  }

  return {
    props: {
      snippet: JSON.parse(JSON.stringify(snippet)) as Snippet,
      editAllowed,
    },
  };
}
