import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from "immer";

import {
  BASE_LANGUAGES,
  BASE_THEMES,
  BASE_FONT_FAMILIES,
  DEFAULT_VALUES,
} from "lib/values";

import { find } from "lib/find";

import type { Store } from "lib/types";

export const useStore = create<Store>()(
  devtools((set, get) => ({
    ...DEFAULT_VALUES,
    update: (type, value) =>
      set(
        produce((state) => {
          state[type] = value;
        })
      ),
    setAppState: (snippet) =>
      set(
        produce((state) => {
          state.message = DEFAULT_VALUES.message;
          state.creatingCustomTheme = DEFAULT_VALUES.creatingCustomTheme;
          state.id = snippet.id;
          state.title = snippet.title;
          state.code = snippet.code;
          state.language = find(BASE_LANGUAGES, snippet.language!);
          state.theme = find(BASE_THEMES, snippet.theme!);
          state.fontFamily = find(BASE_FONT_FAMILIES, snippet.fontFamily!);
          state.fontSize = snippet.fontSize;
          state.lineNumbers = snippet.lineNumbers;
          state.padding = snippet.padding;
          state.colors = snippet.colors;
          state.colorMode = snippet.colorMode;
          state.angle = snippet.angle;
        })
      ),
    getAppState: () => {
      const {
        id,
        title,
        code,
        language,
        theme,
        fontFamily,
        fontSize,
        lineNumbers,
        padding,
        colors,
        colorMode,
        angle,
      } = get();

      return {
        id,
        title,
        code,
        language,
        theme,
        fontFamily,
        fontSize,
        lineNumbers,
        padding,
        colors,
        colorMode,
        angle,
      };
    },
    setCustomColor: (c, i) =>
      set(
        produce((state) => {
          state.colors[i] = c;
        })
      ),
    addCustomColor: (c) =>
      set(
        produce((state) => {
          state.colors.push(c);
        })
      ),
    removeCustomColor: (i) =>
      set(
        produce((state) => {
          state.colors.splice(i, 1);
        })
      ),
  }))
);
