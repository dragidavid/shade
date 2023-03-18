"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { useHotkeys } from "react-hotkeys-hook";

import { Loader2, Plus, Check, X } from "lucide-react";

import Kbd from "components/ui/Kbd";

import { cn } from "lib/cn";
import { fetcher } from "lib/fetcher";

interface ButtonState {
  id: string;
  text: string;
  icon: JSX.Element;
  additionalClasses: string;
}

const BUTTON_STATES: Record<string, ButtonState> = {
  DEFAULT: {
    id: "default",
    text: "New",
    icon: <Plus size={16} aria-hidden="true" />,
    additionalClasses:
      "border-white/20 bg-black hover:bg-white/20 hover:text-almost-white",
  },
  SUCCESS: {
    id: "success",
    text: "Success",
    icon: <Check size={16} aria-hidden="true" />,
    additionalClasses: "border-green-400/20 text-green-400 bg-green-500/20",
  },
  ERROR: {
    id: "error",
    text: "Error",
    icon: <X size={16} aria-hidden="true" />,
    additionalClasses: "border-red-400/20 text-red-400 bg-red-500/20",
  },
};

export default function Button() {
  const [buttonState, setButtonState] = useState<ButtonState>(
    BUTTON_STATES.DEFAULT
  );

  const router = useRouter();

  const { trigger: create, isMutating: loading } = useSWRMutation(
    "/api/snippets/create",
    (url) => fetcher(url)
  );

  const reset = () => {
    setTimeout(() => {
      setButtonState(BUTTON_STATES.DEFAULT);
    }, 3000);
  };

  const handleButtonClick = async () => {
    try {
      const { id } = await create();

      setButtonState(BUTTON_STATES.SUCCESS);

      router.push(`/${id}`);
    } catch (e) {
      setButtonState(BUTTON_STATES.ERROR);
    } finally {
      reset();
    }
  };

  useHotkeys(
    "c",
    () => {
      if (!loading && buttonState.id === "default") {
        handleButtonClick();
      }
    },
    {
      preventDefault: true,
    }
  );

  return (
    <button
      type="button"
      onClick={handleButtonClick}
      disabled={loading || buttonState.id !== "default"}
      className={cn(
        "flex w-auto items-center gap-4 rounded-lg p-1 font-medium",
        "select-none outline-none",
        "border",
        "transition-all duration-100 ease-in-out",
        buttonState.additionalClasses,
        "focus:border-almost-white focus:text-almost-white"
      )}
    >
      <div className={cn("flex items-center gap-2 pl-0.5")}>
        {loading ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          buttonState.icon
        )}
        {buttonState.text}
      </div>

      <Kbd keys={["C"]} />
    </button>
  );
}
