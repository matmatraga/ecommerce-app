const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET;

// Create access token with expiration
module.exports.createAccessToken = (user) => {
  const payload = {
    id: user._id,
    isAdmin: user.isAdmin,
    email: user.email
  };

  return jwt.sign(payload, secret, { expiresIn: "1d" });
};

// Middleware: Verify Token
module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No or invalid token provided." });
  }

  token = token.slice(7); // Remove 'Bearer '

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

// Utility: Decode Token
module.exports.decode = (token) => {
  if (!token || !token.startsWith("Bearer ")) return null;
  return jwt.decode(token.slice(7), { complete: true })?.payload;
};
