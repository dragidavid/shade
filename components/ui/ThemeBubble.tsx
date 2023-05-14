import { cn } from "lib/cn";

export default function ThemeBubble({ colors }: { colors: string[] }) {
  return (
    <div
      className={cn("h-4 w-4 rounded-full")}
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${colors.join(
          ", "
        )})`,
      }}
    />
  );
}
