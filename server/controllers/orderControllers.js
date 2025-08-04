const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// ========== CREATE ORDER ==========
module.exports.createOrder = async (req, res) => {
  try {
    const userData = auth.decode(req.headers.authorization);

    if (userData.isAdmin) {
      return res.status(403).json({ message: "For non-admin users only!" });
    }

    const cart = await Cart.findOne({ userId: userData.id }).populate({
      path: "products.productId",
      model: "Product"
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Compute subtotals for each product
    const products = cart.products.map((item) => {
      const price = item.productId.price;
      const subtotal = price * item.quantity;

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        priceAtPurchase: price,
        subtotal
      };
    });

    const subTotal = products.reduce((acc, p) => acc + p.subtotal, 0);
    const salesTax = subTotal * 0.12;
    const shippingFee = 40;
    const total = subTotal + salesTax + shippingFee;

    // Optional: retrieve shipping address and payment method from request
    const { shippingAddress, paymentMethod } = req.body;

    // Create order
    const newOrder = new Order({
      userId: userData.id,
      products,
      totalAmount: total,
      shippingAddress,
      paymentMethod
    });

    await newOrder.save();

    // Clear cart after checkout
    await Cart.findByIdAndDelete(cart._id);

    res.status(201).json({
      message: "Order placed successfully.",
      order: newOrder
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
};

// ========== GET AUTHENTICATED USER'S ORDERS ==========
module.exports.getAuthenticatedUserOrders = async (req, res) => {
  try {
    const userData = auth.decode(req.headers.authorization);

    if (userData.isAdmin) {
      return res.status(403).json({ error: "Admins cannot retrieve user orders." });
    }

    const orders = await Order.find({ userId: userData.id }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "User orders retrieved successfully.",
      orders
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user orders." });
  }
};

// ========== GET ALL ORDERS (Admin Only) ==========
module.exports.getAllOrders = async (req, res) => {
  try {
    const userData = auth.decode(req.headers.authorization);

    if (!userData.isAdmin) {
      return res.status(403).json({ error: "Admin privileges required." });
    }

    const orders = await Order.find({})
      .populate("userId", "email")
      .populate("products.productId", "name price");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json({
      message: "All orders retrieved successfully.",
      orders
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve all orders." });
  }
};

// ========== UPDATE ORDER STATUS (Admin Only) ==========
module.exports.updateOrderStatus = async (req, res) => {
  try {
    const userData = auth.decode(req.headers.authorization);

    if (!userData.isAdmin) {
      return res.status(403).json({ error: "Admin privileges required." });
    }

    const { status } = req.body;
    const orderId = req.params.orderId;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({
      message: `Order status updated to '${status}'.`,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status." });
  }
};

// ========== CANCEL ORDER (User Only) ==========
module.exports.cancelOrder = async (req, res) => {
  try {
    const userData = auth.decode(req.headers.authorization);

    if (userData.isAdmin) {
      return res.status(403).json({ error: "Admins cannot cancel orders." });
    }

    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId, userId: userData.id });

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ error: "Only pending orders can be cancelled." });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully.",
      order
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel order." });
  }
};
