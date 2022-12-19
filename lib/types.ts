import { Extension } from "@codemirror/state";

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

export type LanguageDefinition = {
  id: string;
  label: string;
  extension: () => Promise<Extension>;
};
