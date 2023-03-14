import Link from "next/link";

import ThemeBubble from "components/ui/ThemeBubble";

import { SUPPORTED_THEMES } from "lib/values";

import { cn } from "lib/cn";
import { find } from "lib/find";
import { prisma } from "lib/prisma";
import { getSession } from "lib/auth";

import type { SnippetSettings } from "lib/types";

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
        {snippets.map(({ id, title, settings, createdAt }) => (
          <li key={id}>
            <Link
              href={`/${id}`}
              key={id}
              className={cn(
                "flex w-full flex-col gap-2 rounded-lg p-3 font-medium",
                "select-none outline-none",
                "border-[1px] border-white/20 bg-black",
                "transition-all duration-100 ease-in-out",
                "hover:bg-white/10 hover:text-almost-white",
                "focus:border-almost-white focus:text-almost-white"
              )}
            >
              <div className={cn("flex items-center gap-2")}>
                <ThemeBubble
                  colors={
                    find(SUPPORTED_THEMES, (settings as SnippetSettings).theme)
                      .class
                  }
                  aria-hidden="true"
                />

                <span className={cn("grow truncate")}>
                  {title ?? "Untitled"}
                </span>
              </div>

              <span className="text-xs">
                {Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(createdAt))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
