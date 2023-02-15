import clsx from "clsx";

interface ThemeBubbleProps {
  colors: string;
}

export default function ThemeBubble({ colors }: ThemeBubbleProps) {
  return (
    <div>
      <span
        className={clsx(
          "block h-4 w-4 rounded-full",
          "bg-gradient-to-br",
          colors
        )}
      />
    </div>
  );
}
