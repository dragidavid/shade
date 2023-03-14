"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useHotkeys } from "react-hotkeys-hook";

import { ArrowLeft } from "lucide-react";

import Logo from "components/Header/Logo";
import Kbd from "components/ui/Kbd";

import { cn } from "lib/cn";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  const { status: sessionStatus } = useSession();

  useHotkeys(
    "b",
    () => {
      router.push("/dashboard");
    },
    {
      enabled: sessionStatus === "authenticated" && pathname !== "/dashboard",
      preventDefault: true,
    },
    [sessionStatus, pathname]
  );

  if (sessionStatus === "loading") return null;

  if (
    pathname === "/" ||
    pathname === "/dashboard" ||
    sessionStatus === "unauthenticated"
  ) {
    return <Logo />;
  }

  return (
    <div>
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center gap-6 rounded-lg p-1 font-medium",
          "select-none outline-none",
          "border-[1px] border-white/20 bg-black",
          "transition-all duration-100 ease-in-out",
          "hover:bg-white/20 hover:text-almost-white",
          "focus:border-almost-white focus:text-almost-white",
          "group"
        )}
      >
        <div className={cn("flex items-center gap-2")}>
          <ArrowLeft
            size={16}
            className={cn(
              "translate-x-0.5",
              "transition-transform duration-100 ease-in-out",
              "group-hover:translate-x-0"
            )}
            aria-hidden="true"
          />
          Dashboard
        </div>

        <Kbd keys={["B"]} />
      </Link>
    </div>
  );
}
