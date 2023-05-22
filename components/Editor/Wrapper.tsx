"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const creatingCustomTheme = useStore((state) => state.creatingCustomTheme);
  const theme = useStore((state) => state.theme);
  const padding = useStore((state) => state.padding);
  const colors = useStore((state) => state.colors);
  const angle = useStore((state) => state.angle);

  const baseColors = useMemo(() => {
    return creatingCustomTheme ? colors : theme.baseColors;
  }, [creatingCustomTheme, theme.baseColors, colors]);

  return (
    <motion.div
      animate={{
        opacity: 1,
        transition: { duration: 0.1, delay: 0.05 },
      }}
      initial={{
        opacity: 0,
      }}
      className={cn("overflow-hidden", "shadow-xl shadow-black/40")}
      style={{
        borderRadius: 8 + +padding / 10,
      }}
    >
      <div
        id="screenshot"
        className={cn(
          "relative z-0 w-auto min-w-[512px] max-w-5xl",
          "transition-all duration-100 ease-in-out"
        )}
        style={{
          padding: `${padding}px`,
          backgroundImage: `linear-gradient(${angle}deg, ${baseColors[0]}, ${baseColors[1]})`,
        }}
      >
        <div
          className={cn(
            "relative z-[1] h-full w-full min-w-[480px] max-w-2xl rounded-lg"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-lg",
              "after:absolute after:inset-0 after:z-[2] after:translate-y-6 after:rounded-xl after:bg-black/60 after:blur-xl"
            )}
          >
            <div
              className={cn("absolute inset-0 z-[3] rounded-lg")}
              style={{
                backgroundImage: `linear-gradient(${angle}deg, ${baseColors[0]}, ${baseColors[1]})`,
              }}
            />
          </div>
          <div className={cn("relative z-[4] rounded-lg", "bg-black/70")}>
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
