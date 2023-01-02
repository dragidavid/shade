import prisma from "lib/prisma";
import { getServerSession, withAuthentication } from "lib/auth";

import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res);

  const snippets = await prisma.snippet.findMany({
    where: {
      userId: session.user.id as string,
    },
  });

  res.status(200).json(snippets);
}

export default withAuthentication(handler);
