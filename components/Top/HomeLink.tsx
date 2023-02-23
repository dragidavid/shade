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
          "focus:text-white focus:outline-1 focus:outline-offset-2 focus:outline-white",
          "active:bg-white/20"
        )}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Dashboard
      </Link>
    </div>
  );
}
