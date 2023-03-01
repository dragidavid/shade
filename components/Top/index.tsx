import Auth from "components/Top/Auth";
import HomeLink from "components/Top/HomeLink";
import SaveStatus from "components/Top/SaveStatus";

import { cn } from "lib/cn";

export default function Top() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-16 items-center justify-between px-[18px] text-sm font-medium shadow-xl",
        "border-b-[1px] border-white/20 bg-black text-white/70"
      )}
    >
      <HomeLink />

      <SaveStatus />

      <Auth />
    </header>
  );
}
