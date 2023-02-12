import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ReloadIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

import { useStateContext } from "contexts/State";

import { exists } from "lib/exists";

const CONTENT = {
  SUCCESS: (
    <span className="flex items-center justify-between gap-2 text-green-400">
      <CheckIcon className="h-3 w-3" aria-hidden="true" />
      Saved successfully
    </span>
  ),
  ERROR: (
    <span className="flex items-center justify-between gap-2 text-red-400">
      <Cross2Icon className="h-3 w-3" aria-hidden="true" />
      Failed to save
    </span>
  ),
  PENDING: (
    <span className="flex items-center justify-between gap-2">
      <ReloadIcon className="h-3 w-3 animate-spin" aria-hidden="true" />
      Saving...
    </span>
  ),
};

export default function SaveStateIndicator() {
  const [showMessage, setShowMessage] = useState(false);
  const [content, setContent] = useState<JSX.Element | null>(null);

  const { pathname } = useRouter();
  const { data: session, status } = useSession();
  const { saveState } = useStateContext();

  useEffect(() => {
    if (saveState === "SUCCESS" || saveState === "ERROR") {
      setShowMessage(true);

      setContent(CONTENT[saveState]);

      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  }, [saveState]);

  useEffect(() => {
    if (saveState === "PENDING" && showMessage) {
      setShowMessage(false);
    }
  }, [saveState, showMessage]);

  if (pathname === "/" || !exists(session) || status === "unauthenticated")
    return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2">
      <AnimatePresence mode="wait">
        {showMessage && <Wrapper content={content!} key="end" />}
        {saveState === "PENDING" && !showMessage && (
          <Wrapper content={CONTENT["PENDING"]} key="pending" />
        )}
      </AnimatePresence>
    </div>
  );
}

function Wrapper({ content }: { content: JSX.Element }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
      className="select-none p-2 text-xs"
    >
      {content}
    </motion.div>
  );
}
