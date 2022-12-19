import clsx from "clsx";

import { SUPPORTED_THEMES } from "lib/themes";

import type { ThemeDefinition } from "lib/types";

export default function Colors() {
  return (
    <main
      id="main"
      className="flex min-h-full flex-col items-center justify-center"
    >
      {SUPPORTED_THEMES.map((option: ThemeDefinition) => {
        return (
          <div key={option.id} className="mt-4 flex flex-wrap gap-4">
            <div
              className={clsx(
                "h-10 w-10 rounded-md",
                "bg-gradient-to-br",
                option.class
              )}
            />
            <span className="flex justify-center pt-1 text-2xl font-black">
              -
            </span>
            <div className="flex gap-3">
              {option.generatedColors.map((color, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center"
                >
                  <div
                    className="h-10 w-10 rounded-md"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-black text-white/70">
                    {index}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </main>
  );
}
