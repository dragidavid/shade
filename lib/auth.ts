import { unstable_getServerSession } from "next-auth/next";

import { exists } from "lib/exists";

import { authOptions } from "pages/api/auth/[...nextauth]";

import type {
  GetServerSidePropsContext,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { Session } from "next-auth";

export async function getServerSession(
  req: NextApiRequest | GetServerSidePropsContext["req"],
  res: NextApiResponse | GetServerSidePropsContext["res"]
) {
  return (await unstable_getServerSession(req, res, authOptions)) as Session;
}

export function withAuthentication(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res);

    if (!session || !exists(session.user.id)) {
      return res.status(403).end();
    }

    return handler(req, res);
  };
}
