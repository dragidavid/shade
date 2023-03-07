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
  label: string;
  class: string;
};

export type State = {
  id: string | null;
  title: string;
  code: string;
  language: LanguageDefinition;
  theme: ThemeDefinition;
  fontStyle: FontDefinition;
  lineNumbers: boolean;
  padding: ChoiceDefinition;
};

export interface SnippetSettings extends Prisma.JsonObject {
  language: string;
  theme: string;
  fontStyle: string;
  lineNumbers: boolean;
  padding: string;
}

export type SaveStatus = "SUCCESS" | "ERROR" | "PENDING" | "IDLE";

export interface Store extends State {
  saveStatus: SaveStatus;
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
