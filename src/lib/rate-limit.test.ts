import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests within limit", () => {
    const key = `test-${Date.now()}-allow`;
    const result = rateLimit(key, { windowMs: 60_000, max: 5 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests exceeding limit", () => {
    const key = `test-${Date.now()}-block`;
    const config = { windowMs: 60_000, max: 3 };

    rateLimit(key, config);
    rateLimit(key, config);
    rateLimit(key, config);
    const result = rateLimit(key, config);

    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", () => {
    const key = `test-${Date.now()}-reset`;
    const config = { windowMs: 50, max: 2 }; // 50ms window

    rateLimit(key, config);
    rateLimit(key, config);
    // Third should fail within window
    const fail = rateLimit(key, config);
    expect(fail.success).toBe(false);

    // Wait for window to expire, then should work again
    return new Promise((resolve) => {
      setTimeout(() => {
        const pass = rateLimit(key, config);
        expect(pass.success).toBe(true);
        resolve(undefined);
      }, 60);
    });
  });

  it("tracks different keys independently", () => {
    const base = Date.now();
    const config = { windowMs: 60_000, max: 1 };

    rateLimit(`${base}-a`, config);
    rateLimit(`${base}-b`, config);

    // Both should be at their limit (remaining 0)
    const a = rateLimit(`${base}-a`, config);
    const b = rateLimit(`${base}-b`, config);

    expect(a.success).toBe(false);
    expect(b.success).toBe(false);
  });

  it("returns resetAt timestamp", () => {
    const key = `test-${Date.now()}-resetAt`;
    const result = rateLimit(key, { windowMs: 60_000, max: 10 });
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });
});
