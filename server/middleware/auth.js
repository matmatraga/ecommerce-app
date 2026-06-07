const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET;

const TOKEN_COOKIE = "token";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Cookie options for the auth token. In production the SPA is served from a
// different origin than the API, so the cookie must be cross-site capable:
// SameSite=None requires Secure. Locally we keep Lax over http://localhost.
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: ONE_DAY_MS,
});

module.exports.TOKEN_COOKIE = TOKEN_COOKIE;

// Create access token with expiration
module.exports.createAccessToken = (user) => {
  const payload = {
    id: user._id,
    isAdmin: user.isAdmin,
    email: user.email
  };

  return jwt.sign(payload, secret, { expiresIn: "1d" });
};

// Sets the JWT as an httpOnly cookie on the response.
module.exports.setAuthCookie = (res, token) => {
  res.cookie(TOKEN_COOKIE, token, cookieOptions());
};

// Clears the auth cookie (used on logout).
module.exports.clearAuthCookie = (res) => {
  res.clearCookie(TOKEN_COOKIE, { ...cookieOptions(), maxAge: undefined });
};

// Reads the raw JWT from the cookie, falling back to the Authorization header.
const getTokenFromRequest = (req) => {
  if (req.cookies && req.cookies[TOKEN_COOKIE]) {
    return req.cookies[TOKEN_COOKIE];
  }
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return null;
};

module.exports.getTokenFromRequest = getTokenFromRequest;

// Middleware: Verify Token
module.exports.verify = (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ error: "No or invalid token provided." });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    // Attach decoded data to request for downstream use
    req.user = decoded;
    next();
  });
};

// Middleware: Admin check (use after verify)
module.exports.requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Admin privileges required." });
  }
  next();
};
