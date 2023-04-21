import { ImageResponse } from "next/server";

import { SUPPORTED_THEMES } from "lib/values";

import { find } from "lib/find";
import { prisma } from "lib/prisma";
import { random } from "lib/random";

import type { SnippetSettings } from "lib/types";

export const runtime = "edge";

async function getSnippet(id: string) {
  return await prisma.snippet.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      code: true,
      settings: true,
      userId: true,
    },
  });
}

export default async function SnippetOG({
  params,
}: {
  params: { id: string };
}) {
  const font = await fetch(
    new URL("../fonts/Inter-Black.otf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const partialSnippet = await getSnippet(params.id);

  if (!partialSnippet)
    return new ImageResponse(
      (
        <div tw="flex h-full w-full items-center justify-center bg-black">
          <h1
            style={{
              fontFamily: "Inter",
              fontSize: "256px",
              fontWeight: "900",
              backgroundImage:
                "linear-gradient(to bottom right, #dc2626, #9f1239)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            404
          </h1>
        </div>
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: "Inter",
            data: font,
          },
        ],
      }
    );

  const settings = partialSnippet.settings as SnippetSettings;

  const theme = find(SUPPORTED_THEMES, settings.theme);

  return new ImageResponse(
    (
      <div tw="relative flex flex-col h-full w-full px-32 bg-black">
        <div tw="flex py-12 justify-center">
          <h1
            style={{
              fontFamily: "Inter",
              fontSize: "72px",
              fontWeight: "900",
              backgroundImage: `linear-gradient(to bottom right, ${theme.baseColors[0]}, ${theme.baseColors[1]})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            shade.
          </h1>
        </div>
        <div
          tw="relative flex h-full w-full rounded-t-xl pt-24 px-24"
          style={{
            zIndex: "0",
            backgroundImage: `linear-gradient(to bottom right, ${theme.baseColors[0]}, ${theme.baseColors[1]})`,
          }}
        >
          <div
            tw="relative flex h-full w-full rounded-t-xl"
            style={{ zIndex: "1" }}
          >
            <div
              tw="absolute inset-0 rounded-t-xl bg-black/60"
              style={{
                zIndex: "2",
                transform: "translateY(36px) scale(1.04)",
                filter: "blur(36px)",
              }}
            />
            <div
              tw="absolute inset-0 rounded-t-xl"
              style={{
                zIndex: "3",
                backgroundImage: `linear-gradient(to bottom right, ${theme.baseColors[0]}, ${theme.baseColors[1]})`,
              }}
            />
            <div
              tw="relative flex flex-col h-full w-full p-12 rounded-t-xl bg-black/70"
              style={{ zIndex: "4", gap: "24px" }}
            >
              <span
                tw="h-8 bg-white/10"
                style={{ width: `${random(20, 50)}%` }}
              />
              <span tw="h-8 bg-transparent" style={{ width: "100%" }} />
              <span
                tw="h-8 bg-white/10"
                style={{ width: `${random(5, 100)}%` }}
              />
              <span
                tw="h-8 bg-white/10"
                style={{ width: `${random(5, 100)}%` }}
              />
              <span
                tw="h-8 bg-white/10"
                style={{ width: `${random(5, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Inter",
          data: font,
        },
      ],
    }
  );
}
