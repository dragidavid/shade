import { create } from "zustand";
import { devtools } from "zustand/middleware";
import produce from "immer";

import {
  INITIAL_CODE,
  SUPPORTED_LANGUAGES,
  SUPPORTED_THEMES,
  SUPPORTED_FONT_STYLES,
  SUPPORTED_PADDING_CHOICES,
} from "lib/values";

import { find } from "lib/find";

import type {
  LanguageDefinition,
  ThemeDefinition,
  FontDefinition,
  ChoiceDefinition,
  Snippet,
  State,
  SaveStatus,
} from "lib/types";

interface AppState {
  saveStatus: SaveStatus;
  id: string | null;
  title: string | null;
  code: string;
  language: LanguageDefinition;
  theme: ThemeDefinition;
  fontStyle: FontDefinition;
  lineNumbers: boolean;
  padding: ChoiceDefinition;
  update: <
    T extends string,
    V extends
      | string
      | boolean
      | LanguageDefinition
      | ThemeDefinition
      | FontDefinition
      | ChoiceDefinition
  >(
    type: T,
    value: V
  ) => void;
  setEditorState: (snippet: Snippet) => void;
  getEditorState: () => State;
}

export const useAppState = create<AppState>()(
  devtools((set, get) => ({
    saveStatus: "IDLE",
    id: null,
    title: null,
    code: INITIAL_CODE,
    language: SUPPORTED_LANGUAGES.at(0)!,
    theme: SUPPORTED_THEMES.at(2)!,
    fontStyle: SUPPORTED_FONT_STYLES.at(0)!,
    lineNumbers: true,
    padding: SUPPORTED_PADDING_CHOICES.at(1)!,
    update: (type, value) =>
      set(
        produce((state) => {
          state[type] = value;
        })
      ),
    setEditorState: (snippet: Snippet) =>
      set(
        produce((state) => {
          state.id = snippet.id;
          state.title = snippet.title;
          state.code = snippet.code;
          state.language = find(
            SUPPORTED_LANGUAGES,
            snippet.settings!.language
          );
          state.theme = find(SUPPORTED_THEMES, snippet.settings!.theme);
          state.fontStyle = find(
            SUPPORTED_FONT_STYLES,
            snippet.settings!.fontStyle
          );
          state.lineNumbers = snippet.settings!.lineNumbers;
          state.padding = find(
            SUPPORTED_PADDING_CHOICES,
            snippet.settings!.padding
          );
        })
      ),
    getEditorState: () => {
      const {
        id,
        title,
        code,
        language,
        theme,
        fontStyle,
        lineNumbers,
        padding,
      } = get();

      return {
        id,
        title,
        code,
        language,
        theme,
        fontStyle,
        lineNumbers,
        padding,
      };
    },
  }))
);
