"use client";

import { X } from "lucide-react";

import { cn } from "lib/cn";

export default function Error({ error }: { error: Error }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-4",
        "text-red-500"
      )}
    >
      <X size={16} aria-hidden="true" />
      <span>{error?.message ?? "An error has occured"}</span>
    </div>
  );
}
