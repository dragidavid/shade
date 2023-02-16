import { useState } from "react";
import { useRouter } from "next/router";
import useSWRMutation from "swr/mutation";
import clsx from "clsx";
import { Loader2, Plus, Check, X } from "lucide-react";

import Content from "components/Dashboard/Content";

type ButtonState = {
  color: string;
  icon: JSX.Element;
};

const BUTTON_STATES: Record<string, ButtonState> = {
  DEFAULT: {
    color:
      "border-white/20 bg-black hover:bg-white/20 hover:text-white hover:border-white focus:ring-white active:bg-white/10",
    icon: <Plus size={14} aria-hidden="true" />,
  },
  SUCCESS: {
    color:
      "border-green-400/20 text-green-400 bg-green-500/20 focus:ring-green-400 active:bg-green-400/10",
    icon: <Check size={14} aria-hidden="true" />,
  },
  ERROR: {
    color:
      "border-red-400/20 text-red-400 bg-red-500/20 focus:ring-red-400 active:bg-red-400/10",
    icon: <X size={14} aria-hidden="true" />,
  },
};

export default function Dashboard() {
  const [buttonState, setButtonState] = useState<ButtonState>(
    BUTTON_STATES.DEFAULT
  );

  const router = useRouter();

  const resetButton = () => {
    setTimeout(() => {
      setButtonState(BUTTON_STATES.DEFAULT);
    }, 3000);
  };

  const { trigger, isMutating } = useSWRMutation(
    "/api/snippets/create",
    (url) => fetch(url),
    {
      onSuccess: async (data) => {
        if (!data.ok) {
          return;
        }

        setButtonState(BUTTON_STATES.SUCCESS);

        const { id } = await data.json();

        router.push(`/${id}`);
      },
      onError: (error) => {
        // TODO - Handle error
        console.log(error);

        setButtonState(BUTTON_STATES.ERROR);

        // Reset the button after 3 seconds
        resetButton();
      },
    }
  );

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
          onClick={() => trigger()}
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
          New
        </button>
      </div>

      <Content />
    </section>
  );
}
