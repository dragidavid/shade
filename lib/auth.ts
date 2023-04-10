import { getServerSession } from "next-auth/next";

import { authOptions } from "app/api/auth/[...nextauth]/route";

import type {
  GetServerSidePropsContext,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { Session } from "next-auth";

export async function getSession(
  req?: NextApiRequest | GetServerSidePropsContext["req"],
  res?: NextApiResponse | GetServerSidePropsContext["res"]
) {
  if (!req || !res) {
    return (await getServerSession(authOptions)) as Session;
  }

  return (await getServerSession(req, res, authOptions)) as Session;
}

export function withAuthentication(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user.id) {
      return res.status(403).end();
    }

    return handler(req, res);
  };
}
