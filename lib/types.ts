import type { Prisma, Snippet } from "@prisma/client";
import type { Extension } from "@codemirror/state";

export type LanguageDefinition = {
  id: string;
  label: string;
  extension: () => Promise<Extension>;
};

export type ThemeDefinition = {
  id: string;
  label: string;
  class: string;
  generatedColors: string[];
};

export type FontDefinition = {
  id: string;
  label: string;
  variable: string;
  class: string;
};

export type ChoiceDefinition = {
  id: string;
  value?: number;
  label?: string;
  class?: string;
};

export type State = {
  id: string | null;
  title: string | null;
  code: string | null;
  language: LanguageDefinition;
  theme: ThemeDefinition;
  fontStyle: FontDefinition;
  fontSize: ChoiceDefinition;
  lineNumbers: boolean;
  padding: ChoiceDefinition;
};

export interface SnippetSettings extends Prisma.JsonObject {
  language: string;
  theme: string;
  fontStyle: string;
  fontSize: string;
  lineNumbers: boolean;
  padding: string;
}

export type Message =
  | "SUCCESS"
  | "ERROR"
  | "TOO_MANY_REQUESTS"
  | "LIMIT_REACHED"
  | "EMPTY_EDITOR"
  | "PENDING"
  | "IDLE";

export interface Store extends State {
  message: Message;
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
  setEditorState: (partialSnippet: Partial<Snippet>) => void;
  getEditorState: () => State;
}
