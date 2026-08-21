/**
 * Server-side free-question quota tracking for the AI assistant (FR-6).
 *
 * Enforcement is ALWAYS server-side — never trusting the client / localStorage
 * (that's the whole point of FR-6). Two backends:
 *
 *   1. Upstash Redis (recommended for production / Vercel) when the REST
 *      credentials are present. `@vercel/kv` is EOL; Upstash is its upstream
 *      and `Redis.fromEnv()` reads either `UPSTASH_REDIS_REST_URL` /
 *      `UPSTASH_REDIS_REST_TOKEN` OR the Vercel-KV-style `KV_REST_API_URL` /
 *      `KV_REST_API_TOKEN`, so either naming works.
 *
 *   2. In-memory fallback when no KV is configured (local dev, or a deploy
 *      without KV yet). Still server-side, but per-instance and not durable —
 *      good enough for dev, not for real abuse protection at scale. The app
 *      logs a warning so this isn't silently relied on in production.
 *
 * Quota window (plan §18 item 8, was open): a fixed window that starts at the
 * visitor's FIRST question and expires QUOTA_WINDOW_SECONDS later (24h). Chosen
 * over "per browser session" because a session cap resets the moment a visitor
 * clears cookies, which defeats the point. 24h is a reasonable default; change
 * QUOTA_WINDOW_SECONDS to adjust.
 */

import { Redis } from "@upstash/redis";
import { FREE_QUESTION_LIMIT } from "@/lib/aiContext";

export const QUOTA_WINDOW_SECONDS = 24 * 60 * 60; // 24h

const KEY_PREFIX = "chat:quota:";

function hasUpstashEnv(): boolean {
  return Boolean(
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
      (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  );
}

let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (!hasUpstashEnv()) return null;
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

// ---- In-memory fallback ----------------------------------------------------
interface MemBucket {
  count: number;
  expiresAt: number;
}
const memStore = new Map<string, MemBucket>();
let warnedNoKv = false;

function memGet(key: string): number {
  const bucket = memStore.get(key);
  if (!bucket || Date.now() > bucket.expiresAt) {
    memStore.delete(key);
    return 0;
  }
  return bucket.count;
}

function memIncrement(key: string): number {
  const now = Date.now();
  const bucket = memStore.get(key);
  if (!bucket || now > bucket.expiresAt) {
    memStore.set(key, { count: 1, expiresAt: now + QUOTA_WINDOW_SECONDS * 1000 });
    return 1;
  }
  bucket.count += 1;
  return bucket.count;
}

// ---- Public API ------------------------------------------------------------

export interface QuotaState {
  used: number;
  remaining: number;
  limit: number;
}

/** Read how many hosted questions this session has used (no mutation). */
export async function getQuota(sessionId: string): Promise<QuotaState> {
  const key = `${KEY_PREFIX}${sessionId}`;
  const client = getRedis();

  let used = 0;
  if (client) {
    used = (await client.get<number>(key)) ?? 0;
  } else {
    if (!warnedNoKv) {
      console.warn(
        "[quota] No Upstash/KV env vars set — using in-memory quota fallback (per-instance, not durable). Set UPSTASH_REDIS_REST_URL/TOKEN for production."
      );
      warnedNoKv = true;
    }
    used = memGet(key);
  }

  return { used, remaining: Math.max(0, FREE_QUESTION_LIMIT - used), limit: FREE_QUESTION_LIMIT };
}

/**
 * Atomically record one consumed hosted question and return the new state.
 * Sets the window TTL on the first question only (fixed window from first use).
 */
export async function consumeQuota(sessionId: string): Promise<QuotaState> {
  const key = `${KEY_PREFIX}${sessionId}`;
  const client = getRedis();

  let used: number;
  if (client) {
    used = await client.incr(key);
    if (used === 1) {
      await client.expire(key, QUOTA_WINDOW_SECONDS);
    }
  } else {
    used = memIncrement(key);
  }

  return { used, remaining: Math.max(0, FREE_QUESTION_LIMIT - used), limit: FREE_QUESTION_LIMIT };
}
