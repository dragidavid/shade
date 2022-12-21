import { createContext, FC, ReactNode, useContext, useState } from "react";

import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_THEMES,
  SUPPORTED_PADDING_CHOICES,
  SUPPORTED_FONT_STYLES,
} from "lib/values";

import type {
  LanguageDefinition,
  ThemeDefinition,
  ChoiceDefinition,
  FontDefinition,
} from "lib/types";

interface SettingsContextProps {
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

const SettingsContext = createContext<SettingsContextProps>(
  {} as SettingsContextProps
);

const useSettingsContext = () => useContext(SettingsContext);

type SettingsProviderProps = {
  children: ReactNode;
};

const SettingsProvider: FC<SettingsProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageDefinition>(
    SUPPORTED_LANGUAGES.at(0)!
  );
  const [theme, setTheme] = useState<ThemeDefinition>(SUPPORTED_THEMES.at(-1)!);
  const [fontStyle, setFontStyle] = useState<FontDefinition>(
    SUPPORTED_FONT_STYLES.at(0)!
  );
  const [lineNumbers, setLineNumbers] = useState<boolean>(true);
  const [padding, setPadding] = useState<ChoiceDefinition>(
    SUPPORTED_PADDING_CHOICES[1]
  );

  return (
    <SettingsContext.Provider
      value={{
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
    </SettingsContext.Provider>
  );
};

export { SettingsProvider, useSettingsContext };
