/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from "react";
import useSWRMutation from "swr/mutation";

import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";

import { fetcher } from "lib/fetcher";
import { useStore } from "lib/store";

import type { State } from "lib/types";

export default function ChangeListener() {
  const prevStateRef = useRef<State | null>(null);
  const shouldUpdate = useRef(false);
  const hasFailed = useRef(false);

  const saveStatus = useStore((state) => state.saveStatus);
  const state = useStore((state) => state.getEditorState());
  const update = useStore((state) => state.update);

  const { trigger } = useSWRMutation(
    "/api/snippets/update",
    (url, { arg }: { arg: State }) =>
      fetcher(url, {
        method: "PATCH",
        body: JSON.stringify(arg),
        headers: { "Content-Type": "application/json" },
      }),
    {
      revalidate: false,
    }
  );

  const resetFailedSaveRef = useCallback(
    debounce(() => {
      hasFailed.current = false;
    }, 0),
    []
  );

  const debouncedSave = useCallback(
    debounce(async (changes: State) => {
      if (!isEqual(state, changes) && !hasFailed.current) {
        if (saveStatus !== "PENDING") update("saveStatus", "PENDING");

        try {
          await trigger(changes);

          update("saveStatus", "SUCCESS");
        } catch (e) {
          update("saveStatus", "ERROR");
        }
      } else {
        update("saveStatus", "IDLE");
      }
    }, 2500),
    [state.id, shouldUpdate.current]
  );

  // When a new snippet is viewed, set the previous state to the current state
  useEffect(() => {
    prevStateRef.current = state;

    update("saveStatus", "IDLE");
  }, [state.id]);

  // Handle success and error states
  useEffect(() => {
    if (saveStatus === "SUCCESS") {
      prevStateRef.current = state;
      shouldUpdate.current = !shouldUpdate.current;

      update("saveStatus", "IDLE");
    }

    if (saveStatus === "ERROR") {
      hasFailed.current = true;

      update("saveStatus", "IDLE");
    }
  }, [saveStatus]);

  // If the user reverted the changes during the 3 second debounce, cancel the function
  useEffect(() => {
    if (saveStatus === "PENDING" && isEqual(prevStateRef.current, state)) {
      debouncedSave.cancel();

      update("saveStatus", "IDLE");
    }
  }, [state, saveStatus]);

  useEffect(() => {
    if (hasFailed.current) {
      resetFailedSaveRef();
    }

    if (
      state.id &&
      !isEqual(prevStateRef.current, state) &&
      !hasFailed.current
    ) {
      update("saveStatus", "PENDING");

      debouncedSave(state);
    }
  }, [state]);

  return null;
}
