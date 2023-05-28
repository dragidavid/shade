import { useState, useRef, useMemo } from "react";
import {
  MotionValue,
  AnimatePresence,
  motion,
  useDragControls,
  useAnimationControls,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";

import { GripHorizontal, RefreshCcw } from "lucide-react";

import Angle from "components/Settings/Angle";
import Picker from "components/Settings/Picker";
import Select from "components/Settings/Select";
import Switch from "components/Settings/Switch";
import Choices from "components/Settings/Choices";
import Actions from "components/Settings/Actions";

import {
  BASE_LANGUAGES,
  BASE_THEMES,
  BASE_FONT_FAMILIES,
  BASE_FONT_SIZES,
  BASE_PADDING_VALUES,
  BASE_COLOR_MODES,
} from "lib/values";

import { cn } from "lib/cn";
import { useStore } from "lib/store";

export default function Settings() {
  const [hasMoved, setHasMoved] = useState(false);

  const constraintsRef = useRef(null);

  const dragControls = useDragControls();
  const animationControls = useAnimationControls();
  const isDragging = useMotionValue(false);

  const creatingCustomTheme = useStore((state) => state.creatingCustomTheme);

  return (
    <>
      <div
        key={`settings-expanded-${creatingCustomTheme}`}
        ref={constraintsRef}
        className={cn(
          "fixed bottom-6 left-6 right-6 top-[88px] -z-10",
          "pointer-events-none"
        )}
      />

      <motion.div
        id="settings"
        drag
        dragListener={false}
        dragMomentum={false}
        dragControls={dragControls}
        dragConstraints={constraintsRef}
        onDragStart={() => isDragging.set(true)}
        onDragEnd={(_, info) => {
          isDragging.set(false);

          if (!hasMoved && (info.point.x !== 0 || info.point.y !== 0)) {
            setHasMoved(true);
          }
        }}
        animate={animationControls}
        onUpdate={({ x, y }) => {
          if (hasMoved && x === 0 && y === 0) {
            setHasMoved(false);
          }
        }}
        className={cn(
          "fixed bottom-12 z-40 w-[960px] rounded-xl font-medium",
          "border border-white/20 bg-black/50 shadow-xl shadow-black/40 backdrop-blur-md"
        )}
      >
        <DraggableHandle
          dragControls={dragControls}
          animationControls={animationControls}
          hasMoved={hasMoved}
          isDragging={isDragging}
        />

        <div
          className={cn(
            "relative flex-col overflow-hidden rounded-xl px-4 pb-4 pt-5",
            "border-b border-white/20 bg-black shadow-xl shadow-black/40",
            "transition-all duration-100 ease-in-out",
            creatingCustomTheme ? "h-[211px]" : "h-[97px]"
          )}
        >
          <BasicSnippetControls />

          {creatingCustomTheme && <CustomThemeControls />}
        </div>

        <Actions />
      </motion.div>
    </>
  );
}

function DraggableHandle({
  dragControls,
  animationControls,
  hasMoved,
  isDragging,
}: {
  dragControls: ReturnType<typeof useDragControls>;
  animationControls: ReturnType<typeof useAnimationControls>;
  hasMoved: boolean;
  isDragging: MotionValue<boolean>;
}) {
  const [localIsDragging, setLocalIsDragging] = useState(false);

  useMotionValueEvent(isDragging, "change", (latest) => {
    setLocalIsDragging(latest);
  });

  const icon = useMemo(() => {
    if (!hasMoved || localIsDragging) {
      return <GripHorizontal size={16} aria-hidden={true} />;
    }

    return <RefreshCcw size={14} aria-hidden={true} />;
  }, [hasMoved, localIsDragging]);

  return (
    <motion.div
      onPointerDown={(e) => {
        dragControls.start(e, { snapToCursor: false });
      }}
      onTap={() => {
        if (hasMoved) {
          animationControls.start({
            x: 0,
            y: 0,
          });
        }
      }}
      whileTap={{ cursor: "grabbing" }}
      tabIndex={-1}
      className={cn(
        "absolute -top-[15px] left-1/2 z-50 flex h-7 w-9 items-center justify-center rounded-md",
        "touch-none select-none outline-none",
        "border border-white/20 bg-black",
        "transition-all duration-100 ease-in-out",
        "hover:scale-110 hover:cursor-grab hover:border-almost-white",
        "active:scale-110 active:border-almost-white"
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={hasMoved && !localIsDragging ? "refresh" : "grip"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.08, delay: 0.08 }}
        >
          {icon}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function BasicSnippetControls() {
  return (
    <div className={cn("flex justify-evenly gap-8")}>
      <Control htmlFor="language" label="Language">
        <Select type="language" options={BASE_LANGUAGES} />
      </Control>
      <Control htmlFor="theme" label="Theme">
        <Select type="theme" options={BASE_THEMES} />
      </Control>
      <Control htmlFor="fontFamily" label="Font family">
        <Select type="fontFamily" options={BASE_FONT_FAMILIES} />
      </Control>
      <Control htmlFor="fontSize" label="Font size">
        <Choices type="fontSize" choices={BASE_FONT_SIZES} />
      </Control>
      <Control htmlFor="lineNumbers" label="Line numbers">
        <Switch type="lineNumbers" />
      </Control>
      <Control htmlFor="padding" label="Padding">
        <Choices type="padding" choices={BASE_PADDING_VALUES} />
      </Control>
    </div>
  );
}

function CustomThemeControls() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, delay: 0.2 }}
      className={cn(
        "mt-4 flex justify-evenly gap-8 rounded-xl pb-4 pt-5",
        "stripes border border-dashed border-white/20 bg-white/[0.04]"
      )}
    >
      <Control htmlFor="colors" label="Colors">
        <Picker />
      </Control>
      <Control htmlFor="colorMode" label="Color mode">
        <Choices type="colorMode" choices={BASE_COLOR_MODES} />
      </Control>
      <Control htmlFor="gradientAngle" label="Gradient angle">
        <Angle />
      </Control>
      <Control htmlFor="grain" label="Grain">
        <Switch type="grain" />
      </Control>
    </motion.div>
  );
}

function Control({
  htmlFor,
  label,
  children,
}: {
  htmlFor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("relative flex min-w-max flex-col justify-between gap-3")}
    >
      <label htmlFor={htmlFor} className={cn("text-xs font-bold")}>
        {label}
      </label>

      {children}
    </div>
  );
}
