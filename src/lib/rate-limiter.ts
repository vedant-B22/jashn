interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute

/**
 * Checks whether the client IP has exceeded the allowed request threshold.
 * In-memory sliding window rate limiter.
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const record = ipMap.get(ip);

  // Clean old expired entries periodically
  if (ipMap.size > 2000) {
    for (const [key, val] of ipMap.entries()) {
      if (val.resetTime < now) {
        ipMap.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    ipMap.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetInMs: WINDOW_MS,
    };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, record.resetTime - now),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    resetInMs: Math.max(0, record.resetTime - now),
  };
}
