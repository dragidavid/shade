import { memo } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Trash } from "lucide-react";

import { cn } from "lib/cn";

export default memo(function DeleteDialog({
  id,
  title,
  action,
}: {
  id: string;
  title: string | null;
  action: ({ id }: { id: string }) => void;
}) {
  return (
    <div>
      <DialogPrimitive.Title
        className={cn("mb-3 text-lg font-medium", "text-almost-white")}
      >
        You sure you want to delete {title ? `"${title}"` : "this snippet"}?
      </DialogPrimitive.Title>

      <DialogPrimitive.Description>
        Deleted snippets can&apos;t be recovered.
      </DialogPrimitive.Description>

      <div className={cn("mt-4 flex flex-row justify-end")}>
        <DialogPrimitive.Close asChild>
          <button
            type="button"
            onClick={() => action({ id })}
            className={cn(
              "rounded-lg p-3 font-medium",
              "select-none outline-none",
              "border border-red-400/20 bg-red-400/10 text-almost-white",
              "transition-all duration-100 ease-in-out",
              "focus:border-red-500 focus:bg-red-400/40"
            )}
          >
            <div className={cn("flex items-center gap-2")}>
              <Trash size={16} aria-hidden="true" />
              Delete
            </div>
          </button>
        </DialogPrimitive.Close>
      </div>
    </div>
  );
});
