import { Info } from "lucide-react";

import Tooltip from "components/ui/Tooltip";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

export default function TitleBar() {
  const title = useStore((state) => state.title);
  const update = useStore((state) => state.update);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-t-lg py-2",
        "bg-black/30"
      )}
    >
      <Tooltip
        content={
          <div className={cn("flex items-center gap-2")}>
            <Info size={14} aria-hidden="true" />
            <span>Max 50 characters</span>
          </div>
        }
        kbd={["⌘", "T"]}
      >
        <input
          value={title ?? ""}
          placeholder="Untitled"
          maxLength={50}
          onChange={(e) => update("title", e.target.value)}
          tabIndex={-1}
          className={cn(
            "w-32 truncate rounded-md text-center font-medium leading-loose",
            "outline-none",
            "bg-transparent text-almost-white/50",
            "transition-all duration-100 ease-in-out",
            "placeholder:text-almost-white/50",
            "focus:text-almost-white focus:placeholder:text-transparent",
            !title && "italic"
          )}
        />
      </Tooltip>

      <div
        className={cn(
          "absolute left-0 -bottom-2 flex w-full justify-between fill-black/30"
        )}
      >
        <svg width={8} height={8} className="rotate-180">
          <path d="M0 8a8 8 0 0 0 8-8v8H0Z" />
        </svg>

        <svg width={8} height={8} className="-rotate-90">
          <path d="M0 8a8 8 0 0 0 8-8v8H0Z" />
        </svg>
      </div>
    </div>
  );
}
