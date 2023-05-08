import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "lib/prisma";
import { limiter } from "lib/limiter";
import { getSession } from "lib/auth";

import type { NextRequest } from "next/server";

const ratelimit = limiter();

export async function PATCH(req: NextRequest) {
  const headersList = headers();
  const updateType = headersList.get("X-Update-Type");

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

  const dataToUpdate: {
    title: string | null;
    code?: string;
    settings?: {
      language: string;
      theme: string;
      fontStyle: string;
      fontSize: string;
      lineNumbers: boolean;
      padding: string;
    };
    updatedAt: string;
  } = {
    title: body.title && body.title.trim() !== "" ? body.title.trim() : null,
    updatedAt: new Date().toISOString(),
  };

  if (updateType === "full") {
    dataToUpdate["code"] = body.code;
    dataToUpdate["settings"] = {
      language: body.language.id,
      theme: body.theme.id,
      fontStyle: body.fontStyle.id,
      fontSize: body.fontSize.id,
      lineNumbers: body.lineNumbers,
      padding: body.padding.id,
    };
  }

  try {
    const updatedSnippet = await prisma.snippet.update({
      where: {
        id: body.id,
        userId: session.user.id,
      },
      data: dataToUpdate,
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
