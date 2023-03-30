import { cn } from "lib/cn";

export default function Views({ views }: { views: number }) {
  return (
    <div className={cn("absolute top-6 left-6 text-xs")}>
      {views.toLocaleString() ?? "?"} views
    </div>
  );
}
