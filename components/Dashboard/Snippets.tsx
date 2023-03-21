"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import useSWRMutation from "swr/mutation";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

import { Edit3, Trash } from "lucide-react";

import RenameDialog from "components/Dashboard/RenameDialog";
import DeleteDialog from "components/Dashboard/DeleteDialog";

import ThemeBubble from "components/ui/ThemeBubble";
import Kbd from "components/ui/Kbd";

import { SUPPORTED_THEMES } from "lib/values";

import { cn } from "lib/cn";
import { find } from "lib/find";
import { fetcher } from "lib/fetcher";

import type { Snippet } from "@prisma/client";
import type { SnippetSettings } from "lib/types";

interface DialogProps {
  type: "RENAME" | "DELETE";
  id: string;
  title: string | null;
}

export default function Snippets({ snippets }: { snippets: Snippet[] }) {
  const [localSnippets, setLocalSnippets] = useState(snippets);
  const [localDialogOpen, setLocalDialogOpen] = useState<boolean>(false);
  const [dialogProps, setDialogProps] = useState<DialogProps | null>(null);
  const [activeElement, setActiveElement] = useState<HTMLAnchorElement | null>(
    null
  );

  const listContainerRef = useRef<HTMLUListElement>(null);
  const activeElementRef = useRef<HTMLAnchorElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!localDialogOpen && activeElement && !e.metaKey && !e.ctrlKey) {
        const id = activeElement.id;
        const title = (
          activeElement.querySelector('[data-id="title"]') as HTMLSpanElement
        ).innerText;

        if ((e.key === "r" || e.key === "d") && id && title) {
          e.preventDefault();

          if (e.key === "r") {
            setDialogProps({ type: "RENAME", id, title });
          } else if (e.key === "d") {
            setDialogProps({ type: "DELETE", id, title });
          }
          setLocalDialogOpen(true);
        }
      }
    },
    [activeElement, localDialogOpen]
  );

  const handleEvent = useCallback(
    (e: MouseEvent | FocusEvent, isMouseOut: boolean) => {
      const target = e.target as HTMLElement;
      const closestLink = target.closest("a");

      if (isMouseOut) {
        setActiveElement(null);

        activeElementRef.current = null;
      } else if (closestLink && closestLink !== activeElementRef.current) {
        setActiveElement(closestLink as HTMLAnchorElement);

        activeElementRef.current = closestLink;
      }
    },
    []
  );

  useEffect(() => {
    const ulElement = listContainerRef.current;

    if (ulElement) {
      ulElement.addEventListener("mouseover", (e) => handleEvent(e, false));
      ulElement.addEventListener("mouseout", (e) => handleEvent(e, true));
      ulElement.addEventListener("focusin", (e) => handleEvent(e, false));
      ulElement.addEventListener("focusout", (e) => handleEvent(e, true));

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        ulElement.removeEventListener("mouseover", (e) =>
          handleEvent(e, false)
        );
        ulElement.removeEventListener("mouseout", (e) => handleEvent(e, true));
        ulElement.removeEventListener("focusin", (e) => handleEvent(e, false));
        ulElement.removeEventListener("focusout", (e) => handleEvent(e, true));

        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleEvent, handleKeyDown]);

  const { trigger: renameSnippet } = useSWRMutation(
    "/api/snippets/rename",
    (url, { arg }: { arg: { id: string; title: string } }) =>
      fetcher(url, {
        method: "PATCH",
        body: JSON.stringify(arg),
        headers: { "Content-Type": "application/json" },
      }),
    {
      revalidate: false,
      onSuccess: (res) => {
        if (res.id) {
          setLocalSnippets((prev) =>
            prev.map((snippet) => {
              if (snippet.id === res.id) {
                return { ...snippet, title: res.title };
              }

              return snippet;
            })
          );

          setLocalDialogOpen(false);
        }
      },
    }
  );

  const { trigger: deleteSnippet } = useSWRMutation(
    "/api/snippets/delete",
    (url, { arg }: { arg: { id: string } }) =>
      fetcher(url, {
        method: "DELETE",
        body: JSON.stringify(arg),
        headers: { "Content-Type": "application/json" },
      }),
    {
      revalidate: false,
      onSuccess: (res) => {
        if (res.id) {
          setLocalSnippets((prev) =>
            prev.filter((snippet) => snippet.id !== res.id)
          );
        }
      },
    }
  );

  function renderDialog() {
    if (dialogProps?.type === "RENAME") {
      return (
        <RenameDialog
          id={dialogProps.id}
          title={dialogProps.title}
          action={renameSnippet}
        />
      );
    }

    if (dialogProps?.type === "DELETE") {
      return (
        <DeleteDialog
          id={dialogProps.id}
          title={dialogProps.title}
          action={deleteSnippet}
        />
      );
    }

    return null;
  }

  if (!localSnippets.length) {
    return (
      <div className={cn("flex items-center justify-center py-4")}>
        <span>No snippets found</span>
      </div>
    );
  }

  return (
    <div>
      <ul ref={listContainerRef} className={cn("grid grid-cols-2 gap-3")}>
        <DialogPrimitive.Root
          open={localDialogOpen}
          onOpenChange={setLocalDialogOpen}
        >
          {localSnippets.map(({ id, title, settings, createdAt }) => (
            <ContextMenuPrimitive.Root key={id}>
              <ContextMenuPrimitive.Trigger asChild>
                <li>
                  <Link
                    id={id}
                    href={`/${id}`}
                    className={cn(
                      "flex w-full flex-col gap-2 rounded-lg p-3 font-medium",
                      "select-none outline-none",
                      "border border-white/20 bg-black",
                      "transition-all duration-100 ease-in-out",
                      "hover:bg-white/10 hover:text-almost-white",
                      "focus:border-almost-white focus:text-almost-white"
                    )}
                  >
                    <div className={cn("flex items-center gap-2")}>
                      <ThemeBubble
                        colors={
                          find(
                            SUPPORTED_THEMES,
                            (settings as SnippetSettings).theme
                          ).class
                        }
                        aria-hidden="true"
                      />

                      <span data-id="title" className={cn("grow truncate")}>
                        {title ?? "Untitled"}
                      </span>
                    </div>

                    <span className="text-xs">
                      {Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(createdAt))}
                    </span>
                  </Link>
                </li>
              </ContextMenuPrimitive.Trigger>
              <ContextMenuPrimitive.Portal>
                <ContextMenuPrimitive.Content
                  className={cn(
                    "z-50 w-40 rounded-lg p-1",
                    "border border-white/20 bg-black/30 shadow-lg backdrop-blur-md",
                    "animate-in fade-in zoom-in-75 duration-100 ease-in-out"
                  )}
                >
                  <DialogPrimitive.Trigger asChild>
                    <ContextMenuPrimitive.Item
                      onClick={() => {
                        setDialogProps({ type: "RENAME", id, title });

                        setLocalDialogOpen(true);
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-[5px] p-1",
                        "select-none outline-none",
                        "transition-all duration-100 ease-in-out",
                        "focus:cursor-pointer focus:bg-white/20 focus:text-almost-white"
                      )}
                    >
                      <div className={cn("flex items-center gap-2 pl-0.5")}>
                        <Edit3 size={16} aria-hidden="true" />
                        Rename...
                      </div>

                      <Kbd keys={["R"]} />
                    </ContextMenuPrimitive.Item>
                  </DialogPrimitive.Trigger>

                  <DialogPrimitive.Trigger asChild>
                    <ContextMenuPrimitive.Item
                      onClick={() => {
                        setDialogProps({ type: "DELETE", id, title });

                        setLocalDialogOpen(true);
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-[5px] p-1",
                        "select-none outline-none",
                        "transition-all duration-100 ease-in-out",
                        "focus:cursor-pointer focus:bg-white/20 focus:text-almost-white"
                      )}
                    >
                      <div className={cn("flex items-center gap-2 pl-0.5")}>
                        <Trash size={16} aria-hidden="true" />
                        Delete
                      </div>

                      <Kbd keys={["D"]} />
                    </ContextMenuPrimitive.Item>
                  </DialogPrimitive.Trigger>
                </ContextMenuPrimitive.Content>
              </ContextMenuPrimitive.Portal>
            </ContextMenuPrimitive.Root>
          ))}

          <DialogPrimitive.Portal>
            <div
              className={cn(
                "fixed inset-0 z-50 flex items-center justify-center"
              )}
            >
              <DialogPrimitive.Overlay
                className={cn(
                  "fixed inset-0 z-50",
                  "bg-black/50 backdrop-blur-sm",
                  "transition-all duration-100 ease-in-out",
                  "radix-state-open:animate-in radix-state-open:fade-in",
                  "radix-state-closed:animate-out radix-state-closed:fade-out"
                )}
              />

              <DialogPrimitive.Content
                className={cn(
                  "z-50 w-[640px] min-w-min rounded-xl p-6",
                  "border border-white/20 bg-black shadow-xl",
                  "transition-all duration-100 ease-in-out",
                  "radix-state-open:animate-in radix-state-open:fade-in radix-state-open:zoom-in-75"
                )}
              >
                {renderDialog()}
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      </ul>
    </div>
  );
}
