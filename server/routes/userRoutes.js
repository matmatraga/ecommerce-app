const express = require("express");
const router = express.Router();

const {
  validateRegister,
  registerUser,
  validateLogin,
  loginUser,
  logoutUser,
  getProfile,
  retrieveUserDetails,
  setUserAsAdmin,
  resetPassword,
  validateResetPassword,
} = require("../controllers/userControllers");
const { verify, requireAdmin } = require("../middleware/auth"); // assuming your middleware is still in auth.js
const { authLimiter } = require("../middleware/rateLimiters");

// Public Routes
router.post("/register", authLimiter, validateRegister, registerUser);
router.post("/login", authLimiter, validateLogin, loginUser);
router.post("/logout", logoutUser);

// Protected Routes (must be authenticated)
router.get("/me", verify, getProfile);
router.get("/details", verify, retrieveUserDetails);
router.put("/reset-password", verify, validateResetPassword, resetPassword);

// Admin-only Route
router.patch("/:id/admin", verify, requireAdmin, setUserAsAdmin);

module.exports = router;
