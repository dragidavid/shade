import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Info } from "lucide-react";

import Tooltip from "components/ui/Tooltip";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

export default function TitleBar({ editable = false }: { editable: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const creatingCustomTheme = useStore((state) => state.creatingCustomTheme);
  const title = useStore((state) => state.title);
  const update = useStore((state) => state.update);

  useHotkeys(
    "t",
    () => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    },
    {
      enabled: editable,
      preventDefault: true,
    }
  );

  return (
    <div
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-t-lg py-2",
        "bg-black/40",
        creatingCustomTheme && "stripes"
      )}
    >
      <Tooltip
        content={
          <div className={cn("flex items-center gap-2 pl-1 text-xs")}>
            <Info size={16} aria-hidden="true" />
            Max 24 characters
          </div>
        }
        kbd={["T"]}
        disabled={!editable}
      >
        <input
          type="text"
          ref={inputRef}
          value={title ?? ""}
          spellCheck={false}
          autoComplete="off"
          maxLength={69}
          onChange={(e) => update("title", e.target.value)}
          disabled={!editable}
          tabIndex={-1}
          className={cn(
            "w-32 truncate rounded-md text-center font-medium leading-loose",
            "outline-none",
            "bg-transparent text-almost-white/40",
            "transition-all duration-100 ease-in-out",
            "focus:text-almost-white"
          )}
          aria-label="title-input"
        />
      </Tooltip>

      <div
        className={cn(
          "absolute -bottom-2 left-0 flex w-full justify-between fill-black/30"
        )}
      >
        <svg width={8} height={8} className={cn("rotate-180", "fill-black/40")}>
          <path d="M0 8a8 8 0 0 0 8-8v8H0Z" />
        </svg>

        <svg width={8} height={8} className={cn("-rotate-90", "fill-black/40")}>
          <path d="M0 8a8 8 0 0 0 8-8v8H0Z" />
        </svg>
      </div>
    </div>
  );
}
