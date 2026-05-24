import type { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

export function createRateLimit(options: {
  windowMs: number;
  maxReqs: number;
  message?: string;
}) {
  const store: RateLimitStore = {};

  setInterval(
    () => {
      const now = Date.now();
      Object.keys(store).forEach((key) => {
        if (store[key].resetTime < now) delete store[key];
      });
    },
    5 * 60 * 1000,
  );

  return function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const key = (req as any).user.userId ?? req.ip ?? "unknown";
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = { count: 1, resetTime: now + options.windowMs };
      next();
      return;
    }

    store[key].count++;

    if (store[key].count > options.maxReqs) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      res
        .status(429)
        .json({ error: options.message ?? "Too many requests", retryAfter });
      return;
    }

    next();
  };
}

export const credentialRateLimit = createRateLimit({
  windowMs: 60_000,
  maxReqs: 10,
  message: "Too many credential requests",
});
export const regenerateRateLimit = createRateLimit({
  windowMs: 60 * 60_000,
  maxReqs: 3,
  message: "Too many key regeneration requests",
});
export const apiRateLimit = createRateLimit({ windowMs: 60_000, maxReqs: 60 });
