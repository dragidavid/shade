import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import isEqual from "lodash.isequal";

import { exists } from "lib/exists";

import type { FC, ReactNode } from "react";
import type { State, SaveState } from "lib/types";

interface StateContextProps {
  state: State;
  setState: (_: State) => void;
  saveState: SaveState;
  setSaveState: (_: SaveState) => void;
}

const StateContext = createContext<StateContextProps>({} as StateContextProps);

const useStateContext = () => useContext(StateContext);

type StateProviderProps = {
  initialState: StateContextProps["state"];
  children: ReactNode;
};

const StateProvider: FC<StateProviderProps> = ({ initialState, children }) => {
  const [state, setState] = useState<State>(initialState);
  const [saveState, setSaveState] = useState<SaveState>("IDLE");

  const { pathname } = useRouter();

  useEffect(() => {
    if (pathname === "/") {
      setSaveState("IDLE");
    }
  }, [pathname]);

  useEffect(() => {
    setSaveState("IDLE");
  }, [state.id]);

  useEffect(() => {
    if (!isEqual(state, initialState) && exists(initialState.id)) {
      setState(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState.id]);

  return (
    <StateContext.Provider
      value={{
        state,
        setState,
        saveState,
        setSaveState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export { StateProvider, useStateContext };
