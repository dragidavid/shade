import prisma from "lib/prisma";
import { getServerSession } from "lib/auth";
import { exists } from "lib/exists";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res);

  // TODO - capture the error on the client side and display an error message
  if (!session || !exists(session.user.id)) {
    res
      .status(403)
      .json({ error: "You must be logged in to save a code snippet." });

    return;
  }

  const snippet = await prisma.snippet.create({
    data: {
      authorId: session!.user!.id! as string,
    },
  });

  // TODO - capture the error on the client side and display an error message
  if (!exists(snippet.id)) {
    res
      .status(400)
      .json({ error: "Unable to create a new snippet right now." });

    return;
  }

  res.status(200).json(snippet);
}
