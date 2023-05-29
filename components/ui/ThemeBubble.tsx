import { cn } from "lib/cn";
import { useStore } from "lib/store";

export default function ThemeBubble({
  colors,
  useCustomColorsFromStore = false,
}: {
  colors: string[];
  useCustomColorsFromStore?: boolean;
}) {
  const customColors = useStore((state) => state.customColors);
  const angle = useStore((state) => state.angle);

  return (
    <div
      className={cn("h-4 w-4 rounded-full")}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${(useCustomColorsFromStore
          ? customColors
          : colors
        ).join(", ")})`,
      }}
    />
  );
}
