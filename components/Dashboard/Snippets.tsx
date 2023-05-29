"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import useSWRMutation from "swr/mutation";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

import { Edit3, Link as LinkIcon, Trash } from "lucide-react";

import RenameDialog from "components/Dashboard/RenameDialog";
import DeleteDialog from "components/Dashboard/DeleteDialog";

import Kbd from "components/ui/Kbd";
import ThemeBubble from "components/ui/ThemeBubble";

import { BASE_THEMES } from "lib/values";

import { cn } from "lib/cn";
import { find } from "lib/find";
import { fetcher } from "lib/fetcher";

import type { Snippet, View } from "@prisma/client";

interface DialogProps {
  type: "RENAME" | "DELETE";
  id: string;
  title: string | null;
}

export default function Snippets({
  snippets,
}: {
  snippets: (Snippet & { views: View | null })[];
}) {
  const [localSnippets, setLocalSnippets] = useState(snippets);
  const [localDialogOpen, setLocalDialogOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<DialogProps | null>(null);
  const [activeElement, setActiveElement] = useState<HTMLAnchorElement | null>(
    null
  );

  const listContainerRef = useRef<HTMLUListElement>(null);
  const activeElementRef = useRef<HTMLAnchorElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        !localDialogOpen &&
        activeElement &&
        !e.metaKey &&
        !e.ctrlKey &&
        e.key !== "Tab"
      ) {
        const id = activeElement.id;
        const title = (
          activeElement.querySelector('[data-id="title"]') as HTMLSpanElement
        ).innerText;

        if (id && title) {
          e.preventDefault();

          switch (e.key) {
            case "r":
              setDialogProps({ type: "RENAME", id, title });
              setLocalDialogOpen(true);

              break;
            case "d":
              setDialogProps({ type: "DELETE", id, title });
              setLocalDialogOpen(true);

              break;
            case "c":
              navigator.clipboard.writeText(`${window.location.origin}/${id}`);

              break;
          }
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

  const { trigger: renameSnippet, isMutating: renameLoading } = useSWRMutation(
    "/api/snippets",
    (url, { arg }: { arg: { id: string; title: string } }) =>
      fetcher(url, {
        method: "PATCH",
        body: JSON.stringify(arg),
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

  const { trigger: deleteSnippet, isMutating: deleteLoading } = useSWRMutation(
    "/api/snippets",
    (url, { arg }: { arg: { id: string } }) =>
      fetcher(`${url}?id=${arg.id}`, {
        method: "DELETE",
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
          isLoading={renameLoading}
        />
      );
    }

    if (dialogProps?.type === "DELETE") {
      return (
        <DeleteDialog
          id={dialogProps.id}
          title={dialogProps.title}
          action={deleteSnippet}
          isLoading={deleteLoading}
        />
      );
    }

    return null;
  }

  if (!localSnippets.length) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-6",
          "text-greyish/80"
        )}
      >
        <span>No snippets found</span>
      </div>
    );
  }

  return (
    <div>
      <div className={cn("mb-4 mt-1")}>
        <p className={cn("text-xs", "text-greyish/80")}>
          {localSnippets.length}/10
        </p>
      </div>

      <ul ref={listContainerRef} className={cn("grid grid-cols-2 gap-3")}>
        <DialogPrimitive.Root
          open={localDialogOpen}
          onOpenChange={setLocalDialogOpen}
        >
          {localSnippets.map(
            ({ id, title, theme, customColors, angle, createdAt, views }) => (
              <ContextMenuPrimitive.Root key={id}>
                <ContextMenuPrimitive.Trigger asChild>
                  <li>
                    <Link
                      id={id}
                      href={`/${id}`}
                      className={cn(
                        "flex w-full flex-col gap-3 rounded-lg p-3 font-medium",
                        "select-none outline-none",
                        "border border-white/20 bg-black",
                        "transition-all duration-100 ease-in-out",
                        "hover:bg-white/20 hover:text-almost-white",
                        "focus:border-almost-white focus:text-almost-white"
                      )}
                    >
                      <div className={cn("flex items-center gap-2")}>
                        <ThemeBubble
                          style={{
                            backgroundImage: `linear-gradient(${angle}deg, ${(theme ===
                            "custom"
                              ? (customColors as string[])
                              : find(BASE_THEMES, theme).baseColors
                            ).join(" ,")}`,
                          }}
                        />

                        <span data-id="title" className={cn("grow truncate")}>
                          {title ?? "Untitled"}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "flex items-center justify-between text-xs"
                        )}
                      >
                        <span>
                          {Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(new Date(createdAt))}
                        </span>

                        <span>
                          {views?.count.toLocaleString() ?? "?"} views
                        </span>
                      </div>
                    </Link>
                  </li>
                </ContextMenuPrimitive.Trigger>
                <ContextMenuPrimitive.Portal>
                  <ContextMenuPrimitive.Content
                    className={cn(
                      "z-50 w-40 rounded-lg p-1",
                      "border border-white/20 bg-black/50 shadow-lg backdrop-blur-md",
                      "animate-in fade-in zoom-in-75 duration-100 ease-in-out"
                    )}
                  >
                    <DialogPrimitive.Trigger asChild>
                      <ContextMenuPrimitive.Item
                        onClick={() =>
                          setDialogProps({ type: "RENAME", id, title })
                        }
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

                    <ContextMenuPrimitive.Item
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/${id}`
                        )
                      }
                      className={cn(
                        "flex items-center justify-between rounded-[5px] p-1",
                        "select-none outline-none",
                        "transition-all duration-100 ease-in-out",
                        "focus:cursor-pointer focus:bg-white/20 focus:text-almost-white"
                      )}
                    >
                      <div className={cn("flex items-center gap-2 pl-0.5")}>
                        <LinkIcon size={16} aria-hidden="true" />
                        Copy link
                      </div>

                      <Kbd keys={["C"]} />
                    </ContextMenuPrimitive.Item>

                    <DialogPrimitive.Trigger asChild>
                      <ContextMenuPrimitive.Item
                        onClick={() =>
                          setDialogProps({ type: "DELETE", id, title })
                        }
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
            )
          )}

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
