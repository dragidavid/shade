import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from "immer";

import chroma from "chroma-js";

import {
  BASE_LANGUAGES,
  BASE_THEMES,
  BASE_FONT_FAMILIES,
  BASE_FONT_SIZES,
  BASE_PADDING_VALUES,
  BASE_COLOR_MODES,
} from "lib/values";

import { find } from "lib/find";

import type { Store } from "lib/types";

export const useStore = create<Store>()(
  devtools((set, get) => ({
    message: "IDLE",
    creatingCustomTheme: false,
    id: null,
    title: null,
    code: null,
    language: BASE_LANGUAGES.at(0)!,
    theme: BASE_THEMES.at(-1)!,
    fontFamily: BASE_FONT_FAMILIES.at(0)!,
    fontSize: BASE_FONT_SIZES.at(1)!,
    lineNumbers: true,
    padding: BASE_PADDING_VALUES.at(1)!,
    colors: [chroma.random().hex(), chroma.random().hex()],
    colorMode: BASE_COLOR_MODES.at(0)!,
    angle: 145,
    update: (type, value) =>
      set(
        produce((state) => {
          state[type] = value;
        })
      ),
    setAppState: (snippet) =>
      set(
        produce((state) => {
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
