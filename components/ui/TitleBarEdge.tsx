import { cn } from "lib/cn";

function Edge({ className }: { className?: string }) {
  return (
    <svg
      width={8}
      height={8}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 8a8 8 0 0 0 8-8v8H0Z" />
    </svg>
  );
}

export default function TitleBarEdge() {
  return (
    <div
      className={cn(
        "absolute left-0 -bottom-2 flex w-full justify-between fill-black/30"
      )}
    >
      <Edge className={cn("rotate-180")} />
      <Edge className={cn("-rotate-90")} />
    </div>
  );
}
