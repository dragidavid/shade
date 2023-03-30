import { useEffect, useRef } from "react";
import useSWRMutation from "swr/mutation";

import isEqual from "lodash.isequal";

import { fetcher } from "lib/fetcher";
import { useStore } from "lib/store";

import { State } from "lib/types";

export default function ChangeListener() {
  const prevState = useRef<State | null>(null);
  const pendingSave = useRef<boolean>(false);

  const state = useStore((state) => state.getEditorState());
  const update = useStore((state) => state.update);

  const { trigger, error, data } = useSWRMutation(
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

  const handleStateChange = () => {
    if (!isEqual(prevState.current, state)) {
      if (!pendingSave.current) {
        update("saveStatus", "PENDING");

        pendingSave.current = true;
      }

      const timeout = setTimeout(() => {
        if (!isEqual(prevState.current, state)) {
          prevState.current = state;

          trigger(state);
        }
        pendingSave.current = false;
      }, 2500);

      return () => {
        clearTimeout(timeout);
      };
    } else if (pendingSave.current) {
      update("saveStatus", "IDLE");

      pendingSave.current = false;
    }
  };

  useEffect(() => {
    if (prevState.current === null) {
      prevState.current = state;
    } else {
      const cleanup = handleStateChange();

      if (cleanup) {
        return cleanup;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, trigger, update]);

  useEffect(() => {
    if (error) {
      update("saveStatus", "ERROR");

      pendingSave.current = false;
    }
  }, [error, update]);

  useEffect(() => {
    if (data) {
      update("saveStatus", "SUCCESS");

      pendingSave.current = false;
    }
  }, [data, update]);

  return null;
}
