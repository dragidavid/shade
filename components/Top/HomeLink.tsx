import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { ArrowLeft } from "lucide-react";

import Logo from "components/Top/Logo";

import { cn } from "lib/cn";
import { exists } from "lib/exists";

export default function HomeLink() {
  const { pathname } = useRouter();

  const { data: session, status: sessionStatus } = useSession();

  if (
    pathname === "/" ||
    !exists(session) ||
    sessionStatus === "unauthenticated"
  )
    return <Logo />;

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
