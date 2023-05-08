import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { Check, Code, X } from "lucide-react";

import Loader from "components/ui/Loader";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

import type { Message } from "lib/types";

interface ContentState {
  id: string;
  text: string;
  icon?: JSX.Element;
  additionalClasses?: string;
}

const CONTENT_STATES: Partial<Record<Message, ContentState>> = {
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
  UNAUTHORIZED: {
    id: "unauthorized",
    text: "You don't have access",
    additionalClasses: "text-red-400",
  },
  TOO_MANY_REQUESTS: {
    id: "too-many-requests",
    text: "Too many requests",
    additionalClasses: "text-red-400",
  },
  LIMIT_REACHED: {
    id: "limit-reached",
    text: "Limit reached",
    additionalClasses: "text-red-400",
  },
  EMPTY_EDITOR: {
    id: "empty-editor",
    text: "Add some code first",
    icon: <Code size={16} aria-hidden="true" />,
    additionalClasses: "text-orange-400",
  },
  CLIPBOARD_API_NOT_SUPPORTED: {
    id: "clipboard-api-not-supported",
    text: "Clipboard API not supported",
    additionalClasses: "text-red-400",
  },
  UNKNOWN_ERROR: {
    id: "unknown-error",
    text: "Something went wrong",
    additionalClasses: "text-red-400",
  },
  SNIPPET_NOT_FOUND: {
    id: "snippet-not-found",
    text: "Snippet not found",
    additionalClasses: "text-red-400",
  },
  INTERNAL_SERVER_ERROR: {
    id: "internal-server-error",
    text: "Internal server error",
    additionalClasses: "text-red-400",
  },
  PENDING: {
    id: "pending",
    text: "Saving...",
    icon: <Loader />,
  },
};

export default function Message() {
  const [showMessage, setShowMessage] = useState(false);
  const [content, setContent] = useState<ContentState | null>(null);

  const pathname = usePathname();

  const message = useStore((state) => state.message);
  const update = useStore((state) => state.update);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (message === "IDLE") {
      setShowMessage(false);
    } else {
      setShowMessage(true);
      setContent(CONTENT_STATES[message]!);

      if (message !== "PENDING") {
        timeoutId = setTimeout(() => {
          update("message", "IDLE");
        }, 2500);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message, update]);

  useEffect(() => {
    if (pathname === "/dashboard") {
      update("message", "IDLE");
    }
  }, [pathname, update]);

  return (
    <div className={cn("absolute left-1/2 -translate-x-1/2")}>
      <AnimatePresence mode="wait">
        {showMessage && content && (
          <Wrapper key={content.id} content={content} />
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
        "flex items-center justify-between gap-2 p-2 text-xs",
        "select-none",
        content.additionalClasses
      )}
    >
      {content.icon}
      {content.text}
    </motion.div>
  );
}
