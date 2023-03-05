"use client";

import Code from "components/Editor/Code";
import Settings from "components/Settings";
import ChangeListener from "components/Editor/ChangeListener";

import { cn } from "lib/cn";
import { useAppState } from "lib/store";

// TODO FIX TYPE
export default function Editor({
  snippet,
  editable,
  signedIn,
}: {
  snippet?: any;
  editable: boolean;
  signedIn: boolean;
}) {
  const setEditorState = useAppState((state) => state.setEditorState);

  if (snippet) {
    setEditorState(snippet);
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
