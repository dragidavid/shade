"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { useCodeMirror } from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

import TitleBar from "components/Editor/TitleBar";

import { cn } from "lib/cn";
import { useStore } from "lib/store";
import { hslToHsla as adjustLightness } from "lib/colors/conversions";

import type { Extension } from "@codemirror/state";

export default function Code({ editable = false }: { editable: boolean }) {
  const [selectedLanguage, setSelectedLanguage] = useState<Extension | null>(
    null
  );
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const title = useStore((state) => state.title);
  const code = useStore((state) => state.code);
  const language = useStore((state) => state.language);
  const theme = useStore((state) => state.theme);
  const fontStyle = useStore((state) => state.fontStyle);
  const lineNumbers = useStore((state) => state.lineNumbers);
  const padding = useStore((state) => state.padding);
  const update = useStore((state) => state.update);

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
      fontFamily: fontStyle.variable,
      fontVariantLigatures: "normal",
    },
    ".cm-gutters": {
      fontFamily: fontStyle.variable,
      fontVariantLigatures: "normal",
    },
  });
  const lineWrapping = EditorView.lineWrapping;
  const setTabIndex = EditorView.contentAttributes.of({ tabindex: "-1" });

  const colors = theme.generatedColors;

  const customEditorTheme = createTheme({
    theme: "dark",
    settings: {
      background: "transparent",
      foreground: "white",
      caret: editable ? colors.at(0) : "transparent",
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

  const { container, setContainer, view } = useCodeMirror({
    container: editorRef.current,
    value: code,
    onChange: (value) => update("code", value),
    autoFocus: false,
    editable,
    basicSetup: {
      lineNumbers: lineNumbers,
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
    ],
    theme: customEditorTheme,
  });

  useEffect(() => {
    async function loadLanguage() {
      const lang = await language.extension();

      setSelectedLanguage(lang);
    }

    loadLanguage();
  }, [language]);

  useEffect(() => {
    if (editorRef.current && !container && selectedLanguage) {
      setContainer(editorRef.current);
    }
  }, [selectedLanguage, container, setContainer]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        !editorContainerRef.current?.contains(event.target as Node) &&
        view?.hasFocus
      ) {
        view.contentDOM.blur();
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [view]);

  useEffect(() => {
    if (editorRef.current) {
      const textboxElement = document.querySelector('[role="textbox"]');

      if (textboxElement) {
        textboxElement.ariaLabel = "code-editor";
      }
    }
  }, [editorRef]);

  if (!selectedLanguage) {
    return null;
  }

  return (
    <motion.div
      ref={editorContainerRef}
      layout
      animate={{
        opacity: 1,
        transition: { duration: 0.1 },
      }}
      initial={{
        opacity: 0,
      }}
      className={cn(
        "relative z-0 w-auto min-w-[512px] max-w-5xl rounded-xl shadow-xl",
        padding.class,
        "bg-gradient-to-br",
        theme.class,
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
              theme.class
            )}
          />
        </div>
        <div className={cn("relative z-[4] rounded-lg", "bg-black/70")}>
          <TitleBar />

          <div className={cn("rounded-lg p-3")}>
            <div ref={editorRef} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
