import { prisma } from "lib/prisma";
import { withAuthentication } from "lib/auth";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const deletedSnippet = await prisma.snippet.delete({
      where: {
        id: req.body.id,
      },
      select: {
        id: true,
      },
    });

    return res.status(200).json(deletedSnippet);
  } catch (e) {
    return res.status(500).send({ message: "Unable to delete the snippet" });
  }
}

export default withAuthentication(handler);
