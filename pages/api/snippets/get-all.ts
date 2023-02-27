import prisma from "lib/prisma";
import { getSession, withAuthentication } from "lib/auth";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);

  try {
    const snippets = await prisma.snippet.findMany({
      where: {
        userId: session.user.id,
      },
    });

    res.status(200).json(snippets);
  } catch (e) {
    res.status(500).json({ message: "Unable to retrieve snippets." });
  }
}

export default withAuthentication(handler);
