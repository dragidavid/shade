import clsx from "clsx";

import Auth from "components/Top/Auth";

export default function Top() {
  return (
    <div
      className={clsx(
        "flex h-16 items-center justify-between px-[18px]",
        "border-b-[1px] border-white/20 bg-black text-white/70 shadow-xl"
      )}
    >
      <div>
        <h1>Logo?</h1>
      </div>

      <Auth />
    </div>
  );
}
