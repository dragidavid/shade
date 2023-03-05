"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

import { Loader2, Check, X } from "lucide-react";

import { cn } from "lib/cn";
import { useAppState } from "lib/store";

interface ContentState {
  id: string;
  text: string;
  icon: JSX.Element;
  additionalClasses?: string;
}

const CONTENT_STATES: Record<string, ContentState> = {
  SUCCESS: {
    id: "success",
    text: "Changes saved",
    icon: <Check size={16} aria-hidden="true" />,
    additionalClasses: "text-green-400",
  },
  ERROR: {
    id: "error",
    text: "Failed to save",
    icon: <X size={16} aria-hidden="true" />,
    additionalClasses: "text-red-400",
  },
  PENDING: {
    id: "pending",
    text: "Saving...",
    icon: <Loader2 size={16} className="animate-spin" aria-hidden="true" />,
  },
};

export default function SaveStatus() {
  const [showMessage, setShowMessage] = useState(false);
  const [content, setContent] = useState<ContentState | null>(null);

  const pathname = usePathname();

  const { data: session } = useSession();

  const saveStatus = useAppState((state) => state.saveStatus);

  useEffect(() => {
    if (saveStatus === "SUCCESS" || saveStatus === "ERROR") {
      setShowMessage(true);

      setContent(CONTENT_STATES[saveStatus]);

      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  }, [saveStatus]);

  useEffect(() => {
    if (saveStatus === "PENDING" && showMessage) {
      setShowMessage(false);
    }
  }, [saveStatus, showMessage]);

  if (pathname === "/dashboard" || !session) return null;

  return (
    <div className={cn("absolute left-1/2 -translate-x-1/2")}>
      <AnimatePresence mode="wait">
        {showMessage && <Wrapper content={content!} key="idle" />}

        {saveStatus === "PENDING" && !showMessage && (
          <Wrapper
            content={CONTENT_STATES["PENDING"]}
            key={CONTENT_STATES["PENDING"].id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Wrapper({ content }: { content: ContentState }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.1 }}
      className={cn(
        "flex items-center justify-between gap-2 p-2",
        "select-none",
        content.additionalClasses
      )}
    >
      {content.icon}
      {content.text}
    </motion.div>
  );
}
