import { generateColors } from "lib/colors";

import type { LanguageSupport as LS, StreamParser } from "@codemirror/language";

import type {
  LanguageDefinition,
  ThemeDefinition,
  ChoiceDefinition,
  FontDefinition,
} from "lib/types";

const importLegacy = () =>
  import("@codemirror/language").then(({ LanguageSupport, StreamLanguage }) => {
    return function legacy(parser: StreamParser<unknown>): LS {
      return new LanguageSupport(StreamLanguage.define(parser));
    };
  });

export const SUPPORTED_LANGUAGES: LanguageDefinition[] = [
  {
    id: "typescript",
    label: "TypeScript",
    extension: () =>
      import("@codemirror/lang-javascript").then(({ javascript }) =>
        javascript({ jsx: true, typescript: true })
      ),
  },
  {
    id: "javascript",
    label: "JavaScript",
    extension: () =>
      import("@codemirror/lang-javascript").then(({ javascript }) =>
        javascript({ jsx: true })
      ),
  },
  {
    id: "java",
    label: "Java",
    extension: () => import("@codemirror/lang-java").then(({ java }) => java()),
  },
  {
    id: "kotlin",
    label: "Kotlin",
    extension: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/clike"),
      ]).then(([cb, m]) => cb(m.kotlin)),
  },
  {
    id: "css",
    label: "CSS",
    extension: () => import("@codemirror/lang-css").then(({ css }) => css()),
  },
  {
    id: "html",
    label: "HTML",
    extension: () =>
      import("@codemirror/lang-html").then(({ html }) =>
        html({ matchClosingTags: true, autoCloseTags: true })
      ),
  },
  {
    id: "php",
    label: "PHP",
    extension: () => import("@codemirror/lang-php").then(({ php }) => php()),
  },
  {
    id: "python",
    label: "Python",
    extension: () =>
      import("@codemirror/lang-python").then(({ python }) => python()),
  },
  {
    id: "markdown",
    label: "Markdown",
    extension: () =>
      import("@codemirror/lang-markdown").then(({ markdown }) => markdown()),
  },
  {
    id: "rust",
    label: "Rust",
    extension: () => import("@codemirror/lang-rust").then(({ rust }) => rust()),
  },
  {
    id: "cpp",
    label: "C++",
    extension: () => import("@codemirror/lang-cpp").then(({ cpp }) => cpp()),
  },
  {
    id: "xml",
    label: "XML",
    extension: () => import("@codemirror/lang-xml").then(({ xml }) => xml()),
  },
  {
    id: "ruby",
    label: "Ruby",
    extension: () =>
      Promise.all([
        importLegacy(),
        import("@codemirror/legacy-modes/mode/ruby"),
      ]).then(([cb, m]) => cb(m.ruby)),
  },
  {
    id: "json",
    label: "JSON",
    extension: () => import("@codemirror/lang-json").then(({ json }) => json()),
  },
  {
    id: "sql",
    label: "SQL",
    extension: () => import("@codemirror/lang-sql").then(({ sql }) => sql()),
  },
];

export const SUPPORTED_THEMES: ThemeDefinition[] = [
  {
    id: "sky",
    label: "Sky",
    baseColors: ["#38bdf8", "#3b82f6"],
  },
  {
    id: "cotton_candy",
    label: "Cotton Candy",
    baseColors: ["#c4b5fd", "#c084fc"],
  },
  {
    id: "smoke",
    label: "Smoke",
    baseColors: ["#274edd", "#000000"],
  },
  {
    id: "honey",
    label: "Honey",
    baseColors: ["#fcd34d", "#f97316"],
  },
  {
    id: "jade",
    label: "Jade",
    baseColors: ["#2dd4bf", "#059669"],
  },
  {
    id: "bubblegum",
    label: "Bubblegum",
    baseColors: ["#d946ef", "#db2777"],
  },
  {
    id: "salem",
    label: "Salem",
    baseColors: ["#581c87", "#6d28d9"],
  },
];

export const SUPPORTED_FONT_STYLES: FontDefinition[] = [
  {
    id: "fira_code",
    label: "Fira Code",
    variable: "var(--font-fira-code)",
    class: "font-fira-code",
  },
  {
    id: "jetbrains_mono",
    label: "JetBrains Mono",
    variable: "var(--font-jetbrains-mono)",
    class: "font-jetbrains-mono",
  },
  {
    id: "inconsolata",
    label: "Inconsolata",
    variable: "var(--font-inconsolata)",
    class: "font-inconsolata",
  },
  {
    id: "source_code_pro",
    label: "Source Code Pro",
    variable: "var(--font-source-code-pro)",
    class: "font-source-code-pro",
  },
  {
    id: "ibm_plex_mono",
    label: "IBM Plex Mono",
    variable: "var(--font-ibm-plex-mono)",
    class: "font-ibm-plex-mono",
  },
  {
    id: "kode_mono",
    label: "Kode Mono",
    variable: "var(--font-kode-mono)",
    class: "font-kode-mono",
  },
];

export const SUPPORTED_FONT_SIZES: ChoiceDefinition[] = [
  { id: "xs", label: "12", value: 12 },
  { id: "sm", label: "14", value: 14 },
  { id: "md", label: "16", value: 16 },
];

export const SUPPORTED_PADDING_CHOICES: ChoiceDefinition[] = [
  { id: "sm", label: "16", value: 16, class: "p-4" },
  { id: "md", label: "32", value: 32, class: "p-8" },
  { id: "lg", label: "64", value: 64, class: "p-16" },
  { id: "xl", label: "128", value: 128, class: "p-32" },
];
