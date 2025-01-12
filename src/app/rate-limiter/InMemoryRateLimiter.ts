
type RateLimit = {
  count: number;
  timestamp: number;
};


export function createRateLimiter(limit: number, window: number) {
  const rateLimits = new Map<string, RateLimit>();

  /**
   * Check if the user has exceeded the rate limit.
   * @param key Unique identifier for the user (e.g., IP, user ID)
   */
  return function consume(key: string): void {
    const currentTime = Date.now();
    const windowStart = currentTime - window;

    if (!rateLimits.has(key)) {
      rateLimits.set(key, { count: 0, timestamp: currentTime });
    }

    const { count, timestamp } = rateLimits.get(key)!;

    // If the current timestamp is outside the time window, reset the counter
    if (timestamp < windowStart) {
      rateLimits.set(key, { count: 1, timestamp: currentTime });
    } else {
      // Increment the count if within the time window
      if (count >= limit) {
        throw new Error("Too many requests");
      }
      rateLimits.set(key, { count: count + 1, timestamp });
    }
  };
}