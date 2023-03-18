import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import Kbd from "components/ui/Kbd";

import { cn } from "lib/cn";

export default function Tooltip({
  children: trigger,
  content,
  side = "top",
  sideOffset = 4,
  kbd,
  disabled = false,
}: {
  children: React.ReactNode;
  content?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  kbd?: string[];
  disabled?: boolean;
}) {
  if (disabled) return <>{trigger}</>;

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{trigger}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "flex items-center gap-7 overflow-hidden rounded-[4px]",
          "select-none outline-none",
          "bg-black",
          "animate-in fade-in zoom-in-90 duration-100 ease-in-out",
          content && "rounded-lg border border-white/20 p-1"
        )}
      >
        {content}

        {kbd && <Kbd keys={kbd} />}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
