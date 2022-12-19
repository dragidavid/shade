import { createContext, FC, ReactNode, useContext, useState } from "react";

import { SUPPORTED_LANGUAGES } from "lib/languages";
import { SUPPORTED_THEMES, SUPPORTED_PADDING_CHOICES } from "lib/themes";

import type {
  LanguageDefinition,
  ThemeDefinition,
  ChoiceDefinition,
} from "lib/types";

interface SettingsContextProps {
  language: LanguageDefinition;
  setLanguage: (_: LanguageDefinition) => void;
  theme: ThemeDefinition;
  setTheme: (_: ThemeDefinition) => void;
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

const languages = SUPPORTED_LANGUAGES;
const themes = SUPPORTED_THEMES;
const paddingChoices = SUPPORTED_PADDING_CHOICES;

const SettingsProvider: FC<SettingsProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageDefinition>(languages[0]);
  const [theme, setTheme] = useState<ThemeDefinition>(themes[4]);
  const [lineNumbers, setLineNumbers] = useState<boolean>(true);
  const [padding, setPadding] = useState<ChoiceDefinition>(paddingChoices[1]);

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
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
