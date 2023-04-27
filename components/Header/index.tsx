"use client";

import { useSession } from "next-auth/react";

import Home from "components/Header/Home";
import Message from "components/Header/Message";
import Social from "components/Header/Social";
import Help from "components/Header/Help";
import Auth from "components/Header/Auth";

import { cn } from "lib/cn";

export default function Header() {
  const { status: sessionStatus } = useSession();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center justify-between px-[18px] font-medium",
        "border-b border-white/20 bg-black shadow-xl shadow-black/40"
      )}
    >
      <Home />

      <Message />

      {sessionStatus !== "loading" && (
        <div className={cn("flex items-center justify-center")}>
          <Social />

          <Help />

          <Auth />
        </div>
      )}
    </header>
  );
}
