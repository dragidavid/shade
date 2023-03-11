"use client";

import { SessionProvider } from "next-auth/react";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TooltipPrimitive.Provider delayDuration={0}>
        {children}
      </TooltipPrimitive.Provider>
    </SessionProvider>
  );
}
