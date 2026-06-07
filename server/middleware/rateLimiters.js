const rateLimit = require("express-rate-limit");

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const message = (text) => ({ error: text });

// Applied to every request as a baseline.
module.exports.globalLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: message("Too many requests. Please try again later."),
});

// Tighter limit for credential endpoints to slow brute-force attempts.
module.exports.authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: message("Too many attempts. Please try again in a few minutes."),
});

// Limits how many orders a single client can fire off in a window.
module.exports.orderLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: message("Too many orders placed. Please try again later."),
});
