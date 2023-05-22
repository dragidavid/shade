"use client";

import Code from "components/Editor/Code";
import Views from "components/Editor/Views";
import Wrapper from "components/Editor/Wrapper";
import TitleBar from "components/Editor/TitleBar";
import ChangeListener from "components/Editor/ChangeListener";
import Settings from "components/Settings";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

export default function Editor({
  views,
  editable,
  isAuthenticated,
}: {
  views?: number;
  editable: boolean;
  isAuthenticated: boolean;
}) {
  const creatingCustomTheme = useStore((state) => state.creatingCustomTheme);

  return (
    <div
      id="editor"
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center p-6"
      )}
    >
      {views !== undefined && <Views views={views} />}

      <Wrapper>
        <TitleBar editable={editable && !creatingCustomTheme} />

        <Code editable={editable && !creatingCustomTheme} />
      </Wrapper>

      {editable && <Settings />}

      {editable && !creatingCustomTheme && isAuthenticated && (
        <ChangeListener />
      )}
    </div>
  );
}
