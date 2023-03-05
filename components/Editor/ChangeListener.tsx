/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from "react";
import useSWRMutation from "swr/mutation";

import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";

import { exists } from "lib/exists";
import { fetcher } from "lib/fetcher";
import { useAppState } from "lib/store";

import type { State } from "lib/types";

export default function ChangeListener() {
  const prevStateRef = useRef<State | null>(null);
  const shouldUpdate = useRef(false);
  const hasFailed = useRef(false);
  const cancellationTokenRef = useRef({ isCancelled: false });

  const saveStatus = useAppState((state) => state.saveStatus);
  const state = useAppState((state) => state.getEditorState());
  const update = useAppState((state) => state.update);

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
        if (saveStatus !== "PENDING") update("saveStatus", "PENDING");

        try {
          await trigger(changes);

          if (!cancellationToken.isCancelled) {
            update("saveStatus", "SUCCESS");
          }
        } catch (e) {
          if (!cancellationToken.isCancelled) {
            update("saveStatus", "ERROR");
          }
        }
      } else {
        update("saveStatus", "IDLE");
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
    if (saveStatus === "SUCCESS") {
      prevStateRef.current = state;
      shouldUpdate.current = !shouldUpdate.current;

      update("saveStatus", "IDLE");
    }

    if (saveStatus === "ERROR") {
      hasFailed.current = !hasFailed.current;

      update("saveStatus", "IDLE");
    }
  }, [state, saveStatus]);

  useEffect(() => {
    prevStateRef.current = state;

    update("saveStatus", "IDLE");
  }, [state.id]);

  useEffect(() => {
    if (hasFailed.current) {
      hasFailed.current = false;
    }
  }, [state]);

  useEffect(() => {
    if (saveStatus === "PENDING" && isEqual(prevStateRef.current, state)) {
      debouncedSave.cancel();

      update("saveStatus", "IDLE");
    }

    if (
      exists(state.id) &&
      !isEqual(prevStateRef.current, state) &&
      !hasFailed.current
    ) {
      cancellationTokenRef.current.isCancelled = true;
      cancellationTokenRef.current = { isCancelled: false };

      update("saveStatus", "PENDING");

      debouncedSave(state, cancellationTokenRef.current);
    }
  }, [state, saveStatus]);

  return null;
}
