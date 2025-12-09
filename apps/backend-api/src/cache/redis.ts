import { createClient, RedisClientType } from "redis";
import { getEnv } from "../config/env";

/**
 * Redis cache client
 * 
 * Example implementation for caching frequently accessed data.
 * In production, use connection pooling and proper error handling.
 * 
 * Usage:
 *   const cache = getRedisClient();
 *   await cache.set("key", "value", { EX: 3600 }); // TTL 1 hour
 *   const value = await cache.get("key");
 */
let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  const env = getEnv();
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  redisClient = createClient({
    url: redisUrl
  });

  redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  await redisClient.connect();
  return redisClient;
}

export async function closeRedisClient(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
  }
}

/**
 * Cache middleware example
 * 
 * This is a simple example. In production, consider:
 * - Cache invalidation strategies
 * - Cache warming
 * - Different TTLs per route
 * - Cache key versioning
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  try {
    const client = await getRedisClient();
    const cached = await client.get(key);

    if (cached) {
      return JSON.parse(cached) as T;
    }

    // Cache miss - fetch and cache
    const data = await fetcher();
    await client.setEx(key, ttlSeconds, JSON.stringify(data));
    return data;
  } catch (error) {
    // If Redis fails, fall back to direct fetch
    console.error("Cache error, falling back to direct fetch:", error);
    return fetcher();
  }
}

/**
 * Invalidate cache by key pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const client = await getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
}

