import { cn } from "lib/cn";

export default function Loader({ extraClasses }: { extraClasses?: string }) {
  return (
    <span
      className={cn(
        "h-3.5 w-3.5 rounded-full",
        "border-2 border-greyish border-t-transparent",
        "animate-spin",
        extraClasses
      )}
      aria-hidden="true"
    />
  );
}
