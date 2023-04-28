"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { useHotkeys } from "react-hotkeys-hook";

import { Plus, Check, X } from "lucide-react";

import Kbd from "components/ui/Kbd";
import Loader from "components/ui/Loader";

import { cn } from "lib/cn";
import { fetcher } from "lib/fetcher";
import { useStore } from "lib/store";

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
      "border-white/20 bg-black hover:bg-white/20 hover:text-almost-white disabled:brightness-50",
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

export default function Button({ isDisabled }: { isDisabled: boolean }) {
  const [buttonState, setButtonState] = useState<ButtonState>(
    BUTTON_STATES.DEFAULT
  );

  const router = useRouter();

  const update = useStore((state) => state.update);

  const { trigger, isMutating: loading } = useSWRMutation(
    "/api/snippets/create",
    (url) => fetcher(url)
  );

  const reset = () => {
    setTimeout(() => {
      setButtonState(BUTTON_STATES.DEFAULT);
    }, 2500);
  };

  const handleAction = async (type: "button" | "hotkey" = "button") => {
    try {
      const { id } = await trigger();

      setButtonState(BUTTON_STATES.SUCCESS);

      router.push(`/${id}`);
    } catch (e) {
      setButtonState(BUTTON_STATES.ERROR);

      if (e instanceof Error) {
        switch (e.message) {
          case "Too many requests":
            update("message", "TOO_MANY_REQUESTS");
            break;
          case "You have reached the limit":
            update("message", "LIMIT_REACHED");
            break;
          default:
            break;
        }
      }
    } finally {
      reset();
    }
  };

  useHotkeys(
    "n",
    () => {
      if (!loading && buttonState.id === "default") {
        handleAction("hotkey");
      }
    },
    {
      preventDefault: true,
    }
  );

  return (
    <button
      type="button"
      onClick={() => handleAction()}
      disabled={isDisabled || loading || buttonState.id !== "default"}
      className={cn(
        "flex w-auto items-center gap-4 rounded-lg p-1 font-medium",
        "select-none outline-none",
        "border",
        "transition-all duration-100 ease-in-out",
        buttonState.additionalClasses,
        "focus:border-almost-white focus:text-almost-white",
        "disabled:cursor-not-allowed"
      )}
    >
      <div className={cn("flex items-center gap-2 pl-0.5")}>
        {loading ? <Loader /> : buttonState.icon}
        {buttonState.text}
      </div>

      <Kbd keys={["N"]} />
    </button>
  );
}
