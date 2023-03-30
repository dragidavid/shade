import { redirect } from "next/navigation";

import Button from "components/Dashboard/Button";
import Snippets from "components/Dashboard/Snippets";

import { cn } from "lib/cn";
import { prisma } from "lib/prisma";
import { getSession } from "lib/auth";
import { serialize } from "lib/serialize";

async function getSnippets(userId: string) {
  return await prisma.snippet.findMany({
    where: {
      userId,
    },
    include: {
      views: true,
    },
  });
}

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const snippets = await getSnippets(session.user.id);

  const shouldButtonBeDisabled = snippets.length >= 10;

  return (
    <div
      className={cn(
        "flex w-[576px] flex-col gap-6 rounded-xl p-5",
        "border border-white/20 bg-black shadow-xl shadow-black/40"
      )}
    >
      <div className={cn("flex w-full items-center justify-between")}>
        <h2 className={cn("text-xl font-extrabold")}>Snippets</h2>

        <Button isDisabled={shouldButtonBeDisabled} />
      </div>

      <Snippets snippets={serialize(snippets)} />
    </div>
  );
}
