import { cn } from "lib/cn";

export default function Loader() {
  return (
    <span
      className={cn(
        "h-3.5 w-3.5 rounded-full",
        "border-2 border-greyish border-t-transparent",
        "animate-spin"
      )}
      aria-hidden="true"
    />
  );
}
