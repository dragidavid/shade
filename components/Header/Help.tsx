import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { Keyboard } from "lucide-react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import Kbd from "components/ui/Kbd";
import Tooltip from "components/ui/Tooltip";

import { cn } from "lib/cn";

const SHORTCUTS = [
  {
    key: "sign-in",
    scope: ["unauthenticated"],
    label: "Sign in",
    kbd: ["L"],
  },
  {
    key: "new-snippet",
    scope: ["dashboard"],
    label: "New snippet",
    kbd: ["N"],
  },
  {
    key: "rename-snippet",
    scope: ["dashboard"],
    label: "Rename snippet",
    kbd: ["hover", "R"],
  },
  {
    key: "copy-snippet-link",
    scope: ["dashboard"],
    label: "Copy link",
    kbd: ["hover", "C"],
  },
  {
    key: "delete-snippet",
    scope: ["dashboard"],
    label: "Delete snippet",
    kbd: ["hover", "D"],
  },
  {
    key: "focus-editor",
    scope: ["authenticated", "unauthenticated"],
    label: "Focus text editor",
    kbd: ["F"],
  },
  {
    key: "blur-editor",
    scope: ["authenticated", "unauthenticated"],
    label: "Unfocus editor",
    kbd: ["Esc"],
  },
  {
    key: "focus-title-input",
    scope: ["authenticated", "unauthenticated"],
    label: "Focus title input",
    kbd: ["T"],
  },
  {
    key: "copy-link",
    scope: ["authenticated"],
    label: "Copy link",
    kbd: ["⌘", "shift", "C"],
  },
  {
    key: "copy-image",
    scope: ["authenticated", "unauthenticated"],
    label: "Copy image",
    kbd: ["⌘", "C"],
  },
  {
    key: "download-image",
    scope: ["authenticated", "unauthenticated"],
    label: "Download image as PNG",
    kbd: ["⌘", "S"],
  },
  {
    key: "dashboard",
    scope: ["authenticated"],
    label: "Dashboard",
    kbd: ["B"],
  },
  {
    key: "user-menu",
    scope: ["authenticated", "dashboard"],
    label: "Open user menu",
    kbd: ["U"],
  },
  {
    key: "sign-out",
    scope: ["authenticated", "dashboard"],
    label: "Sign out",
    kbd: ["Q"],
  },
  {
    key: "help",
    scope: ["authenticated", "unauthenticated", "dashboard"],
    label: "Open shortcuts dialog",
    kbd: ["?"],
  },
];

export default function Help() {
  const [localDialogOpen, setLocalDialogOpen] = useState<boolean>(false);

  const pathname = usePathname();

  const { status: sessionStatus } = useSession();

  const shortcuts = SHORTCUTS.filter((shortcut) => {
    if (pathname === "/dashboard" && shortcut.scope.includes("dashboard")) {
      return true;
    }

    if (pathname !== "/dashboard" && shortcut.scope.includes(sessionStatus)) {
      return true;
    }
  });

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const targetElement = event.target as HTMLElement;

      if (
        targetElement.getAttribute("role") === "textbox" ||
        (targetElement.tagName === "INPUT" &&
          (targetElement as HTMLInputElement).type === "text") ||
        localDialogOpen
      ) {
        return;
      }

      if (event.key === "?") {
        setLocalDialogOpen(true);
      }
    },
    [localDialogOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={cn("relative mr-5 pr-5")}>
      <DialogPrimitive.Root
        open={localDialogOpen}
        onOpenChange={setLocalDialogOpen}
      >
        <Tooltip side="bottom" sideOffset={8} kbd={["?"]}>
          <DialogPrimitive.Trigger asChild>
            <button
              type="button"
              className={cn(
                "rounded-lg p-2",
                "select-none outline-none",
                "transition-all duration-100 ease-in-out",
                "hover:bg-white/20 hover:text-almost-white",
                "focus:text-almost-white focus:outline-1 focus:outline-offset-2 focus:outline-almost-white"
              )}
            >
              <Keyboard size={18} aria-hidden="true" />
            </button>
          </DialogPrimitive.Trigger>
        </Tooltip>

        <DialogPrimitive.Portal>
          <div
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center"
            )}
          >
            <DialogPrimitive.Overlay
              className={cn(
                "fixed inset-0 z-50",
                "bg-black/50 backdrop-blur",
                "transition-all duration-100 ease-in-out",
                "radix-state-open:animate-in radix-state-open:fade-in",
                "radix-state-closed:animate-out radix-state-closed:fade-out"
              )}
            />

            <DialogPrimitive.Content
              className={cn(
                "z-50 w-[360px] min-w-min rounded-xl p-6",
                "outline-none",
                "border border-white/20 bg-black shadow-xl",
                "transition-all duration-100 ease-in-out",
                "radix-state-open:animate-in radix-state-open:fade-in radix-state-open:zoom-in-75"
              )}
            >
              <div>
                <DialogPrimitive.Title
                  className={cn(
                    "mb-4 text-lg font-extrabold",
                    "text-almost-white"
                  )}
                >
                  Keyboard shortcuts
                </DialogPrimitive.Title>

                <div className={cn("flex flex-col gap-5")}>
                  {shortcuts.map(({ key, label, kbd }) => (
                    <div
                      key={key}
                      className={cn("flex w-full items-center justify-between")}
                    >
                      <span>{label}</span>
                      <span>
                        <Kbd keys={...kbd} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </DialogPrimitive.Content>
          </div>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <div
        className={cn(
          "absolute right-0 top-0 h-full w-px",
          "bg-gradient-to-b from-transparent via-white/20 to-transparent"
        )}
      />
    </div>
  );
}
