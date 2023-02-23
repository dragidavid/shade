import { cn } from "lib/cn";

interface ThemeBubbleProps {
  colors: string;
  additionalClasses?: string;
}

export default function ThemeBubble({
  colors,
  additionalClasses,
}: ThemeBubbleProps) {
  return (
    <div className={cn(additionalClasses)}>
      <span
        className={cn(
          "block h-4 w-4 rounded-full",
          "bg-gradient-to-br",
          colors
        )}
      />
    </div>
  );
}
