"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { Loader2, Github, LogOut } from "lucide-react";

import { cn } from "lib/cn";
import { exists } from "lib/exists";
import { useSupabase } from "contexts/Supabase";

export default function Auth() {
  const { supabase, session } = useSupabase();

  // if (sessionStatus === "loading") {
  //   return (
  //     <div className="p-2">
  //       <Loader2 size={18} className="animate-spin" aria-hidden="true" />
  //     </div>
  //   );
  // }

  async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    console.log(data, error);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (exists(session)) {
    return (
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <button
            className={cn(
              "rounded-full",
              "outline-none",
              "transition-all duration-100 ease-in-out",
              "focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            )}
            aria-label="avatar"
          >
            <AvatarPrimitive.Root
              className={cn(
                "relative flex h-8 w-8 shrink-0 justify-center overflow-hidden rounded-full",
                "select-none",
                "bg-almost-black"
              )}
            >
              <AvatarPrimitive.Image
                src={session?.user?.user_metadata.avatar_url}
                alt={session?.user?.user_metadata.full_name ?? "img"}
                className={cn("aspect-square h-full w-full")}
              />
              <AvatarPrimitive.Fallback
                delayMs={600}
                className={cn(
                  "flex h-full w-full items-center justify-center rounded-full",
                  "bg-almost-black text-almost-white"
                )}
              >
                {session?.user?.user_metadata.full_name
                  ?.split(" ")
                  .map((p: string) => p[0])
                  .join("") ?? "SH"}
              </AvatarPrimitive.Fallback>
            </AvatarPrimitive.Root>
          </button>
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Content
          sideOffset={5}
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-lg p-1 shadow-lg",
            "border-[1px] border-white/20 bg-black",
            "animate-in fade-in zoom-in-75 duration-100 ease-in-out"
          )}
        >
          <DropdownMenuPrimitive.Item
            onSelect={() => signOut()}
            className={cn(
              "relative flex items-center rounded-md py-1.5 px-2",
              "select-none outline-none",
              "transition-all duration-100 ease-in-out",
              "focus:cursor-pointer focus:bg-white/20 focus:text-white"
            )}
          >
            <LogOut size={16} className="mr-2" aria-hidden="true" />
            Sign out
          </DropdownMenuPrimitive.Item>

          <DropdownMenuPrimitive.Arrow className="fill-white/20" />
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Root>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => signInWithGitHub()}
        className={cn(
          "flex items-center justify-between gap-2 rounded-lg p-2",
          "select-none outline-none",
          "transition-all duration-100 ease-in-out",
          "hover:bg-white/10 hover:text-white",
          "focus:text-white focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-black",
          "active:bg-white/20"
        )}
      >
        <Github size={16} aria-hidden="true" />
        Sign in with GitHub
      </button>
    </div>
  );
}
