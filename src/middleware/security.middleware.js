import aj from "#config/arcjet.js";
import logger from "#config/logger.js";
import { slidingWindow } from "@arcjet/node";

// Paths that should skip security checks (exact match only)
const SKIP_PATHS = ["/health", "/api"];

export const securityMiddleware = async (req, res, next) => {
  // Skip security middleware for whitelisted paths (exact match)
  if (SKIP_PATHS.includes(req.path)) {
    return next();
  }

  try {
    const role = req.user?.role || "guest";

    let limit, message;

    switch (role) {
      case "admin":
        limit = 20;
        message = "Admin rate limit exceeded(20 per minute). Please try again later.";
        break;
      case "user":
        limit = 10;
        message = "User rate limit exceeded(10 per minute). Please try again later.";
        break;
      default:
        limit = 5;
        message = "Guest rate limit exceeded(5 per minute). Please try again later.";
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: limit,
        name: `${role}_rate_limit`,
      })
    );

    const decision = await client.protect(req);

    // Handle decisions
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn("Bot request detected", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        path: req.path,
      });
      return res.status(403).json({
        error: "Forbidden",
        message: "Access denied due to bot detection.",
      });
    } else if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn("Shield rule triggered", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        path: req.path,
        method: req.method,
      });
      return res.status(403).json({
        error: "Forbidden",
        message: "Access denied due to security policies.",
      });
    } else if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn("Rate limit exceeded", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        path: req.path,
      });
      return res.status(403).json({
        error: "Forbidden",
        message,
      });
    }

    // Proceed to next middleware if all checks pass
    next();
  } catch (error) {
    logger.error("Security middleware error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Something went wrong in the security middleware.",
    });
  }
};
