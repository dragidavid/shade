import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

export default function Angle() {
  const customColorsCount = useStore((state) => state.customColors.length);
  const angle = useStore((state) => state.angle);
  const update = useStore((state) => state.update);

  return (
    <div className={cn("flex h-full items-center gap-2")}>
      <SliderPrimitive.Root
        defaultValue={[angle]}
        onValueChange={(value) => update("angle", value[0])}
        max={360}
        step={1}
        disabled={customColorsCount === 1}
        className={cn(
          "relative flex h-5 w-32 items-center",
          "touch-none select-none"
        )}
      >
        <SliderPrimitive.Track
          className={cn("relative h-1 grow rounded-full", "bg-white/20")}
        >
          <SliderPrimitive.Range
            className={cn(
              "absolute h-full rounded-full",
              "bg-almost-white",
              "radix-disabled:bg-white/30"
            )}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb asChild aria-label="gradient-angle">
          <div
            className={cn(
              "relative h-5 w-5 rounded-full",
              "select-none outline-none",
              "transition-all duration-100 ease-in-out",
              "border border-almost-white bg-black",
              "hover:scale-110 hover:cursor-pointer",
              "focus:ring-1 focus:ring-almost-white focus:ring-offset-2 focus:ring-offset-black",
              "radix-disabled:hidden"
            )}
          >
            <div
              className={cn("absolute inset-0", "pointer-events-none")}
              style={{
                transform: `rotate(${angle}deg)`,
              }}
            >
              <span
                className={cn(
                  "absolute left-[calc(50%-1px)] top-0 h-1/2 w-0.5 rounded-b-full",
                  "pointer-events-none",
                  "bg-gradient-to-b from-almost-white to-transparent"
                )}
              />
            </div>
          </div>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    </div>
  );
}
