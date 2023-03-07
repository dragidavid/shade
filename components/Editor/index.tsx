"use client";

import Code from "components/Editor/Code";
import Settings from "components/Settings";
import ChangeListener from "components/Editor/ChangeListener";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

import type { Snippet } from "@prisma/client";

export default function Editor({
  partialSnippet,
  editable,
  signedIn,
}: {
  partialSnippet?: Partial<Snippet>;
  editable: boolean;
  signedIn: boolean;
}) {
  const setEditorState = useStore((state) => state.setEditorState);

  if (partialSnippet) {
    setEditorState(partialSnippet);
  }

  return (
    <div
      id="editor"
      className={cn(
        "flex h-full w-full flex-col items-center justify-center p-6"
      )}
    >
      <Code editable={editable} />

      {editable && <Settings />}

      {editable && signedIn && <ChangeListener />}
    </div>
  );
}
