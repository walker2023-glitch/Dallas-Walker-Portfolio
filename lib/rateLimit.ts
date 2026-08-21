/**
 * Minimal in-memory, fixed-window rate limiter.
 *
 * Scope note: this is intentionally lightweight for Phase 4 (`/api/contact`)
 * and does NOT require any new infra (no Vercel KV, no Redis). It lives in
 * the memory of a single serverless function instance, so on Vercel it only
 * protects against a burst of requests hitting the *same warm instance* —
 * a determined attacker spread across many cold starts could get around it.
 * That's an accepted tradeoff for a low-traffic personal contact form; the
 * combination of this limiter + the honeypot field covers the realistic
 * spam case (bots hammering the endpoint) per the plan's Risks table
 * ("Contact form abused for spam" -> "Honeypot field + rate limiting").
 *
 * If real abuse shows up in production, upgrade this to Vercel KV (already
 * planned infra for Phase 5's chat quota) instead of growing this file.
 */

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may retry, only set when `allowed` is false. */
  retryAfterSeconds?: number;
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (existing.count >= limit) {
    const retryAfterSeconds = Math.ceil((existing.windowStart + windowMs - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  existing.count += 1;
  return { allowed: true };
}
