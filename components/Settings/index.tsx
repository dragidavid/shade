import { useState, useEffect, useMemo } from "react";
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
  const [hasMoved, setHasMoved] = useState(false);

  const dragControls = useDragControls();
  const animationControls = useAnimationControls();
  const isDragging = useMotionValue(false);

  const creatingCustomTheme = useStore((state) => state.creatingCustomTheme);

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

      <div className={cn("relative overflow-hidden rounded-xl", "bg-black")}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={creatingCustomTheme ? "theme" : "snippet"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div
              className={cn(
                "flex justify-evenly gap-8 rounded-xl px-4 pb-4 pt-5",
                "border-b border-white/20 shadow-xl shadow-black/40",
                creatingCustomTheme && "stripes"
              )}
            >
              {creatingCustomTheme ? (
                <CustomThemeControls />
              ) : (
                <BasicSnippetControls />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

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
    <>
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
    </>
  );
}

function CustomThemeControls() {
  return (
    <>
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
    </>
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
