import { cn } from "lib/cn";

export default function NotFound() {
  return (
    <div className={cn("flex items-center justify-center")}>
      <h1 className={cn("text-4xl font-extrabold")}>404</h1>
    </div>
  );
}
