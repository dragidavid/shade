"use client";

import Home from "components/Header/Home";
import SaveStatus from "components/Header/SaveStatus";
import Auth from "components/Header/Auth";

import { cn } from "lib/cn";

export default function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-16 items-center justify-between px-[18px] font-medium shadow-xl",
        "border-b-[1px] border-white/20 bg-black"
      )}
    >
      <Home />

      <SaveStatus />

      <Auth />
    </header>
  );
}
