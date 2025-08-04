const express = require("express");
const {
  createOrder,
  getAllOrders,
  getAuthenticatedUserOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderControllers.js");
const { verify, requireAdmin } = require("../middleware/auth.js");

const router = express.Router();

// ========== CREATE ORDER ==========
router.post("/", verify, createOrder);

// ========== GET ALL ORDERS (Admin only) ==========
router.get("/allorders", verify, requireAdmin, getAllOrders);

// ========== GET AUTHENTICATED USER'S ORDERS ==========
router.get("/authenticatedorder", verify, getAuthenticatedUserOrders);

// ========== UPDATE ORDER STATUS (Admin only) ==========
router.patch("/:orderId/status", verify, requireAdmin, updateOrderStatus);

// ========== CANCEL ORDER (User only) ==========
router.patch("/:orderId/cancel", verify, cancelOrder);

module.exports = router;
