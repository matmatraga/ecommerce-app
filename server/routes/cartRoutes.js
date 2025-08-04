const express = require("express");
const {
  addToCart,
  getUserCart,
  updateQuantities,
  clearCart
} = require("../controllers/cartControllers.js");

const {verify} = require("../middleware/auth.js"); // Assuming you're using the improved centralized auth.js

const router = express.Router();

// ========== Authenticated User Cart Routes ==========

// Add product to cart
router.post("/", verify, addToCart);

// Get cart with product details and subtotals
router.get("/", verify, getUserCart);

// Update product quantities in cart
router.put("/quantity", verify, updateQuantities);

// Optional: clear all items from cart but keep the document
router.patch("/clear", verify, clearCart);

module.exports = router;
