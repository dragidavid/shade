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

export type Settings = {
  language: string;
  theme: string;
  fontStyle: string;
  lineNumbers: boolean;
  padding: string;
};

export type Snippet = {
  id: string;
  title: string | null;
  code: string;
  settings: Settings;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type State = {
  id: string | null;
  title: string | null;
  code: string;
  language: LanguageDefinition;
  theme: ThemeDefinition;
  fontStyle: FontDefinition;
  lineNumbers: boolean;
  padding: ChoiceDefinition;
};
