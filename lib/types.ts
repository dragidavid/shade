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
  language: LanguageDefinition["id"];
  theme: ThemeDefinition["id"];
  fontStyle: FontDefinition["id"];
  lineNumbers: boolean;
  padding: ChoiceDefinition["id"];
};

export type Snippet = {
  id: string;
  title: string | null;
  content: string | null;
  settings: Settings;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};
