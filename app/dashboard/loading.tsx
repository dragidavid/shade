import { Loader2 } from "lucide-react";

import { cn } from "lib/cn";

export default function Loading() {
  return (
    <div className={cn("flex items-center justify-center py-4")}>
      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
    </div>
  );
}
