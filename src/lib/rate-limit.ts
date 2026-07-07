/**
 * In-memory rate limiter. Note: buckets are per-process and do not
 * synchronize across multiple Render instances or serverless workers.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export const RATE_LIMIT_DEFAULT = 10;
export const RATE_LIMIT_UPLOAD = 5;
export const RATE_LIMIT_CHECKOUT = 5;
export const RATE_LIMIT_WINDOW_MS = 60_000;

let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 60_000;

function cleanupExpiredBuckets(now: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of buckets) {
    if (now > entry.resetAt) {
      buckets.delete(key);
    }
  }
}

export function resetRateLimitBuckets(): void {
  buckets.clear();
  lastCleanup = Date.now();
}

export function rateLimit(
  key: string,
  limit = RATE_LIMIT_DEFAULT,
  windowMs = RATE_LIMIT_WINDOW_MS
): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  cleanupExpiredBuckets(now);

  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { ok: true };
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
