const Order = require("../models/Order");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");
const { calculateOrderTotals } = require("../utils/orderUtils");
const { validateStock, decrementStock, restoreStock } = require("../utils/stockUtils");

const buildOrderFromCart = async (cart, body = {}) => {
  if (!cart || !cart.products.length) {
    return { error: "Cart is empty.", status: 400 };
  }

  for (const item of cart.products) {
    const stockCheck = await validateStock(
      item.productId._id,
      item.quantity,
      0
    );
    if (!stockCheck.ok) {
      return { error: stockCheck.error, status: stockCheck.status };
    }
  }

  const products = cart.products.map((item) => {
    const price = item.productId.price;
    const subtotal = price * item.quantity;
    return {
      productId: item.productId._id,
      quantity: item.quantity,
      priceAtPurchase: price,
      subtotal,
    };
  });

  const subTotal = products.reduce((acc, p) => acc + p.subtotal, 0);
  const totals = calculateOrderTotals(subTotal);

  return {
    products,
    ...totals,
    shippingAddress: body.shippingAddress,
    paymentMethod: body.paymentMethod || "cod",
  };
};

module.exports.buildOrderFromCart = buildOrderFromCart;

// ========== CREATE ORDER ==========
module.exports.createOrder = async (req, res) => {
  try {
    const userData = auth.decode(req.headers.authorization);

    if (userData.isAdmin) {
      return res.status(403).json({ message: "For non-admin users only!" });
    }

    const cart = await Cart.findOne({ userId: userData.id }).populate({
      path: "products.productId",
      model: "Product",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const orderData = await buildOrderFromCart(cart, req.body);
    if (orderData.error) {
      return res.status(orderData.status).json({ error: orderData.error });
    }

    const newOrder = new Order({
      userId: userData.id,
      products: orderData.products,
      totalAmount: orderData.total,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      status: "pending",
    });

    await decrementStock(orderData.products);
    await newOrder.save();
    await Cart.findByIdAndDelete(cart._id);

    res.status(201).json({
      message: "Order placed successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// ========== GET AUTHENTICATED USER'S ORDERS ==========
module.exports.getAuthenticatedUserOrders = async (req, res) => {
  try {
    const userData = auth.decode(req.headers.authorization);

    if (userData.isAdmin) {
      return res
        .status(403)
        .json({ error: "Admins cannot retrieve user orders." });
    }

    const orders = await Order.find({ userId: userData.id })
      .sort({ createdAt: -1 })
      .populate("products.productId", "name img price");

    res.status(200).json({
      message: "User orders retrieved successfully.",
      orders,
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

    res.status(200).json({
      message: "All orders retrieved successfully.",
      orders,
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
      order: updatedOrder,
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
      return res
        .status(400)
        .json({ error: "Only pending orders can be cancelled." });
    }

    order.status = "cancelled";
    await order.save();
    await restoreStock(order.products);

    res.status(200).json({
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel order." });
  }
};
