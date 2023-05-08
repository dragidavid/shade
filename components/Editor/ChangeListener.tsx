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

  const {
    trigger: updateSnippet,
    error: updateError,
    data: updatedSnippet,
  } = useSWRMutation(
    "/api/snippets",
    (url, { arg }: { arg: State }) =>
      fetcher(url, {
        method: "PATCH",
        body: JSON.stringify(arg),
        headers: {
          "X-Update-Type": "full",
        },
      }),
    {
      revalidate: false,
    }
  );

  const handleStateChange = () => {
    if (!isEqual(prevState.current, state)) {
      if (!pendingSave.current) {
        update("message", "PENDING");

        pendingSave.current = true;
      }

      const timeout = setTimeout(() => {
        if (!isEqual(prevState.current, state)) {
          prevState.current = state;

          updateSnippet(state);
        }

        pendingSave.current = false;
      }, 2500);

      return () => {
        clearTimeout(timeout);
      };
    } else if (pendingSave.current) {
      update("message", "IDLE");

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
  }, [state, updateSnippet, update]);

  useEffect(() => {
    if (updateError) {
      update("message", "ERROR");

      pendingSave.current = false;
    }
  }, [updateError, update]);

  useEffect(() => {
    if (updatedSnippet) {
      update("message", "SUCCESS");

      pendingSave.current = false;
    }
  }, [updatedSnippet, update]);

  return null;
}
