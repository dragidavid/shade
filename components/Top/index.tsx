import clsx from "clsx";

import Auth from "components/Top/Auth";
import DashboardLink from "components/Top/DashboardLink";
import SaveStateIndicator from "./SaveStateIndicator";

export default function Top() {
  return (
    <div
      className={clsx(
        "grid h-16 grid-cols-3 content-center px-[18px]",
        "[&>*:nth-child(1)]:justify-self-start [&>*:nth-child(2)]:justify-self-center [&>*:nth-child(3)]:justify-self-end",
        "border-b-[1px] border-white/20 bg-black text-white/70 shadow-xl"
      )}
    >
      <DashboardLink />

      <SaveStateIndicator />

      <Auth />
    </div>
  );
}
