import { useState, useEffect } from "react";
import { motion, useDragControls, useAnimationControls } from "framer-motion";

import { GripHorizontal } from "lucide-react";

import Select from "components/Settings/Select";
import Switch from "components/Settings/Switch";
import Choices from "components/Settings/Choices";

import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_THEMES,
  SUPPORTED_FONT_STYLES,
  SUPPORTED_PADDING_CHOICES,
} from "lib/values";

import { cn } from "lib/cn";
import { snap } from "lib/snap";

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

  const dragControls = useDragControls();
  const animationControls = useAnimationControls();

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
  }, []);

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
      animate={animationControls}
      className={cn(
        "fixed bottom-12 z-40 rounded-xl p-5 font-medium",
        "border border-white/20 bg-black opacity-40 shadow-xl shadow-black/40",
        "transition-opacity duration-100 ease-in-out",
        "hover:opacity-100",
        "focus-within:opacity-100"
      )}
    >
      <DraggableHandle dragControls={dragControls} />

      <SettingsControls />
    </motion.div>
  );
}

function DraggableHandle({
  dragControls,
}: {
  dragControls: ReturnType<typeof useDragControls>;
}) {
  return (
    <motion.div
      onPointerDown={(e) => dragControls.start(e, { snapToCursor: false })}
      whileTap={{ cursor: "grabbing" }}
      tabIndex={-1}
      className={cn(
        "absolute -top-[12px] left-1/2 rounded-md py-1 px-2",
        "select-none outline-none",
        "border border-white/20 bg-black",
        "transition-all duration-100 ease-in-out",
        "hover:scale-125 hover:cursor-grab hover:border-almost-white",
        "active:scale-125 active:border-almost-white"
      )}
    >
      <GripHorizontal size={16} aria-hidden={true} />
    </motion.div>
  );
}

function SettingsControls() {
  return (
    <div className="flex gap-8">
      <Control htmlFor="language" label="Language">
        <Select type="language" options={SUPPORTED_LANGUAGES} />
      </Control>
      <Control htmlFor="theme" label="Theme">
        <Select type="theme" options={SUPPORTED_THEMES} />
      </Control>
      <Control htmlFor="fontStyle" label="Font style">
        <Select type="fontStyle" options={SUPPORTED_FONT_STYLES} />
      </Control>
      <Control htmlFor="lineNumbers" label="Line numbers">
        <Switch type="lineNumbers" />
      </Control>
      <Control htmlFor="padding" label="Padding">
        <Choices type="padding" choices={SUPPORTED_PADDING_CHOICES} />
      </Control>

      <div className={cn("relative flex")}>
        <button
          type="button"
          onClick={snap}
          className={cn(
            "flex grow items-center justify-center rounded-md p-2",
            "select-none outline-none",
            "border border-white/20 bg-black",
            "transition-all duration-100 ease-in-out",
            "hover:border-almost-white hover:bg-white/10 hover:text-almost-white",
            "focus:border-almost-white focus:bg-white/10 focus:text-almost-white"
          )}
        >
          Export
        </button>
      </div>
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
