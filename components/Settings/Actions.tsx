import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Link, Copy, Image as ImageIcon, Check, X } from "lucide-react";

import Loader from "components/ui/Loader";

import { cn } from "lib/cn";
import { snap } from "lib/snap";

type ButtonStates = "DEFAULT" | "SUCCESS" | "FAILURE" | "LOADING";

interface Button {
  id: string;
  label: Partial<{ [key in ButtonStates]: string }>;
  icon: { [key in ButtonStates]: JSX.Element };
  action: () => Promise<void>;
  hotkey: {
    key: string;
    options?: {
      enabled?: boolean;
      preventDefault?: boolean;
    };
  };
}

export default function Actions() {
  const statusIcons = {
    SUCCESS: <Check size={16} aria-hidden="true" />,
    FAILURE: <X size={16} aria-hidden="true" />,
    LOADING: <Loader />,
  };

  const buttons: Button[] = [
    {
      id: "copy-link",
      label: {
        DEFAULT: "Copy link",
        SUCCESS: "Link copied",
      },
      icon: {
        DEFAULT: <Link size={16} aria-hidden="true" />,
        ...statusIcons,
      },
      action: () => snap("COPY_LINK"),
      hotkey: {
        key: "meta+shift+c",
      },
    },
    {
      id: "copy-image",
      label: {
        DEFAULT: "Copy image",
        SUCCESS: "Image copied",
      },
      icon: {
        DEFAULT: <Copy size={16} aria-hidden="true" />,
        ...statusIcons,
      },
      action: () => snap("COPY_IMAGE"),
      hotkey: {
        key: "meta+c",
      },
    },
    {
      id: "download-image",
      label: {
        DEFAULT: "Download as PNG",
        SUCCESS: "Image downloaded",
      },
      icon: {
        DEFAULT: <ImageIcon size={16} aria-hidden="true" />,
        ...statusIcons,
      },
      action: () => snap("DOWNLOAD_IMAGE"),
      hotkey: {
        key: "meta+s",
        options: {
          preventDefault: true,
        },
      },
    },
  ];

  return (
    <div className={cn("grid grid-cols-3 place-items-center p-2")}>
      {buttons.map((button) => (
        <Button key={button.id} {...button} />
      ))}
    </div>
  );
}

function Button({ id, label, icon, action, hotkey }: Button) {
  const [buttonState, setButtonState] = useState<ButtonStates>("DEFAULT");

  async function wrappedAction() {
    try {
      await action();

      setButtonState("SUCCESS");
    } catch (err) {
      setButtonState("FAILURE");
    } finally {
      const timer = setTimeout(() => setButtonState("DEFAULT"), 2500);

      return () => clearTimeout(timer);
    }
  }

  useHotkeys(hotkey.key, wrappedAction, hotkey.options);

  return (
    <button
      type="button"
      onClick={wrappedAction}
      className={cn(
        "flex items-center justify-center rounded-lg py-1 px-1.5",
        "select-none outline-none",
        "border border-transparent bg-transparent",
        "transition-all duration-100 ease-in-out",
        "hover:bg-white/10 hover:text-almost-white",
        "focus:border-almost-white focus:text-almost-white"
      )}
      aria-label={id}
    >
      <div className={cn("flex items-center gap-2")}>
        {icon[buttonState]}
        {label[buttonState] ?? label.DEFAULT}
      </div>
    </button>
  );
}