import Link from "next/link";

import ThemeBubble from "components/ui/ThemeBubble";

import { SUPPORTED_THEMES } from "lib/values";

import { cn } from "lib/cn";
import { find } from "lib/find";
import { prisma } from "lib/prisma";
import { getSession } from "lib/auth";

async function getSnippets(userId: string) {
  return await prisma.snippet.findMany({
    where: {
      userId,
    },
  });
}

export default async function Page() {
  const session = await getSession();

  const snippets = await getSnippets(session.user.id);

  if (!snippets.length) {
    return (
      <div className={cn("flex items-center justify-center py-4")}>
        <span>No snippets found</span>
      </div>
    );
  }

  return (
    <div>
      <ul className={cn("grid grid-cols-2 gap-3")}>
        {/* TODO replace any with type - fix schema for it first */}
        {snippets.map((snippet: any) => (
          <li key={snippet.id}>
            <Link
              href={`/${snippet.id}`}
              key={snippet.id}
              className={cn(
                "flex w-full flex-col gap-2 rounded-lg p-3 font-medium",
                "select-none outline-none",
                "border-[1px] border-white/20 bg-black",
                "transition-all duration-100 ease-in-out",
                "hover:border-almost-white hover:bg-white/10 hover:text-almost-white",
                "focus:ring-1 focus:ring-almost-white focus:ring-offset-2 focus:ring-offset-black",
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
