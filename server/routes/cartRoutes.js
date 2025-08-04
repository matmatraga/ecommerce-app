const express = require("express");
const cartControllers = require("../controllers/cartControllers.js");
const auth = require("../middleware/auth.js"); // Assuming you have an auth middleware for authentication


const router = express.Router();

router.post("/", cartControllers.addedProducts);

router.get("/", cartControllers.getUserCart);

router.put("/quantity", cartControllers.changeProductQuantities);

router.delete("/removecart", cartControllers.removeCart);

router.get("/subtotal", cartControllers.subTotals);

router.get("/total", cartControllers.totalPrice);

module.exports = router;