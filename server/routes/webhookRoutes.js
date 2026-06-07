const express = require("express");
const { handleWebhook } = require("../controllers/paymentController");

const router = express.Router();

// Raw body is required for PayMongo signature verification.
router.post(
  "/paymongo",
  express.raw({ type: "application/json" }),
  handleWebhook
);

module.exports = router;
