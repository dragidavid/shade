"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import chroma from "chroma-js";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const [marginTop, setMarginTop] = useState(15);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const creatingCustomTheme = useStore((state) => state.creatingCustomTheme);
  const theme = useStore((state) => state.theme);
  const padding = useStore((state) => state.padding);
  const customColors = useStore((state) => state.customColors);
  const colorMode = useStore((state) => state.colorMode);
  const angle = useStore((state) => state.angle);
  const grain = useStore((state) => state.grain);

  const baseColors = useMemo(() => {
    return creatingCustomTheme ? customColors : theme.baseColors;
  }, [creatingCustomTheme, theme.baseColors, customColors]);

  const gradientColors = useMemo(() => {
    return baseColors.length === 1
      ? [...baseColors, baseColors[0]]
      : chroma
          .scale(baseColors)
          .mode(colorMode)
          .colors(baseColors.length + (baseColors.length - 1));
  }, [baseColors, colorMode]);

  useEffect(() => {
    const updateSize = () => {
      if (wrapperRef.current) {
        const viewportHeight = window.innerHeight;
        const divHeight = wrapperRef.current.clientHeight;
        const heightPercentage = (divHeight / viewportHeight) * 100;

        if (heightPercentage > 50) {
          const excessPercentage = heightPercentage - 50;
          const marginTopReduction = excessPercentage / 0.5;
          const newMarginTop = Math.max(0, 15 - marginTopReduction * 0.5);

          if (newMarginTop !== marginTop) {
            setMarginTop(newMarginTop);
          }
        } else if (marginTop !== 15) {
          setMarginTop(15);
        }
      }
    };

    if (wrapperRef.current) {
      const observer = new ResizeObserver(updateSize);

      observer.observe(wrapperRef.current);

      window.addEventListener("resize", updateSize);

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", updateSize);
      };
    }
  }, [marginTop]);

  return (
    <motion.div
      ref={wrapperRef}
      layoutId="wrapper"
      animate={{
        opacity: 1,
        transition: { duration: 0.1, delay: 0.05 },
      }}
      initial={{
        opacity: 0,
      }}
      className={cn("overflow-hidden", "shadow-xl shadow-black/40")}
      style={{
        marginTop: `${marginTop}vh`,
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
          backgroundImage: `linear-gradient(${angle}deg, ${gradientColors.join(
            ", "
          )})`,
        }}
      >
        <div
          className={cn(
            "invisible absolute inset-0",
            "bg-noise bg-contain opacity-20",
            grain && "visible"
          )}
        />

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
                backgroundImage: `linear-gradient(${angle}deg, ${gradientColors.join(
                  ", "
                )})`,
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
