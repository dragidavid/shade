import { memo } from "react";
import clsx from "clsx";
import { RadioGroup } from "@headlessui/react";

import { useStateContext } from "contexts/State";

import type { ChoiceDefinition } from "lib/types";

interface ChoicesProps {
  type: "padding";
  choices: ChoiceDefinition[];
}

export default memo(function Choices({ type, choices }: ChoicesProps) {
  const { state, setState } = useStateContext();

  return (
    <RadioGroup
      value={state[type]}
      onChange={(value: ChoiceDefinition) =>
        setState({ ...state, padding: value })
      }
    >
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
});
