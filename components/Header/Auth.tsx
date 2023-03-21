"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useHotkeys } from "react-hotkeys-hook";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { Github, LogOut } from "lucide-react";

import Tooltip from "components/ui/Tooltip";
import Kbd from "components/ui/Kbd";

import { cn } from "lib/cn";

export default function Auth() {
  const [localOpen, setLocalOpen] = useState<boolean>(false);

  const { data: session, status: sessionStatus } = useSession();

  useHotkeys(
    "u",
    () => {
      setLocalOpen((prev) => !prev);
    },
    {
      enabled: sessionStatus === "authenticated",
      preventDefault: true,
    },
    [sessionStatus]
  );

  useHotkeys(
    "q",
    () => {
      signOut();
    },
    {
      enabled: sessionStatus === "authenticated" && localOpen,
      preventDefault: true,
    },
    [sessionStatus, localOpen]
  );

  useHotkeys(
    "l",
    () => {
      signIn("github");
    },
    {
      enabled: sessionStatus === "unauthenticated",
      preventDefault: true,
    },
    [sessionStatus]
  );

  if (sessionStatus === "loading") {
    return null;
  }

  if (session && sessionStatus === "authenticated") {
    return (
      <DropdownMenuPrimitive.Root open={localOpen} onOpenChange={setLocalOpen}>
        <DropdownMenuPrimitive.Trigger asChild>
          <button
            className={cn(
              "rounded-full",
              "outline-none",
              "transition-all will-change-transform duration-100 ease-in-out",
              "focus:ring-1 focus:ring-almost-white focus:ring-offset-2 focus:ring-offset-black",
              "radix-state-open:scale-[80%]"
            )}
            aria-label="avatar"
          >
            <Tooltip side="left" sideOffset={8} kbd={["U"]}>
              <AvatarPrimitive.Root
                className={cn(
                  "relative flex h-8 w-8 shrink-0 justify-center overflow-hidden rounded-full",
                  "select-none",
                  "bg-almost-black"
                )}
              >
                <AvatarPrimitive.Image
                  src={session.user.image!}
                  alt={session.user.name ?? "img"}
                  className={cn("aspect-square h-full w-full")}
                />
                <AvatarPrimitive.Fallback
                  delayMs={600}
                  className={cn(
                    "flex h-full w-full items-center justify-center rounded-full"
                  )}
                >
                  {session.user.name
                    ?.split(" ")
                    .map((p: string) => p[0])
                    .join("") ?? "🤓"}
                </AvatarPrimitive.Fallback>
              </AvatarPrimitive.Root>
            </Tooltip>
          </button>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            sideOffset={5}
            className={cn(
              "z-50 w-40 rounded-lg p-1",
              "border border-white/20 bg-black/30 shadow-lg backdrop-blur-md",
              "animate-in fade-in zoom-in-75 duration-100 ease-in-out"
            )}
          >
            <DropdownMenuPrimitive.Item
              onSelect={() => signOut()}
              className={cn(
                "relative flex items-center justify-between rounded-[5px] p-1",
                "select-none outline-none",
                "transition-all duration-100 ease-in-out",
                "focus:cursor-pointer focus:bg-white/20 focus:text-almost-white"
              )}
            >
              <div className="flex items-center gap-2 pl-0.5">
                <LogOut size={16} aria-hidden="true" />
                Sign out
              </div>

              <Kbd keys={["Q"]} />
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => signIn("github")}
        className={cn(
          "flex items-center gap-6 rounded-lg p-1 font-medium",
          "select-none outline-none",
          "border border-white/20 bg-black",
          "transition-all duration-100 ease-in-out",
          "hover:bg-white/20 hover:text-almost-white",
          "focus:border-almost-white focus:text-almost-white"
        )}
      >
        <div className={cn("flex items-center gap-2 pl-1")}>
          <Github size={16} aria-hidden="true" />
          Sign in with GitHub
        </div>

        <Kbd keys={["L"]} />
      </button>
    </div>
  );
}
