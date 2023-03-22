import { prisma } from "lib/prisma";
import { withAuthentication } from "lib/auth";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const updatedSnippet = await prisma.snippet.update({
      where: {
        id: req.body.id,
      },
      data: {
        title:
          req.body.title && req.body.title.trim() !== ""
            ? req.body.title.trim()
            : null,
        code: req.body.code,
        settings: {
          language: req.body.language.id,
          theme: req.body.theme.id,
          fontStyle: req.body.fontStyle.id,
          fontSize: req.body.fontSize.id,
          lineNumbers: req.body.lineNumbers,
          padding: req.body.padding.id,
        },
        updatedAt: new Date().toISOString(),
      },
    });

    return res.status(200).json(updatedSnippet);
  } catch (e) {
    return res.status(500).send({ message: "Unable to update the snippet" });
  }
}

export default withAuthentication(handler);
