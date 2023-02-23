import { useSession, signIn, signOut } from "next-auth/react";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { Loader2, Github, LogOut } from "lucide-react";

import { cn } from "lib/cn";
import { exists } from "lib/exists";

export default function Auth() {
  const { data: session, status: sessionStatus } = useSession();

  if (sessionStatus === "loading") {
    return (
      <div className="p-2">
        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (exists(session) && sessionStatus === "authenticated") {
    return (
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <button
            className={cn(
              "rounded-full",
              "outline-none",
              "transition-all duration-100 ease-in-out",
              "focus:outline-1 focus:outline-offset-2 focus:outline-white"
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
                src={session?.user?.image!}
                alt={session?.user?.name ?? "img"}
                className={cn("aspect-square h-full w-full")}
              />
              <AvatarPrimitive.Fallback
                delayMs={600}
                className={cn(
                  "flex h-full w-full items-center justify-center rounded-full",
                  "bg-almost-white text-almost-black"
                )}
              >
                {session?.user?.name
                  ?.split(" ")
                  .map((name) => name[0])
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
        onClick={() => signIn("github")}
        className={cn(
          "flex items-center justify-between gap-2 rounded-lg p-2",
          "select-none outline-none",
          "transition-all duration-100 ease-in-out",
          "hover:bg-white/10 hover:text-white",
          "focus:text-white focus:outline-1 focus:outline-offset-2 focus:outline-white",
          "active:bg-white/20"
        )}
      >
        <Github size={16} aria-hidden="true" />
        Sign in with GitHub
      </button>
    </div>
  );
}
