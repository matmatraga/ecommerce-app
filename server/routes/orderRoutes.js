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

router.post("/", verify, createOrder);
router.get("/allorders", verify, requireAdmin, getAllOrders);
router.get("/authenticatedorder", verify, getAuthenticatedUserOrders);
router.patch("/:orderId/status", verify, requireAdmin, updateOrderStatus);
router.patch("/:orderId/cancel", verify, cancelOrder);

module.exports = router;
