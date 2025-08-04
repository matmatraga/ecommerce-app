const express = require("express");
const router = express.Router();

const {
  validateRegister,
  registerUser,
  validateLogin,
  loginUser,
  getProfile,
  retrieveUserDetails,
  setUserAsAdmin,
  resetPassword,
  validateResetPassword,
} = require("../controllers/userControllers");
const { verify, requireAdmin } = require("../middleware/auth"); // assuming your middleware is still in auth.js

// Public Routes
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

// Protected Routes (must be authenticated)
router.get("/me", verify, getProfile);
router.get("/details", verify, retrieveUserDetails);
router.put("/reset-password", verify, validateResetPassword, resetPassword);

// Admin-only Route
router.patch("/:id/admin", verify, requireAdmin, setUserAsAdmin);

module.exports = router;
