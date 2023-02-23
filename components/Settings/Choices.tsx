import { memo } from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { useStateContext } from "contexts/State";

import { SUPPORTED_PADDING_CHOICES } from "lib/values";

import { cn } from "lib/cn";
import { find } from "lib/find";

import type { ChoiceDefinition } from "lib/types";

interface ChoicesProps {
  type: "padding";
  choices: ChoiceDefinition[];
}

export default memo(function Choices({ type, choices }: ChoicesProps) {
  const { state, setState } = useStateContext();

  return (
    <RadioGroupPrimitive.Root
      defaultValue={state[type].id}
      value={state[type].id}
      onValueChange={(value: string) =>
        setState({ ...state, [type]: find(SUPPORTED_PADDING_CHOICES, value) })
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
              "hover:text-white",
              "focus:text-white focus:outline-1 focus:outline-offset-2 focus:outline-white",
              "radix-state-checked:bg-white/20 radix-state-checked:text-white"
            )}
          >
            {choice.label}
          </RadioGroupPrimitive.Item>
        ))}
      </div>
    </RadioGroupPrimitive.Root>
  );
});
