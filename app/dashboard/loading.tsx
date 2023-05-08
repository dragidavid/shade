import Skeleton from "components/ui/Skeleton";

import { cn } from "lib/cn";

export default function Loading() {
  return (
    <div
      className={cn(
        "flex w-[576px] flex-col rounded-xl p-5",
        "border border-white/20 bg-black shadow-xl shadow-black/40"
      )}
    >
      <div className={cn("flex w-full items-center justify-between")}>
        <h2 className={cn("text-xl font-extrabold")}>Snippets</h2>

        <Skeleton className={cn("h-[34px] w-1/5")} />
      </div>

      <div className={cn("mb-4 mt-1")}>
        <Skeleton className={cn("h-4 w-1/6")} />
      </div>

      <div className={cn("grid grid-cols-2 gap-3")}>
        <Skeleton className={cn("h-[74px] w-auto")} />

        <Skeleton className={cn("h-[74px] w-auto")} />
      </div>
    </div>
  );
}
