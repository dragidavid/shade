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
  state: {
    code: string;
    language: LanguageDefinition;
    theme: ThemeDefinition;
    fontStyle: FontDefinition;
    lineNumbers: boolean;
    padding: ChoiceDefinition;
  };
  setState: (_: StateContextProps["state"]) => void;
}

const StateContext = createContext<StateContextProps>({} as StateContextProps);

const useStateContext = () => useContext(StateContext);

type StateProviderProps = {
  children: ReactNode;
};

const StateProvider: FC<StateProviderProps> = ({ children }) => {
  const [state, setState] = useState<StateContextProps["state"]>({
    code: INITIAL_CODE,
    language: SUPPORTED_LANGUAGES.at(0)!,
    theme: SUPPORTED_THEMES.at(-1)!,
    fontStyle: SUPPORTED_FONT_STYLES.at(0)!,
    lineNumbers: true,
    padding: SUPPORTED_PADDING_CHOICES.at(1)!,
  });

  return (
    <StateContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export { StateProvider, useStateContext };
