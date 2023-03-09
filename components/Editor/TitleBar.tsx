import TitleBarEdge from "components/ui/TitleBarEdge";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

export default function TitleBar() {
  const title = useStore((state) => state.title);
  const update = useStore((state) => state.update);

  return (
    <div
      className={cn(
        "relative flex justify-center rounded-t-lg py-2",
        "bg-black/30"
      )}
    >
      <input
        value={title ?? ""}
        placeholder="Untitled"
        maxLength={50}
        onChange={(e) => update("title", e.target.value)}
        tabIndex={-1}
        className={cn(
          "w-auto min-w-[128px] truncate rounded-md text-center font-medium leading-loose",
          "outline-none",
          "bg-transparent text-almost-white/50",
          "transition-all duration-100 ease-in-out",
          "placeholder:text-almost-white/30",
          "focus:text-almost-white focus:placeholder:text-transparent",
          !title && "italic"
        )}
      />

      <TitleBarEdge />
    </div>
  );
}
