import type { LanguageSupport as LS, StreamParser } from "@codemirror/language";
import type { LanguageDefinition } from "lib/types";

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
