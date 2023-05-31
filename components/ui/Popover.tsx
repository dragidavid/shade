import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "lib/cn";

export default function Popover({
  children: trigger,
  content,
  side = "top",
  sideOffset = 4,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side={side}
          sideOffset={sideOffset}
          onFocusOutside={(e) => e.preventDefault()}
          className={cn(
            "relative z-50 rounded-lg p-2",
            "border border-white/20 bg-black/50 shadow-lg backdrop-blur-md",
            "animate-in fade-in zoom-in-75 duration-100 ease-in-out"
          )}
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
