/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from "react";
import useSWRMutation from "swr/mutation";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";

import { useStateContext } from "contexts/State";

import { exists } from "lib/exists";

export default function Save() {
  const { state, saveState, setSaveState } = useStateContext();
  const prevStateRef = useRef(state);

  const { trigger } = useSWRMutation(
    "/api/snippets/update",
    (url, { arg }) =>
      fetch(url, {
        method: "PATCH",
        body: JSON.stringify(arg),
        headers: { "Content-Type": "application/json" },
      }),
    {
      onSuccess: async (data) => {
        if (!data.ok) {
          return;
        }

        setSaveState("SUCCESS");
      },
      onError: (error) => {
        // TODO - Handle error
        console.log(error);

        setSaveState("ERROR");
      },
    }
  );

  const debouncedSave = useCallback(
    debounce(async (changes) => {
      if (!isEqual(state, changes)) {
        if (saveState !== "PENDING") setSaveState("PENDING");

        await trigger(changes);
      } else {
        setSaveState("IDLE");
      }
    }, 3000),
    [state.id]
  );

  /**
   * 1. If the save was successful, update the previous state to the current state
   * 2. Reset the save state to IDLE
   */
  useEffect(() => {
    if (saveState === "SUCCESS") {
      prevStateRef.current = state;

      setSaveState("IDLE");
    }
  }, [state, saveState, setSaveState]);

  /**
   * This should only run if the state id changes which means we're on a new snippet
   */
  useEffect(() => {
    prevStateRef.current = state;

    setSaveState("IDLE");
  }, [state.id]);

  useEffect(() => {
    if (exists(state.id) && !isEqual(prevStateRef.current, state)) {
      setSaveState("PENDING");

      debouncedSave(state);
    }
  }, [state, setSaveState, debouncedSave]);

  return null;
}
