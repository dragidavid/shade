"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import Logo from "components/Top/Logo";

import { useSupabase } from "contexts/Supabase";

import { cn } from "lib/cn";
import { exists } from "lib/exists";

export default function HomeLink() {
  const pathname = usePathname();

  const { session } = useSupabase();

  if (pathname === "/" || !exists(session)) return <Logo />;

  return (
    <div>
      <Link
        href="/"
        className={cn(
          "flex items-center justify-between gap-2 rounded-lg p-2",
          "select-none outline-none",
          "transition-all duration-100 ease-in-out",
          "hover:bg-white/10 hover:text-white",
          "focus:text-white focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-black",
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
