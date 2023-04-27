import { useState, useEffect, useMemo } from "react";
import va from "@vercel/analytics";
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

import Select from "components/Settings/Select";
import Switch from "components/Settings/Switch";
import Choices from "components/Settings/Choices";
import Actions from "components/Settings/Actions";

import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_THEMES,
  SUPPORTED_FONT_STYLES,
  SUPPORTED_FONT_SIZES,
  SUPPORTED_PADDING_CHOICES,
} from "lib/values";

import { cn } from "lib/cn";

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
  const [editorDimensions, setEditorDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });
  const [dragConstraints, setDragConstraints] = useState<DragConstraints>({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const [hasMoved, setHasMoved] = useState<boolean>(false);

  const dragControls = useDragControls();
  const animationControls = useAnimationControls();
  const isDragging = useMotionValue(false);

  useEffect(() => {
    const editor = document.getElementById("editor");

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setEditorDimensions({
          height: editor!.offsetHeight,
          width: editor!.offsetWidth,
        });

        animationControls.start({
          x: 0,
          y: 0,
        });
      }, 500);
    };

    setEditorDimensions({
      height: editor!.offsetHeight,
      width: editor!.offsetWidth,
    });

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);

      window.removeEventListener("resize", handleResize);
    };
  }, [animationControls]);

  useEffect(() => {
    const settings = document.getElementById("settings");

    setDragConstraints({
      top: -settings!.offsetTop + 88.6,
      left:
        -editorDimensions.width +
        settings!.offsetWidth +
        settings!.offsetLeft +
        24,
      right:
        editorDimensions.width -
        settings!.offsetWidth -
        settings!.offsetLeft -
        24,
      bottom:
        editorDimensions.height -
        settings!.offsetHeight -
        settings!.offsetTop +
        40.9,
    });
  }, [editorDimensions.height, editorDimensions.width]);

  return (
    <motion.div
      id="settings"
      drag
      dragListener={false}
      dragMomentum={false}
      dragControls={dragControls}
      dragConstraints={dragConstraints}
      onDragStart={() => {
        isDragging.set(true);

        va.track("settings_drag");
      }}
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
        "fixed bottom-12 z-40 rounded-xl font-medium",
        "border border-white/20 bg-black/50 shadow-xl shadow-black/40 backdrop-blur-md"
      )}
    >
      <DraggableHandle
        dragControls={dragControls}
        animationControls={animationControls}
        hasMoved={hasMoved}
        isDragging={isDragging}
      />

      <SettingsControls />

      <Actions />
    </motion.div>
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
  const [localIsDragging, setLocalIsDragging] = useState<boolean>(false);

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

          va.track("settings_position_reset");
        }
      }}
      whileTap={{ cursor: "grabbing" }}
      tabIndex={-1}
      className={cn(
        "absolute -top-[15px] left-1/2 flex h-7 w-9 items-center justify-center rounded-md",
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

function SettingsControls() {
  return (
    <div
      className={cn(
        "flex gap-8 rounded-xl px-4 pb-4 pt-5",
        "border-b border-white/20 bg-black shadow-xl shadow-black/40"
      )}
    >
      <Control htmlFor="language" label="Language">
        <Select type="language" options={SUPPORTED_LANGUAGES} />
      </Control>
      <Control htmlFor="theme" label="Theme">
        <Select type="theme" options={SUPPORTED_THEMES} />
      </Control>
      <Control htmlFor="fontStyle" label="Font style">
        <Select type="fontStyle" options={SUPPORTED_FONT_STYLES} />
      </Control>
      <Control htmlFor="fontSize" label="Font size">
        <Choices type="fontSize" choices={SUPPORTED_FONT_SIZES} />
      </Control>
      <Control htmlFor="lineNumbers" label="Line numbers">
        <Switch type="lineNumbers" />
      </Control>
      <Control htmlFor="padding" label="Padding">
        <Choices type="padding" choices={SUPPORTED_PADDING_CHOICES} />
      </Control>
    </div>
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
    <div className={cn("relative flex min-w-max flex-col gap-3")}>
      <label htmlFor={htmlFor} className={cn("text-xs font-bold")}>
        {label}
      </label>

      {children}
    </div>
  );
}
