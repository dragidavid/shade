import { memo } from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { SUPPORTED_PADDING_CHOICES } from "lib/values";

import { cn } from "lib/cn";
import { find } from "lib/find";
import { useStore } from "lib/store";

import type { ChoiceDefinition } from "lib/types";

export default memo(function Choices({
  type,
  choices,
}: {
  type: "padding";
  choices: ChoiceDefinition[];
}) {
  const value = useStore((state) => state[type]);
  const update = useStore((state) => state.update);

  return (
    <RadioGroupPrimitive.Root
      defaultValue={value.id}
      value={value.id}
      onValueChange={(value: string) =>
        update(type, find(SUPPORTED_PADDING_CHOICES, value))
      }
      className={cn("flex h-full items-center justify-center")}
    >
      <div className={cn("flex gap-3")}>
        {choices.map((choice) => (
          <RadioGroupPrimitive.Item
            key={choice.id}
            id={choice.id}
            value={choice.id}
            className={cn(
              "flex items-center justify-center rounded-md py-1 px-2",
              "select-none outline-none",
              "transition-all duration-100 ease-in-out",
              "hover:text-almost-white",
              "focus:text-almost-white focus:ring-1 focus:ring-almost-white focus:ring-offset-2 focus:ring-offset-black",
              "radix-state-checked:bg-white/20 radix-state-checked:text-almost-white"
            )}
          >
            {choice.label}
          </RadioGroupPrimitive.Item>
        ))}
      </div>
    </RadioGroupPrimitive.Root>
  );
});
