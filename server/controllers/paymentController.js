const Order = require("../models/Order");
const {
  isPaymongoConfigured,
  PAYMONGO_METHODS,
  createCheckoutSession,
  verifyWebhookSignature,
} = require("../config/paymongo");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const shortId = (id) => String(id).slice(-8).toUpperCase();

// ========== CREATE CHECKOUT SESSION (authenticated) ==========
module.exports.createCheckout = async (req, res) => {
  try {
    if (!isPaymongoConfigured) {
      return res.status(503).json({
        error:
          "Online payment is not configured. Set PAYMONGO_SECRET_KEY, or use Cash on Delivery.",
      });
    }

    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: "orderId is required." });
    }

    const order = await Order.findOne({ _id: orderId, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ error: "Order is not awaiting payment." });
    }

    if (!PAYMONGO_METHODS.includes(order.paymentMethod)) {
      return res
        .status(400)
        .json({ error: "This order is not paid online." });
    }

    const session = await createCheckoutSession({
      amount: Math.round(order.totalAmount * 100),
      description: `ASTER Order #${shortId(order._id)}`,
      paymentMethod: order.paymentMethod,
      referenceNumber: String(order._id),
      metadata: { orderId: String(order._id) },
      successUrl: `${CLIENT_URL}/order/success?orderId=${order._id}`,
      cancelUrl: `${CLIENT_URL}/checkout`,
    });

    order.paymongoCheckoutId = session.id;
    await order.save();

    res.status(200).json({ checkoutUrl: session.checkoutUrl });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to start checkout." });
  }
};

// ========== WEBHOOK (PayMongo -> server) ==========
// Mounted with express.raw so req.body is the raw Buffer needed for signing.
module.exports.handleWebhook = async (req, res) => {
  const rawBody = Buffer.isBuffer(req.body)
    ? req.body.toString("utf8")
    : JSON.stringify(req.body);
  const signature = req.headers["paymongo-signature"];

  if (!verifyWebhookSignature(rawBody, signature)) {
    return res.status(401).json({ error: "Invalid webhook signature." });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: "Invalid payload." });
  }

  // Support both v1 (data.attributes.type/.data) and v2 (data.type/.data) shapes.
  const eventType = event?.data?.attributes?.type || event?.data?.type;
  const resource = event?.data?.attributes?.data || event?.data?.data;

  // Acknowledge unrelated events so PayMongo stops retrying.
  if (eventType !== "checkout_session.payment.paid") {
    return res.status(200).json({ received: true });
  }

  try {
    const attrs = resource?.attributes || {};
    const orderId = attrs.metadata?.orderId || attrs.reference_number;
    const paymentId =
      attrs.payments?.[0]?.id || attrs.payment_intent?.id || undefined;

    if (orderId) {
      const order = await Order.findById(orderId);
      // Idempotent: only transition a still-pending order.
      if (order && order.status === "pending") {
        order.status = "paid";
        if (paymentId) order.paymongoPaymentId = paymentId;
        await order.save();
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to process webhook." });
  }
};
