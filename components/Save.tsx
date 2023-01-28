import { useCallback, useEffect } from "react";
import useSWRMutation from "swr/mutation";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";

import { useStateContext } from "contexts/State";

import { exists } from "lib/exists";

export default function Save() {
  const { state, setSaveState } = useStateContext();

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (changes) => {
      if (!isEqual(state, changes)) {
        setSaveState("PENDING");

        await trigger(changes);
      } else {
        setSaveState("IDLE");
      }
    }, 3000),
    [state.id]
  );

  useEffect(() => {
    if (exists(state.id)) {
      setSaveState("PENDING");

      debouncedSave(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, debouncedSave]);

  return null;
}
