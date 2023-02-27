import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

import { useCodeMirror } from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

import { useStateContext } from "contexts/State";

import { cn } from "lib/cn";
import { exists } from "lib/exists";
import { hslToHsla as adjustLightness } from "lib/colors/conversions";

import type { Extension } from "@codemirror/state";

interface CodeProps {
  editAllowed?: boolean;
}

export default function Code({ editAllowed }: CodeProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Extension | null>(
    null
  );
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const { pathname } = useRouter();

  const { state, setState } = useStateContext();

  const isEditable = (exists(editAllowed) && editAllowed) || pathname === "/";

  const customStyles = EditorView.baseTheme({
    "&.cm-editor": {
      fontSize: "0.9375rem",
      fontWeight: 600,
    },
    "&.cm-editor.cm-focused": {
      outline: "none",
    },
    ".cm-gutterElement": {
      display: "flex",
      justifyContent: "flex-end",
      paddingRight: "1rem !important",
      lineHeight: "1.5rem",
      letterSpacing: ".1px",
    },
    ".cm-content": {
      lineHeight: "1.5rem",
    },
  });
  const customFontStyle = EditorView.theme({
    ".cm-content *": {
      fontFamily: state.fontStyle.variable,
      fontVariantLigatures: "normal",
    },
    ".cm-gutters": {
      fontFamily: state.fontStyle.variable,
      fontVariantLigatures: "normal",
    },
  });
  const lineWrapping = EditorView.lineWrapping;
  const setTabIndex = EditorView.contentAttributes.of({ tabindex: "-1" });
  const logFocusChange = EditorView.focusChangeEffect.of((_, focusing) => {
    console.log("focus change", focusing);

    return null;
  });

  const colors = state.theme.generatedColors;

  const customEditorTheme = createTheme({
    theme: "dark",
    settings: {
      background: "transparent",
      foreground: "white",
      caret: colors.at(0),
      selection: adjustLightness(colors.at(0)!, 0.1),
      selectionMatch: adjustLightness(colors.at(0)!, 0.2),
      lineHighlight: "transparent",
      gutterBackground: "transparent",
      gutterForeground: adjustLightness(colors.at(0)!, 0.4),
      gutterBorder: "transparent",
    },
    styles: [
      {
        tag: [t.emphasis],
        fontStyle: "italic",
      },
      {
        tag: [t.strong],
        fontStyle: "bold",
      },
      {
        tag: [t.link],
        color: colors.at(1),
      },
      {
        tag: [t.comment, t.lineComment, t.blockComment, t.docComment],
        fontStyle: "italic",
        color: adjustLightness(colors.at(0)!, 0.4),
      },
      {
        tag: [
          t.bracket,
          t.squareBracket,
          t.paren,
          t.punctuation,
          t.angleBracket,
        ],
        color: colors.at(0),
      },
      // The following tags change a lot usually so adjust these for more drastic changes
      { tag: t.variableName, color: colors.at(6), fontStyle: "italic" },
      { tag: t.propertyName, color: colors.at(6), fontStyle: "italic" },
      { tag: t.definition(t.variableName), color: colors.at(4) },
      { tag: t.definition(t.propertyName), color: colors.at(6) },
      {
        tag: [
          t.moduleKeyword,
          t.keyword,
          t.changed,
          t.annotation,
          t.modifier,
          t.namespace,
          t.self,
          t.meta,
        ],
        color: colors.at(11),
      },
      {
        tag: [t.typeName, t.typeOperator],
        color: colors.at(13),
      },
      {
        tag: [t.operator, t.special(t.string)],
        color: colors.at(6),
      },
      {
        tag: [t.number, t.bool, t.string, t.processingInstruction, t.inserted],
        color: colors.at(2),
      },
      {
        tag: [
          t.color,
          t.className,
          t.constant(t.name),
          t.standard(t.name),
          t.function(t.variableName),
          t.function(t.propertyName),
        ],
        color: colors.at(8),
      },
      { tag: [t.regexp], color: colors.at(12) },
      { tag: [t.tagName], color: colors.at(11) },
      {
        tag: [t.attributeValue],
        color: colors.at(2),
      },
      {
        tag: [t.attributeName],
        color: colors.at(6),
      },
      { tag: [t.heading], color: colors.at(1), fontWeight: "bold" },
      { tag: [t.quote], color: colors.at(6) },
    ],
  });

  const {
    container,
    setContainer,
    view,
    state: ss,
  } = useCodeMirror({
    container: editorRef.current,
    value: state.code,
    onChange: (value) => setState({ ...state, code: value }),
    autoFocus: false,
    editable: isEditable,
    basicSetup: {
      lineNumbers: state.lineNumbers,
      foldGutter: false,
      autocompletion: false,
      indentOnInput: false,
      highlightActiveLine: false,
      highlightActiveLineGutter: false,
      dropCursor: false,
      searchKeymap: false,
      lintKeymap: false,
      completionKeymap: false,
      foldKeymap: false,
    },
    extensions: [
      selectedLanguage!,
      customStyles,
      customFontStyle,
      lineWrapping,
      setTabIndex,
      logFocusChange,
    ],
    theme: customEditorTheme,
  });

  useEffect(() => {
    async function loadLanguage() {
      const lang = await state.language.extension();

      setSelectedLanguage(lang);
    }

    loadLanguage();
  }, [state.language]);

  useEffect(() => {
    if (editorRef.current && !exists(container) && exists(selectedLanguage)) {
      setContainer(editorRef.current);
    }
  }, [selectedLanguage, container, setContainer]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        !editorContainerRef.current?.contains(event.target as Node) &&
        view?.hasFocus
      ) {
        console.log("we here? blurring and shit");

        view.contentDOM.blur();
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [view]);

  return (
    <motion.div
      ref={editorContainerRef}
      layout
      className={cn(
        "relative z-0 w-auto min-w-[512px] max-w-5xl rounded-xl",
        state.padding.class,
        "bg-gradient-to-br",
        state.theme.class,
        "transition-all duration-100 ease-in-out"
      )}
    >
      <motion.div
        layout
        className={cn(
          "relative z-[1] h-full w-full min-w-[480px] max-w-2xl rounded-lg"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-lg",
            "after:absolute after:inset-0 after:z-[2] after:translate-y-6 after:rounded-xl after:bg-black/60 after:blur-xl"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 z-[3] rounded-lg",
              "bg-gradient-to-br",
              state.theme.class
            )}
          />
        </div>
        <div className={cn("relative z-[4] rounded-lg p-4", "bg-black/70")}>
          {selectedLanguage && <div ref={editorRef} />}
        </div>
      </motion.div>
    </motion.div>
  );
}
