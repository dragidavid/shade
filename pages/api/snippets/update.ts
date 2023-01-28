import prisma from "lib/prisma";
import { withAuthentication } from "lib/auth";
import { exists } from "lib/exists";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const snippet = await prisma.snippet.update({
    where: {
      id: req.body.id,
    },
    data: {
      title: req.body.title,
      code: req.body.code,
      settings: {
        language: req.body.language.id,
        theme: req.body.theme.id,
        fontStyle: req.body.fontStyle.id,
        lineNumbers: req.body.lineNumbers,
        padding: req.body.padding.id,
      },
      updatedAt: new Date().toISOString(),
    },
  });

  console.log(snippet);

  // TODO - capture the error on the client side and display an error message
  if (!exists(snippet.id)) {
    res.status(400).json({ error: "Unable to save changes to this snippet." });

    return;
  }

  res.status(200).json(req.body);
}

export default withAuthentication(handler);
