import { prisma } from "lib/prisma";
import { withAuthentication } from "lib/auth";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const renamedSnippet = await prisma.snippet.update({
      where: {
        id: req.body.id,
      },
      data: {
        title:
          req.body.title && req.body.title.trim() !== ""
            ? req.body.title.trim()
            : null,
        updatedAt: new Date().toISOString(),
      },
    });

    return res.status(200).json(renamedSnippet);
  } catch (e) {
    return res.status(500).send({ message: "Unable to rename the snippet" });
  }
}

export default withAuthentication(handler);
