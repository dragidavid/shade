import clsx from "clsx";

import { backgroundOptions } from "contexts/SettingsContext";

import type { GradientBackground } from "lib/types";

export default function Colors() {
  return (
    <main
      id="main"
      className="flex min-h-full flex-col items-center justify-center"
    >
      <h1 className="text-4xl font-bold text-white">Color testing</h1>

      {backgroundOptions.map((option: GradientBackground) => {
        return (
          <div key={option.name} className="mt-4 flex flex-wrap gap-4">
            <div
              className={clsx(
                "h-20 w-20 rounded-md",
                "bg-gradient-to-br",
                option.class
              )}
            />
            <span className="flex items-center justify-center text-2xl font-black">
              -
            </span>
            <div className="flex gap-3">
              {option.generatedColors.map((color, index) => (
                <div
                  key={index}
                  className="h-20 w-20 rounded-md"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </main>
  );
}
