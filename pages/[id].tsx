import { useEffect } from "react";

import Code from "components/Code";
import Save from "components/Save";
import Settings from "components/Settings";

import prisma from "lib/prisma";
import { exists } from "lib/exists";
import { getSession } from "lib/auth";
import { useAppState } from "lib/store";

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
  const setEditorState = useAppState((state) => state.setEditorState);

  useEffect(() => {
    if (exists(snippet)) {
      setEditorState(snippet);
    }
  }, []);

  return (
    <>
      <Code editAllowed={editAllowed} />

      {editAllowed && <Settings />}

      <Save />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context.req, context.res);
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
