import { useCallback } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { ReloadIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

import { useStateContext } from "contexts/State";

import { exists } from "lib/exists";

export default function SaveStateIndicator() {
  const { saveState } = useStateContext();

  const { pathname } = useRouter();
  const { data: session, status } = useSession();

  const getContent = useCallback(() => {
    switch (saveState) {
      case "PENDING":
        return (
          <>
            <ReloadIcon className="h-3 w-3 animate-spin" aria-hidden="true" />
            Saving...
          </>
        );
      case "SUCCESS":
        return (
          <>
            <CheckIcon className="h-3 w-3" aria-hidden="true" />
            Saved successfully
          </>
        );
      case "ERROR":
        return (
          <>
            <Cross2Icon className="h-3 w-3" aria-hidden="true" />
            Failed to save
          </>
        );
      default:
        return null;
    }
  }, [saveState]);

  if (pathname === "/" || !exists(session) || status === "unauthenticated")
    return <div />;

  return (
    <div
      className={clsx(
        "flex select-none items-center justify-between gap-2 rounded-lg p-2 text-xs",
        saveState === "SUCCESS" && "text-green-400",
        saveState === "ERROR" && "text-red-400"
      )}
    >
      {getContent()}
    </div>
  );
}
