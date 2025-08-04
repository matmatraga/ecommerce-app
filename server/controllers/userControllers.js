const Users = require("../models/Users.js");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth.js");
const { body, validationResult } = require("express-validator");

// ========================
// Validation Rules
// ========================

// Registration validation
module.exports.validateRegister = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("isAdmin")
    .optional()
    .isBoolean()
    .withMessage("isAdmin must be true or false"),
];

// Reset password validation
module.exports.validateResetPassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
];

// Login validation
module.exports.validateLogin = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// ========================
// Controller Logic
// ========================

// REGISTER
module.exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  try {
    const { email, password, isAdmin } = req.body;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      email,
      password: hashedPassword,
      isAdmin: !!isAdmin,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ error: "Registration failed." });
  }
};

// LOGIN
module.exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = auth.createAccessToken(user);
    res.status(200).json({ auth: token });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
};

// GET PROFILE (authenticated user)
module.exports.getProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve profile." });
  }
};

// PROMOTE USER TO ADMIN
module.exports.setUserAsAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { isAdmin: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User promoted to admin." });
  } catch (err) {
    res.status(500).json({ error: "Failed to promote user." });
  }
};

// GET USER DETAILS BY ID IN TOKEN
module.exports.retrieveUserDetails = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve user details." });
  }
};

// RESET PASSWORD
module.exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  try {
    const { currentPassword, newPassword } = req.body;

    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset password." });
  }
};
