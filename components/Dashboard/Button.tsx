"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";

import { Loader2, Plus, Check, X } from "lucide-react";

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
      "border-white/20 bg-black hover:bg-white/10 hover:text-almost-white hover:border-almost-white active:bg-white/20",
  },
  SUCCESS: {
    id: "success",
    text: "Success",
    icon: <Check size={16} aria-hidden="true" />,
    additionalClasses:
      "border-green-400/20 text-green-400 bg-green-500/20 active:bg-green-400/10",
  },
  ERROR: {
    id: "error",
    text: "Error",
    icon: <X size={16} aria-hidden="true" />,
    additionalClasses:
      "border-red-400/20 text-red-400 bg-red-500/20 active:bg-red-400/10",
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

  return (
    <button
      type="button"
      onClick={handleButtonClick}
      disabled={loading || buttonState.id !== "default"}
      className={cn(
        "flex w-auto items-center justify-between gap-2 rounded-lg p-2 font-medium",
        "select-none outline-none",
        "border-[1px]",
        "transition-all duration-100 ease-in-out",
        "focus:ring-1 focus:ring-almost-white focus:ring-offset-2 focus:ring-offset-black",
        buttonState.additionalClasses
      )}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      ) : (
        buttonState.icon
      )}
      {buttonState.text}
    </button>
  );
}
