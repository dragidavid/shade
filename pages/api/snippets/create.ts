import { prisma } from "lib/prisma";
import { ratelimit } from "lib/ratelimit";
import { getSession, withAuthentication } from "lib/auth";

import type { NextApiRequest, NextApiResponse } from "next";

const limiter = ratelimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 100,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);

  const { allowed } = await limiter.check(res, 5, "CREATE_SNIPPET");

  if (!allowed) {
    return res.status(429).send({ message: "Too many requests" });
  }

  const snippetCount = await prisma.snippet.count({
    where: {
      userId: session.user.id,
    },
  });

  if (snippetCount >= 10) {
    return res.status(403).send({ message: "You have reached the limit" });
  }

  try {
    const createdSnippet = await prisma.snippet.create({
      data: {
        userId: session.user.id,
        views: {
          create: {
            count: 0,
          },
        },
      },
      include: {
        views: true,
      },
    });

    return res.status(200).json(createdSnippet);
  } catch (e) {
    return res.status(500).send({ message: "Unable to create a new snippet" });
  }
}

export default withAuthentication(handler);
