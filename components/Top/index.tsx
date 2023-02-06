import clsx from "clsx";

import Auth from "components/Top/Auth";
import HomeLink from "components/Top/HomeLink";
import SaveStateIndicator from "./SaveStateIndicator";

export default function Top() {
  return (
    <div
      className={clsx(
        "relative flex h-16 items-center justify-between px-[18px]",
        "border-b-[1px] border-white/20 bg-black text-white/70 shadow-xl"
      )}
    >
      <HomeLink />

      <SaveStateIndicator />

      <Auth />
    </div>
  );
}
