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

export type ChoiceDefinition = {
  id: string;
  label: string;
  class: string;
};
