import chroma from "chroma-js";

import type { LanguageSupport as LS, StreamParser } from "@codemirror/language";

import type {
  LanguageDefinition,
  ThemeDefinition,
  FontFamilyDefinition,
  AppStatus,
  AppState,
} from "lib/types";

const importLegacy = () =>
  import("@codemirror/language").then(({ LanguageSupport, StreamLanguage }) => {
    return function legacy(parser: StreamParser<unknown>): LS {
      return new LanguageSupport(StreamLanguage.define(parser));
    };
  });

export const BASE_LANGUAGES: LanguageDefinition[] = [
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

export const BASE_THEMES: ThemeDefinition[] = [
  {
    id: "sky",
    label: "Sky",
    baseColors: ["#89f7fe", "#66a6ff"],
  },
  {
    id: "cotton_candy",
    label: "Cotton Candy",
    baseColors: ["#f6f3ff", "#cd9cf2"],
  },
  {
    id: "stone",
    label: "Stone",
    baseColors: ["#243949", "#517fa4"],
  },
  {
    id: "honey",
    label: "Honey",
    baseColors: ["#f9d423", "#f83600"],
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

export const BASE_FONT_FAMILIES: FontFamilyDefinition[] = [
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

export const BASE_FONT_SIZES: string[] = ["12", "14", "16"];

export const BASE_PADDING_VALUES: string[] = ["16", "32", "64", "128"];

export const BASE_COLOR_MODES: string[] = [
  "rgb",
  "lrgb",
  "lch",
  "hcl",
  "hsv",
  "hsl",
  "lab",
];

export const DEFAULT_VALUES: AppStatus & AppState = {
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
};
