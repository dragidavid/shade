import { cn } from "lib/cn";

export default function Kbd({ keys }: { keys: string[] }) {
  return (
    <div className={cn("flex items-center gap-1")}>
      {keys.map((key) => (
        <kbd
          key={key}
          className={cn(
            "rounded-[4px] py-[2px] px-[6px] font-sans font-medium",
            "bg-white/20"
          )}
        >
          {key}
        </kbd>
      ))}
    </div>
  );
}
