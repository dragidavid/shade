import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

import { Check, X } from "lucide-react";

import Loader from "components/ui/Loader";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

interface ContentState {
  id: string;
  text: string;
  icon?: JSX.Element;
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
    icon: <Loader />,
  },
  IMAGE_COPY: {
    id: "image_copy",
    text: "Image copied to clipboard",
  },
  LINK_COPY: {
    id: "link_copy",
    text: "Link copied",
  },
};

export default function SaveStatus() {
  const [showMessage, setShowMessage] = useState(false);
  const [content, setContent] = useState<ContentState | null>(null);

  const pathname = usePathname();

  const { data: session } = useSession();

  const saveStatus = useStore((state) => state.saveStatus);
  const update = useStore((state) => state.update);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (saveStatus === "IDLE") {
      setShowMessage(false);
    } else {
      setShowMessage(true);
      setContent(CONTENT_STATES[saveStatus]);

      if (saveStatus !== "PENDING") {
        timeoutId = setTimeout(() => {
          update("saveStatus", "IDLE");
        }, 2500);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [saveStatus, update]);

  if (pathname === "/dashboard" || !session) return null;

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
