import { useState } from "react";
import { useRouter } from "next/router";
import useSWRMutation from "swr/mutation";
import clsx from "clsx";
import { Loader2, Plus, Check, X } from "lucide-react";

import Content from "components/Dashboard/Content";

import { fetcher } from "lib/fetcher";

type ButtonState = {
  id: string;
  text: string;
  icon: JSX.Element;
  color: string;
};

const BUTTON_STATES: Record<string, ButtonState> = {
  DEFAULT: {
    id: "default",
    text: "New",
    icon: <Plus size={14} aria-hidden="true" />,
    color:
      "border-white/20 bg-black hover:bg-white/20 hover:text-white hover:border-white focus:ring-white active:bg-white/10",
  },
  SUCCESS: {
    id: "success",
    text: "Success",
    icon: <Check size={14} aria-hidden="true" />,
    color:
      "border-green-400/20 text-green-400 bg-green-500/20 focus:ring-green-400 active:bg-green-400/10",
  },
  ERROR: {
    id: "error",
    text: "Error",
    icon: <X size={14} aria-hidden="true" />,
    color:
      "border-red-400/20 text-red-400 bg-red-500/20 focus:ring-red-400 active:bg-red-400/10",
  },
};

export default function Dashboard() {
  const [buttonState, setButtonState] = useState<ButtonState>(
    BUTTON_STATES.DEFAULT
  );

  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
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
      const { id } = await trigger();

      setButtonState(BUTTON_STATES.SUCCESS);

      router.push(`/${id}`);
    } catch (e) {
      setButtonState(BUTTON_STATES.ERROR);

      reset();
    }
  };

  return (
    <section
      className={clsx(
        "flex w-[576px] flex-col gap-6 rounded-xl p-5",
        "border-[1px] border-white/20 bg-black text-white/70 shadow-xl"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl font-black">Snippets</h2>

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isMutating || buttonState.id !== "default"}
          className={clsx(
            "flex w-auto select-none items-center justify-between gap-2 rounded-lg p-2 text-xs",
            "border-[1px]",
            "transition-all duration-200 ease-in-out",
            "hover:cursor-pointer",
            "focus:outline-none focus:ring-1",
            buttonState.color
          )}
        >
          <span className="pointer-events-none">
            {isMutating ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              buttonState.icon
            )}
          </span>
          {buttonState.text}
        </button>
      </div>

      <Content />
    </section>
  );
}
