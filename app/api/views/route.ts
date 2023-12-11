import { NextResponse } from "next/server";

import { redis } from "lib/redis";
import { getSession } from "lib/auth";

import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id === null) {
    return NextResponse.json(
      {
        code: "MISSING_ID",
      },
      { status: 400 }
    );
  }

  if (session?.user?.id !== id) {
    const views = await redis.hincrby("views", id, 1);

    return NextResponse.json(views);
  } else {
    const views = (await redis.hget("views", id)) ?? 0;

    return NextResponse.json(views);
  }
}
