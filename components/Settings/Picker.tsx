import { HexColorPicker, HexColorInput } from "react-colorful";
import chroma from "chroma-js";

import { Minus, Plus } from "lucide-react";

import Popover from "components/ui/Popover";

import { cn } from "lib/cn";
import { useStore } from "lib/store";
import { debounce } from "lib/debounce";

export default function Picker() {
  const colors = useStore((state) => state.customTheme.colors);
  const setColor = useStore((state) => state.customTheme.setColor);
  const addColor = useStore((state) => state.customTheme.addColor);
  const removeColor = useStore((state) => state.customTheme.removeColor);

  return (
    <div className={cn("flex h-8 w-28 gap-2 rounded-lg")}>
      {colors.map((color, i) => (
        <div key={i} className={cn("relative", "group")}>
          <Popover
            content={
              <SingleColor
                color={color}
                setColor={(newColor) => setColor(newColor, i)}
              />
            }
            sideOffset={12}
          >
            <button
              className={cn(
                "h-full w-8 overflow-hidden rounded-lg",
                "outline-none",
                "border-2 border-white/20",
                "transition-all animate-in zoom-in duration-100 ease-in-out",
                "focus:ring-1 focus:ring-almost-white focus:ring-offset-2 focus:ring-offset-black"
              )}
              style={{
                background: color,
              }}
            />
          </Popover>

          {colors.length > 1 && (
            <button
              onClick={() => removeColor(i)}
              className={cn(
                "absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full",
                "select-none outline-none",
                "border border-white/20 bg-black",
                "transition-all animate-in zoom-in duration-100 ease-in-out",
                "hover:border-almost-white hover:text-almost-white",
                "group-hover:flex"
              )}
            >
              <Minus size={12} aria-hidden="true" />
              <span className="sr-only">Remove color</span>
            </button>
          )}
        </div>
      ))}

      {colors.length < 3 && (
        <button
          onClick={() => addColor(chroma.random().hex())}
          className={cn(
            "flex h-full w-8 items-center justify-center rounded-lg",
            "select-none outline-none",
            "transition-all duration-100 ease-in-out",
            "hover:bg-white/20 hover:text-almost-white",
            "focus:text-almost-white focus:outline-1 focus:outline-offset-2 focus:outline-almost-white"
          )}
        >
          <Plus size={18} aria-hidden="true" />
          <span className="sr-only">Add color</span>
        </button>
      )}
    </div>
  );
}

function SingleColor({
  color,
  setColor,
}: {
  color: string;
  setColor: (color: string) => void;
}) {
  return (
    <section className={cn("flex flex-col gap-3", "picker")}>
      <HexColorPicker color={color} onChange={debounce(setColor, 300)} />
      <HexColorInput
        color={color}
        onChange={debounce(setColor, 300)}
        className={cn(
          "text-center font-medium uppercase",
          "outline-none",
          "bg-transparent text-almost-white/40",
          "transition-all duration-100 ease-in-out",
          "focus:text-almost-white"
        )}
      />
    </section>
  );
}
