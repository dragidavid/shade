import { create } from "zustand";
import { devtools } from "zustand/middleware";
import produce from "immer";

import {
  INITIAL_CODE,
  SUPPORTED_LANGUAGES,
  SUPPORTED_THEMES,
  SUPPORTED_FONT_STYLES,
  SUPPORTED_FONT_SIZES,
  SUPPORTED_PADDING_CHOICES,
} from "lib/values";

import { find } from "lib/find";

import type { Store, SnippetSettings } from "lib/types";

export const useStore = create<Store>()(
  devtools((set, get) => ({
    saveStatus: "IDLE",
    id: null,
    title: null,
    code: INITIAL_CODE,
    language: SUPPORTED_LANGUAGES.at(0)!,
    theme: SUPPORTED_THEMES.at(0)!,
    fontStyle: SUPPORTED_FONT_STYLES.at(0)!,
    fontSize: SUPPORTED_FONT_SIZES.at(1)!,
    lineNumbers: true,
    padding: SUPPORTED_PADDING_CHOICES.at(1)!,
    update: (type, value) =>
      set(
        produce((state) => {
          state[type] = value;
        })
      ),
    setEditorState: (partialSnippet) =>
      set(
        produce((state) => {
          const settings = partialSnippet.settings as SnippetSettings;

          state.id = partialSnippet.id;
          state.title = partialSnippet.title;
          state.code = partialSnippet.code;
          state.language = find(SUPPORTED_LANGUAGES, settings.language);
          state.theme = find(SUPPORTED_THEMES, settings.theme);
          state.fontStyle = find(SUPPORTED_FONT_STYLES, settings.fontStyle);
          state.fontSize = find(SUPPORTED_FONT_SIZES, settings.fontSize);
          state.lineNumbers = settings.lineNumbers;
          state.padding = find(SUPPORTED_PADDING_CHOICES, settings.padding);
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
        fontSize,
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
        fontSize,
        lineNumbers,
        padding,
      };
    },
  }))
);
