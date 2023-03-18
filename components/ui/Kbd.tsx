import { cn } from "lib/cn";

export default function Kbd({ keys }: { keys: string[] }) {
  return (
    <div className={cn("flex items-center gap-1")}>
      {keys.map((key) => (
        <kbd
          key={key}
          className={cn(
            "rounded-[4px] py-0.5 px-1.5 font-sans font-medium",
            "bg-white/20"
          )}
        >
          {key}
        </kbd>
      ))}
    </div>
  );
}
