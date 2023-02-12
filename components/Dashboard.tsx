import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import {
  PlusIcon,
  ReloadIcon,
  CheckIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";

import fetcher from "lib/fetcher";

import type { Snippet } from "lib/types";

const BUTTON_COLORS = {
  DEFAULT:
    "border-white/20 bg-black hover:bg-white/20 hover:text-white hover:border-white focus:ring-white active:bg-white/10",
  SUCCESS:
    "border-green-400/20 text-green-400 bg-green-500/20 focus:ring-green-400 active:bg-green-400/10",
  ERROR:
    "border-red-400/20 text-red-400 bg-red-500/20 focus:ring-red-400 active:bg-red-400/10",
};

export default function Dashboard() {
  const [buttonColors, setButtonColors] = useState<string>(
    BUTTON_COLORS.DEFAULT
  );
  const [buttonIcon, setButtonIcon] = useState<JSX.Element>(
    <PlusIcon className="h-3 w-3" aria-hidden="true" />
  );

  const router = useRouter();
  const { data: session, status } = useSession();

  const resetButton = () => {
    setTimeout(() => {
      setButtonColors(BUTTON_COLORS.DEFAULT);
      setButtonIcon(<PlusIcon className="h-3 w-3" aria-hidden="true" />);
    }, 3000);
  };

  const {
    data: snippets,
    error,
    isLoading,
  } = useSWR<Snippet[]>(
    session?.user?.id ? `/api/snippets/get-all?id=${session.user.id}` : null,
    fetcher
  );

  const { trigger, isMutating } = useSWRMutation(
    "/api/snippets/create",
    (url) => fetch(url),
    {
      onSuccess: async (data) => {
        if (!data.ok) {
          return;
        }

        setButtonColors(BUTTON_COLORS.SUCCESS);
        setButtonIcon(<CheckIcon className="h-3 w-3" aria-hidden="true" />);

        const { id } = await data.json();

        router.push(`/${id}`);
      },
      onError: (error) => {
        // TODO - Handle error
        console.log(error);

        setButtonColors(BUTTON_COLORS.ERROR);
        setButtonIcon(<Cross2Icon className="h-3 w-3" aria-hidden="true" />);

        // Reset the button after 3 seconds
        resetButton();
      },
    }
  );

  const getContent = () => {
    if (error) {
      return <p>Something went wrong...</p>;
    }

    if (isLoading) {
      return <p>Hang on there...</p>;
    }

    if (snippets?.length === 0) {
      return <p>No snippets found...</p>;
    }

    return (
      <ul className="grid w-full grid-cols-2 gap-3">
        {snippets?.map((snippet) => (
          <Link
            href={`/${snippet.id}`}
            key={snippet.id}
            className={clsx(
              "flex w-full items-center justify-between gap-2 rounded-lg p-2 text-xs",
              "border-[1px] border-white/20 bg-black",
              "transition-all duration-200 ease-in-out",
              "hover:cursor-pointer hover:border-white hover:bg-white/20 hover:text-white",
              "focus:outline-none focus:ring-1 focus:ring-white",
              "active:bg-white/10"
            )}
          >
            <li key={snippet.id}>
              <span className="pointer-events-none">
                {snippet.title ?? "Untitled"}
              </span>
            </li>
          </Link>
        ))}
      </ul>
    );
  };

  if (status === "loading") {
    return <p>Hang on there...</p>;
  }

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
            buttonColors
          )}
        >
          <span className="pointer-events-none">
            {isMutating ? (
              <ReloadIcon className="h-3 w-3 animate-spin" aria-hidden="true" />
            ) : (
              buttonIcon
            )}
          </span>
          New
        </button>
      </div>

      {getContent()}
    </section>
  );
}
