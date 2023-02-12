import prisma from "lib/prisma";
import { getServerSession, withAuthentication } from "lib/auth";
import { exists } from "lib/exists";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res);

  const snippet = await prisma.snippet.create({
    data: {
      userId: session.user.id as string,
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

export default withAuthentication(handler);
