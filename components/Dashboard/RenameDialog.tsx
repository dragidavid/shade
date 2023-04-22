import { memo, useState } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Edit3 } from "lucide-react";

import Loader from "components/ui/Loader";

import { cn } from "lib/cn";

export default memo(function RenameDialog({
  id,
  title,
  action,
  isLoading,
}: {
  id: string;
  title: string | null;
  action: ({ id, title }: { id: string; title: string }) => void;
  isLoading: boolean;
}) {
  const [localInputValue, setLocalInputValue] = useState(title ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (localInputValue !== title) {
          action({ id, title: localInputValue });
        }
      }}
    >
      <input
        type="text"
        value={localInputValue}
        placeholder="Untitled"
        spellCheck={false}
        autoComplete="off"
        maxLength={69}
        onChange={(e) => setLocalInputValue(e.target.value)}
        className={cn(
          "w-full truncate rounded-md p-1 text-lg",
          "outline-none",
          "bg-transparent text-almost-white",
          "transition-all duration-100 ease-in-out",
          "placeholder:text-almost-white/50",
          "focus:placeholder:text-transparent",
          !localInputValue && "italic"
        )}
      />

      {localInputValue && (
        <DialogPrimitive.Close asChild>
          <button
            type="button"
            onClick={() => action({ id, title: localInputValue })}
            disabled={localInputValue === title || isLoading}
            className={cn(
              "mt-4 w-full rounded-lg p-3",
              "select-none outline-none",
              "border border-white/20 bg-white/10 text-almost-white",
              "transition-all duration-100 ease-in-out",
              "focus:border-almost-white",
              "disabled:cursor-not-allowed disabled:brightness-50"
            )}
          >
            <div className={cn("flex items-center gap-2")}>
              {isLoading ? (
                <Loader extraClasses="h-4 w-4" />
              ) : (
                <Edit3 size={16} aria-hidden="true" />
              )}
              <span className="min-w-fit">Rename snippet to</span>
              <span
                className={cn("truncate font-medium", "text-greyish")}
              >{`"${localInputValue}"`}</span>
            </div>
          </button>
        </DialogPrimitive.Close>
      )}
    </form>
  );
});
