import { LRUCache } from "lru-cache";

export function limiter() {
  const tokenCache = new LRUCache({
    ttl: 120 * 1000,
    max: 100,
  });

  return {
    check: async (
      limit: number,
      token: string
    ): Promise<{ allowed: boolean; retryAfter?: number }> => {
      const tokenInfo = tokenCache.get(token) as
        | { count: number; expiresAt: number }
        | undefined;

      if (!tokenInfo) {
        const now = Date.now();
        const expiresAt = now + 120 * 1000;

        tokenCache.set(token, { count: 1, expiresAt });
      } else {
        tokenInfo.count += 1;
      }

      const currentUsage = tokenInfo?.count || 1;
      const isRateLimited = currentUsage >= limit;

      return { allowed: !isRateLimited };
    },
  };
}
