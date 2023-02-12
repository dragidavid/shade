/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from "react";
import useSWRMutation from "swr/mutation";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";

import { useStateContext } from "contexts/State";

import { exists } from "lib/exists";

import type { State } from "lib/types";

export default function Save() {
  const prevStateRef = useRef<State | null>(null);
  const shouldUpdate = useRef(false);

  const { state, saveState, setSaveState } = useStateContext();

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
    [state.id, shouldUpdate.current]
  );

  /**
   * 1. If the save was successful, update the previous state to the current state
   * 2. Flip the shouldUpdate ref so that the debouncedSave function will run
   * 3. Reset the save state to IDLE
   */
  useEffect(() => {
    if (saveState === "SUCCESS") {
      prevStateRef.current = state;
      shouldUpdate.current = !shouldUpdate.current;

      setSaveState("IDLE");
    }
  }, [state, saveState]);

  /**
   * This should only run if the state id changes which means we're on a new snippet
   */
  useEffect(() => {
    prevStateRef.current = state;

    setSaveState("IDLE");
  }, [state.id]);

  useEffect(() => {
    /**
     * If the save state is pending and the previous state is equal to the current state,
     * cancel the debouncedSave function and reset the save state to IDLE
     */
    if (saveState === "PENDING" && isEqual(prevStateRef.current, state)) {
      debouncedSave.cancel();

      setSaveState("IDLE");
    }

    /**
     * If the state id exists and the previous state is not equal to the current state,
     * set the save state to PENDING and run the debouncedSave function
     */
    if (exists(state.id) && !isEqual(prevStateRef.current, state)) {
      setSaveState("PENDING");

      debouncedSave(state);
    }
  }, [state, saveState]);

  return null;
}
