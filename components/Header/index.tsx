"use client";

import Home from "components/Header/Home";
import Message from "components/Header/Message";
import Auth from "components/Header/Auth";

import { cn } from "lib/cn";

export default function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center justify-between px-[18px] font-medium",
        "border-b border-white/20 bg-black shadow-xl shadow-black/40"
      )}
    >
      <Home />

      <Message />

      <Auth />
    </header>
  );
}
