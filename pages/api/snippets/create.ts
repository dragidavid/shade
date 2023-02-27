import prisma from "lib/prisma";
import { getSession, withAuthentication } from "lib/auth";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);

  try {
    const createdSnippet = await prisma.snippet.create({
      data: {
        userId: session.user.id,
      },
    });

    res.status(200).json(createdSnippet);
  } catch (e) {
    res.status(500).send({ message: "Unable to create a new snippet." });
  }
}

export default withAuthentication(handler);
