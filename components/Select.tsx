import { Fragment, memo } from "react";
import clsx from "clsx";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import type {
  LanguageDefinition,
  ThemeDefinition,
  FontDefinition,
} from "lib/types";

function ThemeBubble({ color }: { color: string }) {
  return (
    <span
      className={clsx("block h-4 w-4 rounded-full bg-gradient-to-br", color)}
    />
  );
}

interface SelectProps<T> {
  type: "language" | "theme" | "font";
  initialValue: T;
  setValue: (_: T) => void;
  options: T[];
}

export default memo(function Select<
  T extends LanguageDefinition | ThemeDefinition | FontDefinition
>({ type, initialValue, setValue, options }: SelectProps<T>) {
  const getClassName = (fontVariable: string) => {
    switch (fontVariable) {
      case "var(--font-fira-code)":
        return "font-firaCode";
      case "var(--font-jetbrains-mono)":
        return "font-jetBrainsMono";
      case "var(--font-inconsolata)":
        return "font-inconsolata";
      case "var(--font-source-code-pro)":
        return "font-sourceCodePro";
      default:
        return "font-mono";
    }
  };

  const getInitialValue = (type: string) => {
    switch (type) {
      case "language":
        return <span>{(initialValue as LanguageDefinition).label}</span>;
      case "theme":
        return <ThemeBubble color={(initialValue as ThemeDefinition).class} />;
      case "font":
        return (
          <span
            className={clsx(
              getClassName((initialValue as FontDefinition).variable)
            )}
          >
            {(initialValue as FontDefinition).label}
          </span>
        );

      default:
        return null;
    }
  };

  const getOptionContent = (
    type: string,
    option: LanguageDefinition | ThemeDefinition | FontDefinition
  ) => {
    switch (type) {
      case "language":
        return (
          <span className="block truncate pr-9">
            {(option as LanguageDefinition).label}
          </span>
        );
      case "theme":
        return (
          <>
            <ThemeBubble color={(option as ThemeDefinition).class} />
            <span className="block truncate">
              {(option as ThemeDefinition).label}
            </span>
          </>
        );
      case "font":
        return (
          <span
            className={clsx(
              "block truncate pr-9",
              getClassName((option as FontDefinition).variable)
            )}
          >
            {(option as FontDefinition).label}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Listbox value={initialValue} onChange={setValue}>
      <div className="relative">
        <Listbox.Button
          className={clsx(
            "flex w-auto select-none items-center justify-between gap-3 rounded-lg p-2 text-xs",
            "border-[1px] border-white/20 bg-black",
            "transition-colors duration-200 ease-in-out",
            "hover:cursor-pointer hover:bg-white/20 focus:outline-none",
            type === "language" && "w-32",
            type === "font" && "w-40"
          )}
        >
          {getInitialValue(type)}

          <span className="pointer-events-none">
            <ChevronDownIcon className="h-3 w-3 " aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition-all transform ease-in-out duration-200"
          enterFrom="opacity-0 scale-90"
          enterTo="opacity-100"
          leave="transition-all transform ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 scale-90"
        >
          <Listbox.Options
            className={clsx(
              "absolute z-10 max-h-80 -translate-x-1/4 -translate-y-3/4 space-y-1 overflow-auto rounded-xl p-2",
              "border-[1px] border-white/20 bg-black",
              "focus:outline-none"
            )}
          >
            {options.map((option) => (
              <Listbox.Option
                key={`${type}-${option.id}`}
                value={option}
                className={clsx(
                  "flex items-center gap-3 rounded-lg p-2 text-xs",
                  "cursor-pointer select-none",
                  "transition-colors duration-200 ease-in-out",
                  "ui-active:bg-white/20 ui-active:text-white",
                  "ui-selected:bg-white/20 ui-selected:text-white"
                )}
              >
                {getOptionContent(type, option)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
});
