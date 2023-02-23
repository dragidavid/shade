import Link from "next/link";
import useSWR from "swr";
import { useSession } from "next-auth/react";

import { Loader2, X } from "lucide-react";

import ThemeBubble from "components/ui/ThemeBubble";

import { SUPPORTED_THEMES } from "lib/values";

import { cn } from "lib/cn";
import { find } from "lib/find";
import { fetcher } from "lib/fetcher";

import type { Snippet } from "lib/types";

export default function Content() {
  const { data: session, status: sessionStatus } = useSession();

  const {
    data: snippets,
    error: e,
    isLoading: snippetsLoading,
  } = useSWR<Snippet[]>(
    session?.user?.id ? `/api/snippets/get-all?id=${session.user.id}` : null,
    fetcher
  );

  if (sessionStatus === "loading" || snippetsLoading) {
    return (
      <div className={cn("flex items-center justify-center py-4")}>
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (e) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2 py-4 text-sm",
          "text-red-500"
        )}
      >
        <X size={16} aria-hidden="true" />
        <span>{e?.message ?? "An error has occured."}</span>
      </div>
    );
  }

  if (!snippets?.length) {
    return (
      <div className={cn("flex items-center justify-center py-4 text-sm")}>
        <span>No snippets found.</span>
      </div>
    );
  }

  return (
    <div>
      <ul className={cn("grid grid-cols-2 gap-3")}>
        {snippets?.map((snippet) => (
          <li key={snippet.id}>
            <Link
              href={`/${snippet.id}`}
              key={snippet.id}
              className={cn(
                "flex w-full flex-col gap-2 rounded-lg p-3 text-sm font-medium",
                "select-none outline-none",
                "border-[1px] border-white/20 bg-black",
                "transition-all duration-100 ease-in-out",
                "hover:border-white hover:bg-white/10 hover:text-white",
                "focus:outline-1 focus:outline-offset-2 focus:outline-white",
                "active:bg-white/20"
              )}
            >
              <div className={cn("flex items-center gap-2")}>
                <ThemeBubble
                  colors={find(SUPPORTED_THEMES, snippet.settings.theme).class}
                  aria-hidden="true"
                />

                <span className={cn("grow truncate")}>
                  {snippet.title ?? "Untitled"}
                </span>
              </div>

              <span className="text-xs">
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
