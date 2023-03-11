import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

export default function Tooltip({
  children: trigger,
  content,
  kbd,
}: {
  children: React.ReactNode;
  content?: React.ReactNode;
  kbd?: string[];
}) {
  const fontStyle = useStore((state) => state.fontStyle);

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{trigger}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        sideOffset={4}
        className={cn(
          "font-mediumm flex gap-4 rounded-md p-1 text-xs",
          "select-none outline-none",
          "border-[1px] border-white/20 bg-black",
          "animate-in fade-in zoom-in-90 duration-100 ease-in-out"
        )}
      >
        {content}

        {kbd && (
          <div className={cn("flex items-center gap-1")}>
            {kbd.map((key) => (
              <kbd
                key={key}
                className={cn(
                  "inline-flex items-center justify-center rounded-[4px] py-[2px] px-[6px]",
                  "bg-white/20",
                  fontStyle.class
                )}
              >
                {key}
              </kbd>
            ))}
          </div>
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
