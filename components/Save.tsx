/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from "react";
import useSWRMutation from "swr/mutation";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";

import { useStateContext } from "contexts/State";

import { exists } from "lib/exists";
import { fetcher } from "lib/fetcher";

import type { State } from "lib/types";

export default function Save() {
  const prevStateRef = useRef<State | null>(null);
  const shouldUpdate = useRef(false);
  const hasFailed = useRef(false);
  const cancellationTokenRef = useRef({ isCancelled: false });

  const { state, saveState, setSaveState } = useStateContext();

  const { trigger } = useSWRMutation(
    "/api/snippets/update",
    (url, { arg }) =>
      fetcher(url, {
        method: "PATCH",
        body: JSON.stringify(arg),
        headers: { "Content-Type": "application/json" },
      }),
    {
      revalidate: false,
    }
  );

  const debouncedSave = useCallback(
    debounce(async (changes, cancellationToken) => {
      if (cancellationToken.isCancelled) {
        return;
      }

      if (!isEqual(state, changes)) {
        if (saveState !== "PENDING") setSaveState("PENDING");

        try {
          await trigger(changes);

          if (!cancellationToken.isCancelled) {
            setSaveState("SUCCESS");
          }
        } catch (e) {
          if (!cancellationToken.isCancelled) {
            setSaveState("ERROR");
          }
        }
      } else {
        setSaveState("IDLE");
      }
    }, 3000),
    [state.id, shouldUpdate.current]
  );

  useEffect(() => {
    return () => {
      cancellationTokenRef.current.isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (saveState === "SUCCESS") {
      prevStateRef.current = state;
      shouldUpdate.current = !shouldUpdate.current;

      setSaveState("IDLE");
    }

    if (saveState === "ERROR") {
      hasFailed.current = !hasFailed.current;

      setSaveState("IDLE");
    }
  }, [state, saveState]);

  useEffect(() => {
    prevStateRef.current = state;

    setSaveState("IDLE");
  }, [state.id]);

  useEffect(() => {
    if (hasFailed.current) {
      hasFailed.current = false;
    }
  }, [state]);

  useEffect(() => {
    if (saveState === "PENDING" && isEqual(prevStateRef.current, state)) {
      debouncedSave.cancel();

      setSaveState("IDLE");
    }

    if (
      exists(state.id) &&
      !isEqual(prevStateRef.current, state) &&
      !hasFailed.current
    ) {
      cancellationTokenRef.current.isCancelled = true;
      cancellationTokenRef.current = { isCancelled: false };

      setSaveState("PENDING");

      debouncedSave(state, cancellationTokenRef.current);
    }
  }, [state, saveState]);

  return null;
}
