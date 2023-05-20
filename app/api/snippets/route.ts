import { NextResponse } from "next/server";

import chroma from "chroma-js";

import {
  BASE_LANGUAGES,
  BASE_THEMES,
  BASE_FONT_FAMILIES,
  BASE_FONT_SIZES,
  BASE_PADDING_VALUES,
  BASE_COLOR_MODES,
} from "lib/values";

import { prisma } from "lib/prisma";
import { prepare } from "lib/prepare";
import { limiter } from "lib/limiter";
import { getSession } from "lib/auth";

import type { NextRequest } from "next/server";

const ratelimit = limiter();

export async function PATCH(req: NextRequest) {
  const session = await getSession();

  const body = await req.json();

  const { allowed } = await ratelimit.check(8, "UPDATE_SNIPPET");

  if (!session || !session.user.id) {
    return NextResponse.json(
      {
        code: "UNAUTHORIZED",
      },
      {
        status: 403,
      }
    );
  }

  if (!allowed) {
    return NextResponse.json(
      {
        code: "TOO_MANY_REQUESTS",
      },
      {
        status: 429,
      }
    );
  }

  try {
    const updatedSnippet = await prisma.snippet.update({
      where: {
        id: body.id,
        userId: session.user.id,
      },
      data: prepare(body),
    });

    return NextResponse.json(updatedSnippet, {
      status: 200,
    });
  } catch (e) {
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  const body = await req.json();

  const { allowed } = await ratelimit.check(5, "CREATE_SNIPPET");

  if (!session || !session.user.id) {
    return NextResponse.json(
      {
        code: "UNAUTHORIZED",
      },
      {
        status: 403,
      }
    );
  }

  if (!allowed) {
    return NextResponse.json(
      {
        code: "TOO_MANY_REQUESTS",
      },
      {
        status: 429,
      }
    );
  }

  if (body.snippetCount >= 10) {
    return NextResponse.json(
      {
        code: "LIMIT_REACHED",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const createdSnippet = await prisma.snippet.create({
      data: {
        userId: session.user.id,
        language: BASE_LANGUAGES.at(0)!.id,
        theme: BASE_THEMES.at(-1)!.id,
        fontFamily: BASE_FONT_FAMILIES.at(0)!.id,
        fontSize: BASE_FONT_SIZES.at(1)!,
        padding: BASE_PADDING_VALUES.at(1)!,
        colors: [chroma.random().hex(), chroma.random().hex()],
        colorMode: BASE_COLOR_MODES.at(0)!,
        angle: 145,
        views: {
          create: {
            count: 0,
          },
        },
      },
      include: {
        views: true,
      },
    });

    return NextResponse.json(createdSnippet, {
      status: 200,
    });
  } catch (e) {
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const session = await getSession();

  if (!session || !session.user.id) {
    return NextResponse.json(
      {
        code: "UNAUTHORIZED",
      },
      {
        status: 403,
      }
    );
  }

  if (!id) {
    return NextResponse.json(
      {
        code: "SNIPPET_NOT_FOUND",
      },
      {
        status: 404,
      }
    );
  }

  try {
    const deletedSnippet = await prisma.snippet.delete({
      where: {
        id: id,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(deletedSnippet, {
      status: 200,
    });
  } catch (e) {
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
      },
      {
        status: 500,
      }
    );
  }
}
