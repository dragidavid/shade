import { memo } from "react";

import * as SwitchPrimitive from "@radix-ui/react-switch";

import { useStateContext } from "contexts/State";

import { cn } from "lib/cn";

interface SwitchProps {
  type: "lineNumbers";
}

export default memo(function Switch({ type }: SwitchProps) {
  const { state, setState } = useStateContext();

  return (
    <div className={cn("flex h-full items-center")}>
      <SwitchPrimitive.Root
        checked={state[type]}
        onCheckedChange={(value: boolean) =>
          setState({ ...state, [type]: value })
        }
        className={cn(
          "inline-flex h-[24px] w-[44px] shrink-0 items-center rounded-full",
          "outline-none",
          "border-[1px] border-white/20",
          "transition-all duration-100 ease-in-out",
          "focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-black",
          "radix-state-checked:border-transparent radix-state-checked:bg-white/20 radix-state-unchecked:bg-black"
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "block h-5 w-5 rounded-full shadow-lg",
            "pointer-events-none outline-none",
            "bg-white",
            "transition-transform duration-100 ease-in-out",
            "radix-state-checked:translate-x-[21px] radix-state-unchecked:translate-x-[1px]"
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
});
