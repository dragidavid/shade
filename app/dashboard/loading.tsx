import Loader from "components/ui/Loader";

import { cn } from "lib/cn";

export default function Loading() {
  return (
    <div className={cn("flex items-center justify-center py-4")}>
      <Loader />
    </div>
  );
}
