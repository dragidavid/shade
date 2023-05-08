import { memo } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Trash } from "lucide-react";

import Loader from "components/ui/Loader";

import { cn } from "lib/cn";

export default memo(function DeleteDialog({
  id,
  title,
  action,
  isLoading,
}: {
  id: string;
  title: string | null;
  action: ({ id }: { id: string }) => void;
  isLoading: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        action({ id });
      }}
    >
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
            disabled={isLoading}
            className={cn(
              "rounded-lg p-3 font-medium",
              "select-none outline-none",
              "border border-red-500/40 bg-black",
              "transition-all duration-100 ease-in-out",
              "hover:bg-red-500/30 hover:text-almost-white",
              "focus:border-red-500 focus:bg-red-500/30 focus:text-almost-white",
              "disabled:cursor-not-allowed disabled:brightness-50"
            )}
          >
            <div className={cn("flex items-center gap-2")}>
              {isLoading ? (
                <Loader extraClasses="h-4 w-4" />
              ) : (
                <Trash size={16} aria-hidden="true" />
              )}
              Delete
            </div>
          </button>
        </DialogPrimitive.Close>
      </div>
    </form>
  );
});
