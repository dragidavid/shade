"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { ArrowLeft } from "lucide-react";

import Logo from "components/Header/Logo";

import { cn } from "lib/cn";

export default function Home() {
  const pathname = usePathname();

  const { data: session, status: sessionStatus } = useSession();

  if (
    pathname === "/" ||
    pathname === "/dashboard" ||
    (!session && sessionStatus !== "loading")
  ) {
    return <Logo />;
  }

  return (
    <div>
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center justify-between gap-2 rounded-lg p-2",
          "select-none outline-none",
          "transition-all duration-100 ease-in-out",
          "hover:bg-white/10 hover:text-almost-white",
          "focus:text-almost-white focus:ring-1 focus:ring-almost-white focus:ring-offset-2 focus:ring-offset-black",
          "active:bg-white/20",
          "group"
        )}
      >
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
      </Link>
    </div>
  );
}
