import { useState, useEffect } from "react";
import { motion, useDragControls, useAnimationControls } from "framer-motion";

import { GripHorizontal } from "lucide-react";

import { cn } from "lib/cn";

import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_THEMES,
  SUPPORTED_FONT_STYLES,
  SUPPORTED_PADDING_CHOICES,
} from "lib/values";

import Select from "components/Settings/Select";
import Switch from "components/Settings/Switch";
import Choices from "components/Settings/Choices";

interface Dimensions {
  height: number;
  width: number;
}

interface DragConstraints {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export default function Settings() {
  const [mainDimensions, setMainDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });
  const [dragConstraints, setDragConstraints] = useState<DragConstraints>({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const dragControls = useDragControls();
  const animationControls = useAnimationControls();

  useEffect(() => {
    const main = document.getElementById("main");
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMainDimensions({
          height: main!.offsetHeight,
          width: main!.offsetWidth,
        });

        animationControls.start({
          x: 0,
          y: 0,
        });
      }, 500);
    };

    setMainDimensions({ height: main!.offsetHeight, width: main!.offsetWidth });

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);

      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const settings = document.getElementById("settings");

    setDragConstraints({
      top: -settings!.offsetTop + 88,
      left:
        -mainDimensions.width +
        settings!.offsetWidth +
        settings!.offsetLeft +
        24,
      right:
        mainDimensions.width -
        settings!.offsetWidth -
        settings!.offsetLeft -
        24,
      bottom:
        mainDimensions.height -
        settings!.offsetHeight -
        settings!.offsetTop -
        24,
    });
  }, [mainDimensions.height, mainDimensions.width]);

  return (
    <motion.div
      id="settings"
      drag
      dragListener={false}
      dragMomentum={false}
      dragControls={dragControls}
      dragConstraints={dragConstraints}
      animate={animationControls}
      className={cn(
        "fixed bottom-32 z-10 rounded-xl p-4 text-sm font-medium shadow-xl",
        "border-[1px] border-white/20 bg-black text-white/70 opacity-30",
        "transition-opacity duration-100 ease-in-out",
        "hover:opacity-100",
        "focus-within:opacity-100"
      )}
    >
      <motion.div
        onPointerDown={(e) => dragControls.start(e, { snapToCursor: false })}
        whileTap={{
          cursor: "grabbing",
        }}
        tabIndex={-1}
        className={cn(
          "absolute -top-[12px] left-1/2 rounded-md py-1 px-2",
          "select-none outline-none",
          "border-[1px] border-white/20 bg-black",
          "transition-all duration-100 ease-in-out",
          "hover:scale-125 hover:cursor-grab hover:border-white",
          "active:scale-125 active:border-white"
        )}
      >
        <GripHorizontal size={16} aria-hidden={true} />
      </motion.div>
      <div
        className={cn(
          "flex gap-8",
          "[&>div]:relative [&>div]:flex [&>div]:min-w-max [&>div]:flex-col [&>div]:gap-3",
          "[&>div>label]:text-xs [&>div>label]:font-bold"
        )}
      >
        <div>
          <label htmlFor="language">Language</label>
          <Select type="language" options={SUPPORTED_LANGUAGES} />
        </div>
        <div>
          <label htmlFor="theme">Theme</label>
          <Select type="theme" options={SUPPORTED_THEMES} />
        </div>
        <div>
          <label htmlFor="font">Font</label>
          <Select type="fontStyle" options={SUPPORTED_FONT_STYLES} />
        </div>
        <div>
          <label htmlFor="lineNumbers">Line numbers</label>
          <Switch type="lineNumbers" />
        </div>
        <div>
          <label htmlFor="padding">Padding</label>
          <Choices type="padding" choices={SUPPORTED_PADDING_CHOICES} />
        </div>
      </div>
    </motion.div>
  );
}
