import { createContext, useContext, useState } from "react";

import type { FC, ReactNode } from "react";

import {
  INITIAL_CODE,
  SUPPORTED_LANGUAGES,
  SUPPORTED_THEMES,
  SUPPORTED_FONT_STYLES,
  SUPPORTED_PADDING_CHOICES,
} from "lib/values";

import type {
  LanguageDefinition,
  ThemeDefinition,
  FontDefinition,
  ChoiceDefinition,
} from "lib/types";

interface StateContextProps {
  code: string;
  setCode: (_: string) => void;
  language: LanguageDefinition;
  setLanguage: (_: LanguageDefinition) => void;
  theme: ThemeDefinition;
  setTheme: (_: ThemeDefinition) => void;
  fontStyle: FontDefinition;
  setFontStyle: (_: FontDefinition) => void;
  lineNumbers: boolean;
  setLineNumbers: (_: boolean) => void;
  padding: ChoiceDefinition;
  setPadding: (_: ChoiceDefinition) => void;
}

const StateContext = createContext<StateContextProps>({} as StateContextProps);

const useStateContext = () => useContext(StateContext);

type StateProviderProps = {
  children: ReactNode;
};

const StateProvider: FC<StateProviderProps> = ({ children }) => {
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [language, setLanguage] = useState<LanguageDefinition>(
    SUPPORTED_LANGUAGES.at(0)!
  );
  const [theme, setTheme] = useState<ThemeDefinition>(SUPPORTED_THEMES.at(-1)!);
  const [fontStyle, setFontStyle] = useState<FontDefinition>(
    SUPPORTED_FONT_STYLES.at(0)!
  );
  const [lineNumbers, setLineNumbers] = useState<boolean>(true);
  const [padding, setPadding] = useState<ChoiceDefinition>(
    SUPPORTED_PADDING_CHOICES.at(1)!
  );

  return (
    <StateContext.Provider
      value={{
        code,
        setCode,
        language,
        setLanguage,
        theme,
        setTheme,
        fontStyle,
        setFontStyle,
        lineNumbers,
        setLineNumbers,
        padding,
        setPadding,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export { StateProvider, useStateContext };
