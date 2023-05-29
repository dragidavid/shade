import type { Snippet } from "@prisma/client";
import type { Extension } from "@codemirror/state";

import type { InterpolationMode } from "chroma-js";

export type Message =
  | "SUCCESS"
  | "ERROR"
  | "UNAUTHORIZED"
  | "TOO_MANY_REQUESTS"
  | "LIMIT_REACHED"
  | "EMPTY_EDITOR"
  | "CLIPBOARD_API_NOT_SUPPORTED"
  | "UNKNOWN_ERROR"
  | "SNIPPET_NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | "PENDING"
  | "IDLE";

export type LanguageDefinition = {
  id: string;
  label: string;
  extension: () => Promise<Extension>;
};

export type ThemeDefinition = {
  id: string;
  label: string;
  baseColors: string[];
};

export type FontFamilyDefinition = {
  id: string;
  label: string;
  variable: string;
  class: string;
};

export type AppStatus = {
  message: Message;
  hasCustomTheme: boolean;
};

export type AppState = {
  id: string | null;
  title: string | null;
  code: string | null;
  language: LanguageDefinition;
  theme: ThemeDefinition;
  fontFamily: FontFamilyDefinition;
  fontSize: string;
  lineNumbers: boolean;
  padding: string;
  customColors: string[];
  colorMode: InterpolationMode;
  angle: number;
  grain: boolean;
};

export interface Store extends AppStatus, AppState {
  update: <
    T extends string,
    V extends
      | string
      | number
      | boolean
      | LanguageDefinition
      | ThemeDefinition
      | FontFamilyDefinition
  >(
    type: T,
    value: V
  ) => void;
  setAppState: (snippet: Snippet) => void;
  getAppState: () => AppState;
  setCustomColor: (c: string, i: number) => void;
  addCustomColor: (c: string) => void;
  removeCustomColor: (i: number) => void;
}
