import { redirect } from "next/navigation";

import Button from "components/Dashboard/Button";

import { cn } from "lib/cn";
import { getSession } from "lib/auth";

export const revalidate = 60;

export default async function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div
      className={cn(
        "flex w-[576px] flex-col gap-6 rounded-xl p-5",
        "border border-white/20 bg-black shadow-xl shadow-black/40"
      )}
    >
      <div className={cn("flex w-full items-center justify-between")}>
        <h2 className={cn("text-xl font-extrabold")}>Snippets</h2>

        <Button />
      </div>

      {children}
    </div>
  );
}
