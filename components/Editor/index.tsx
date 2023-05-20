"use client";

import Code from "components/Editor/Code";
import Views from "components/Editor/Views";
import ChangeListener from "components/Editor/ChangeListener";
import Settings from "components/Settings";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

import type { Snippet } from "@prisma/client";

export default function Editor({
  snippet,
  views,
  editable,
  isAuthenticated,
}: {
  snippet?: Snippet;
  views?: number;
  editable: boolean;
  isAuthenticated: boolean;
}) {
  const setAppState = useStore((state) => state.setAppState);

  if (snippet) {
    setAppState(snippet);
  }

  return (
    <div
      id="editor"
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center p-6"
      )}
    >
      {views !== undefined && <Views views={views} />}

      <Code editable={editable} />

      {editable && <Settings />}

      {editable && isAuthenticated && <ChangeListener />}
    </div>
  );
}
