import { Fragment } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";
import { ReloadIcon, ExitIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { exists } from "lib/exists";

export default function Auth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="p-2">
        <span className="pointer-events-none">
          <ReloadIcon className="h-4 w-4 animate-spin" aria-hidden={true} />
        </span>
      </div>
    );
  }

  if (exists(session) && status === "authenticated") {
    return (
      <Menu as="div" className="relative flex text-left">
        <Menu.Button
          className={clsx(
            "rounded-full",
            "transition-all duration-200 ease-in-out",
            "focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          )}
        >
          <Image
            src={session?.user?.image!}
            alt={session?.user?.name ?? "IMG"}
            width={32}
            height={32}
            className={clsx(
              "pointer-events-none touch-none select-none rounded-full"
            )}
          />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={clsx(
              "absolute right-0 top-8 mt-2 w-max rounded-xl p-1 text-xs",
              "border-[1px] border-white/20 bg-black shadow-xl",
              "focus:outline-none"
            )}
          >
            <Menu.Item>
              <button
                type="button"
                onClick={() => signOut()}
                className={clsx(
                  "flex select-none items-center justify-between gap-2 rounded-lg p-2",
                  "transition-all duration-200 ease-in-out",
                  "hover:cursor-pointer hover:bg-white/20",
                  "focus:outline-none focus:ring-1 focus:ring-white",
                  "ui-active:bg-white/20 ui-active:text-white"
                )}
              >
                <span className="pointer-events-none">
                  <ExitIcon className="h-3 w-3" aria-hidden="true" />
                </span>
                Sign out
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => signIn("github")}
        className={clsx(
          "flex select-none items-center justify-between gap-2 rounded-lg p-2 text-xs",
          "border-[1px] border-white/20 bg-black",
          "transition-all duration-200 ease-in-out",
          "hover:cursor-pointer hover:border-white hover:bg-white/20 hover:text-white",
          "focus:outline-none focus:ring-1 focus:ring-white",
          "active:bg-white/10"
        )}
      >
        <span className="pointer-events-none">
          <GitHubLogoIcon className="h-3 w-3" aria-hidden="true" />
        </span>
        Sign in with GitHub
      </button>
    </div>
  );
}
