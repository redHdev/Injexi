import { LRUCache } from 'lru-cache'

export default function rateLimit(options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (limit, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = (tokenCache.get(token)) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        const headers = {
          'X-RateLimit-Limit': limit,
          'X-RateLimit-Remaining': isRateLimited ? 0 : limit - currentUsage
        };

        if (isRateLimited) {
          reject(headers);
        } else {
          resolve(headers);
        }
      }),
  };
}