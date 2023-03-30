import LRU from "lru-cache";

import type { NextApiResponse } from "next";

export function ratelimit(options?: {
  interval?: number;
  uniqueTokenPerInterval?: number;
}) {
  const tokenCache = new LRU({
    ttl: options?.interval || 60000,
    max: options?.uniqueTokenPerInterval || 100,
  });

  return {
    check: async (
      res: NextApiResponse,
      limit: number,
      token: string
    ): Promise<{ allowed: boolean; retryAfter?: number }> => {
      const tokenInfo = tokenCache.get(token) as
        | { count: number; expiresAt: number }
        | undefined;

      if (!tokenInfo) {
        const now = Date.now();
        const expiresAt = now + (options?.interval || 60000);

        tokenCache.set(token, { count: 1, expiresAt });
      } else {
        tokenInfo.count += 1;
      }

      const currentUsage = tokenInfo?.count || 1;
      const isRateLimited = currentUsage >= limit;

      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader(
        "X-RateLimit-Remaining",
        isRateLimited ? 0 : limit - currentUsage
      );

      let retryAfter: number | undefined;

      if (isRateLimited && tokenInfo) {
        retryAfter = Math.ceil((tokenInfo.expiresAt - Date.now()) / 1000);

        res.setHeader("X-RateLimit-Retry-After", retryAfter);
      }

      return { allowed: !isRateLimited };
    },
  };
}
