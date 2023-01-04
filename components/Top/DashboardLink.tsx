import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { exists } from "lib/exists";

export default function DashboardLink() {
  const { pathname } = useRouter();
  const { data: session, status } = useSession();

  if (pathname === "/" || !exists(session) || status === "unauthenticated")
    return <div />;

  return (
    <div>
      <Link
        href="/"
        className={clsx(
          "flex select-none items-center justify-between gap-2 rounded-lg p-2 text-xs",
          "transition-all duration-200 ease-in-out",
          "hover:cursor-pointer hover:text-white",
          "focus:text-white focus:outline-none focus:ring-1 focus:ring-white",
          "active:bg-white/10",
          "group"
        )}
      >
        <span className="pointer-events-none">
          <ArrowLeftIcon className="h-3 w-3" aria-hidden="true" />
        </span>
        Back to Dashboard
      </Link>
    </div>
  );
}
