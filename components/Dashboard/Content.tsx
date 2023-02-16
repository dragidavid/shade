import Link from "next/link";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { Loader2, X } from "lucide-react";

import ThemeBubble from "components/common/ThemeBubble";

import { SUPPORTED_THEMES } from "lib/values";

import { find } from "lib/find";

import type { Snippet } from "lib/types";

export default function Content() {
  const { data: session, status: sessionStatus } = useSession();

  const {
    data: snippets,
    error: e,
    isLoading: snippetsLoading,
  } = useSWR<Snippet[]>(
    session?.user?.id ? `/api/snippets/get-all?id=${session.user.id}` : null
  );

  if (sessionStatus === "loading" || snippetsLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 size={18} className="animate-spin" />
      </div>
    );
  }

  if (e) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-sm text-red-500">
        <X size={18} />
        <span>{e?.message ?? "An error has occured."}</span>
      </div>
    );
  }

  if (!snippets?.length) {
    return (
      <div className="flex items-center justify-center py-4 text-sm">
        <span>No snippets found.</span>
      </div>
    );
  }

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3">
        {snippets?.map((snippet) => (
          <li key={snippet.id}>
            <Link
              href={`/${snippet.id}`}
              key={snippet.id}
              className={clsx(
                "flex w-full flex-col gap-2 rounded-lg p-3 text-sm",
                "border-[1px] border-white/20 bg-black",
                "transition-all duration-200 ease-in-out",
                "hover:cursor-pointer hover:border-white hover:bg-white/20 hover:text-white",
                "focus:outline-none focus:ring-1 focus:ring-white",
                "active:bg-white/10"
              )}
            >
              <div className="flex items-center gap-2">
                <ThemeBubble
                  colors={find(SUPPORTED_THEMES, snippet.settings.theme).class}
                />

                <span className="pointer-events-none grow truncate">
                  {snippet.title ?? "Untitled"}
                </span>
              </div>

              <span className="pointer-events-none text-xs">
                {Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(snippet.createdAt))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
