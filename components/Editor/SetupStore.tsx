"use client";

import { useRef } from "react";

import { useStore } from "lib/store";

import type { Snippet } from "@prisma/client";

export default function SetupStore({ snippet }: { snippet: Snippet }) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useStore.getState().setAppState(snippet);

    initialized.current = true;
  }

  return null;
}
