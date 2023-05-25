import { memo } from "react";

import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

export default memo(function Switch({
  type,
}: {
  type: "lineNumbers" | "grain";
}) {
  const value = useStore((state) => state[type]);
  const update = useStore((state) => state.update);

  return (
    <div className={cn("flex h-full items-center")}>
      <SwitchPrimitive.Root
        checked={value}
        onCheckedChange={(value: boolean) => update(type, value)}
        className={cn(
          "inline-flex h-6 w-[44px] shrink-0 items-center rounded-full",
          "outline-none",
          "border border-white/20",
          "transition-all duration-100 ease-in-out",
          "focus:ring-1 focus:ring-almost-white focus:ring-offset-2 focus:ring-offset-black",
          "radix-state-checked:bg-white/20 radix-state-unchecked:bg-black"
        )}
        aria-label={`${type}-switch`}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "block h-5 w-5 rounded-full",
            "pointer-events-none outline-none",
            "bg-almost-white shadow-lg",
            "transition-transform duration-100 ease-in-out",
            "radix-state-checked:translate-x-[21px] radix-state-unchecked:translate-x-px"
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
});
