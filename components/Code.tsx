import { useState, useEffect } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

import { useStateContext } from "contexts/State";

import { hslToHsla as adjustLightness } from "lib/colors/conversions";
import { exists } from "lib/exists";

import type { Extension } from "@codemirror/state";

interface CodeProps {
  editAllowed?: boolean;
}

export default function Code({ editAllowed }: CodeProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Extension | null>(
    null
  );

  const { state, setState } = useStateContext();

  useEffect(() => {
    async function loadLanguage() {
      const lang = await state.language.extension();

      setSelectedLanguage(lang);
    }

    loadLanguage();
  }, [state.language]);

  const customStyles = EditorView.baseTheme({
    "&.cm-editor": {
      fontSize: "0.9375rem",
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

  const c = state.theme.generatedColors;

  const editorTheme = createTheme({
    theme: "dark",
    settings: {
      background: "transparent",
      foreground: "white",
      caret: c.at(0),
      selection: adjustLightness(c.at(0)!, 0.1),
      selectionMatch: adjustLightness(c.at(0)!, 0.2),
      lineHighlight: "transparent",
      gutterBackground: "transparent",
      gutterForeground: adjustLightness(c.at(0)!, 0.4),
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
        color: c.at(1),
      },
      {
        tag: [t.comment, t.lineComment, t.blockComment, t.docComment],
        fontStyle: "italic",
        color: adjustLightness(c.at(0)!, 0.4),
      },
      {
        tag: [
          t.bracket,
          t.squareBracket,
          t.paren,
          t.punctuation,
          t.angleBracket,
        ],
        color: c.at(0),
      },
      // The following tags change a lot usually so adjust these for more drastic changes
      { tag: t.variableName, color: c.at(6), fontStyle: "italic" },
      { tag: t.propertyName, color: c.at(6), fontStyle: "italic" },
      { tag: t.definition(t.variableName), color: c.at(4) },
      { tag: t.definition(t.propertyName), color: c.at(6) },
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
        color: c.at(11),
      },
      {
        tag: [t.typeName, t.typeOperator],
        color: c.at(13),
      },
      {
        tag: [t.operator, t.special(t.string)],
        color: c.at(6),
      },
      {
        tag: [t.number, t.bool, t.string, t.processingInstruction, t.inserted],
        color: c.at(2),
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
        color: c.at(8),
      },
      { tag: [t.regexp], color: c.at(12) },
      { tag: [t.tagName], color: c.at(11) },
      {
        tag: [t.attributeValue],
        color: c.at(2),
      },
      {
        tag: [t.attributeName],
        color: c.at(6),
      },
      { tag: [t.heading], color: c.at(1), fontWeight: "bold" },
      { tag: [t.quote], color: c.at(6) },
    ],
  });

  return (
    <motion.div
      layout
      className={clsx(
        "relative z-0 w-auto min-w-[512px] max-w-5xl",
        state.padding.class,
        "bg-gradient-to-br",
        state.theme.class,
        "transition-all duration-200 ease-in-out"
      )}
    >
      <motion.div
        layout
        className="relative z-[1] h-full w-full min-w-[480px] max-w-2xl rounded-xl"
      >
        <div
          className={clsx(
            "absolute inset-0 rounded-xl",
            "after:absolute after:inset-0 after:z-[2] after:translate-y-6 after:rounded-xl after:bg-black/60 after:blur-xl"
          )}
        >
          <div
            className={clsx(
              "absolute inset-0 z-[3] rounded-xl",
              "bg-gradient-to-br",
              state.theme.class
            )}
          />
        </div>
        <div className="relative z-[4] rounded-xl bg-black/70 p-4">
          {selectedLanguage && (
            <CodeMirror
              editable={exists(editAllowed) && editAllowed}
              value={state.code}
              onChange={(value) => setState({ ...state, code: value })}
              extensions={[
                selectedLanguage,
                customStyles,
                customFontStyle,
                lineWrapping,
              ]}
              basicSetup={{
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
              }}
              theme={editorTheme}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
