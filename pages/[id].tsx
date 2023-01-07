import { useEffect } from "react";

import Code from "components/Code";
import Settings from "components/Settings";

import { useStateContext } from "contexts/State";

import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_THEMES,
  SUPPORTED_FONT_STYLES,
  SUPPORTED_PADDING_CHOICES,
} from "lib/values";

import prisma from "lib/prisma";
import { getServerSession } from "lib/auth";
import { exists } from "lib/exists";
import { find } from "lib/find";

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
  const { setState } = useStateContext();

  useEffect(() => {
    if (exists(snippet)) {
      setState({
        code: snippet.code,
        language: find(SUPPORTED_LANGUAGES, snippet.settings.language),
        theme: find(SUPPORTED_THEMES, snippet.settings.theme),
        fontStyle: find(SUPPORTED_FONT_STYLES, snippet.settings.fontStyle),
        lineNumbers: snippet.settings.lineNumbers,
        padding: find(SUPPORTED_PADDING_CHOICES, snippet.settings.padding),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippet]);

  return (
    <>
      <Code editAllowed={editAllowed} />

      {editAllowed && <Settings />}
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
      snippet: JSON.parse(JSON.stringify(snippet)),
      editAllowed,
    },
  };
}
