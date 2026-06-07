const express = require("express");
const { verify } = require("../middleware/auth");
const { createCheckout } = require("../controllers/paymentController");

const router = express.Router();

router.post("/checkout", verify, createCheckout);

module.exports = router;
