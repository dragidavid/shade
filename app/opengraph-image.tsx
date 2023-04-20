import { ImageResponse } from "next/server";

export const runtime = "edge";

export default async function OG() {
  const font = await fetch(
    new URL("./fonts/Inter-Black.otf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div tw="flex h-full w-full items-center justify-center bg-black">
        <h1
          style={{
            fontFamily: "Inter",
            fontSize: "256px",
            fontWeight: "900",
            backgroundImage:
              "linear-gradient(to bottom right, #9333ea, #5b21b6)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          shade.
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
}
