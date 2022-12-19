import clsx from "clsx";
import { RadioGroup } from "@headlessui/react";

import type { ChoiceDefinition } from "lib/types";

interface ChoicesProps {
  initialValue: ChoiceDefinition;
  setValue: (_: ChoiceDefinition) => void;
  choices: ChoiceDefinition[];
}

export default function Choices({
  initialValue,
  setValue,
  choices,
}: ChoicesProps) {
  return (
    <RadioGroup value={initialValue} onChange={setValue}>
      <div className="flex gap-3 py-[7px] text-sm">
        {choices.map((choice) => (
          <RadioGroup.Option
            key={choice.id}
            value={choice}
            className={clsx(
              "cursor-pointer select-none rounded-md",
              "ui-active:text-white ui-active:outline-none"
            )}
          >
            <span
              className={clsx(
                "rounded-md py-1 px-2",
                "transition-colors duration-100 ease-in-out",
                "ui-checked:bg-white/20 ui-checked:text-white"
              )}
            >
              {choice.label}
            </span>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
