const crypto = require("crypto");
require("dotenv").config();

const SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
const WEBHOOK_SECRET = process.env.PAYMONGO_WEBHOOK_SECRET;
const API_BASE = "https://api.paymongo.com/v2";

// Payment methods that route through PayMongo hosted checkout. COD is handled
// entirely in-app and never reaches PayMongo.
const PAYMONGO_METHODS = ["gcash", "grabpay", "qrph"];

// App order.paymentMethod values → PayMongo checkout_session payment_method_types.
const CHECKOUT_PAYMENT_TYPES = {
  gcash: "gcash",
  grabpay: "grab_pay",
  qrph: "qrph",
};

const toCheckoutPaymentType = (paymentMethod) => {
  const type = CHECKOUT_PAYMENT_TYPES[paymentMethod];
  if (!type) throw new Error(`Unsupported PayMongo payment method: ${paymentMethod}`);
  return type;
};

const isPaymongoConfigured = Boolean(SECRET_KEY);

const authHeader = () =>
  `Basic ${Buffer.from(`${SECRET_KEY}:`).toString("base64")}`;

// Creates a hosted Checkout Session and returns { id, checkoutUrl }.
async function createCheckoutSession({
  amount,
  description,
  paymentMethod,
  referenceNumber,
  metadata,
  successUrl,
  cancelUrl,
}) {
  const response = await fetch(`${API_BASE}/checkout_sessions`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        attributes: {
          line_items: [
            {
              name: description,
              amount, // centavos
              currency: "PHP",
              quantity: 1,
            },
          ],
          payment_method_types: [toCheckoutPaymentType(paymentMethod)],
          reference_number: referenceNumber,
          metadata,
          success_url: successUrl,
          cancel_url: cancelUrl,
        },
      },
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = body?.errors?.[0]?.detail || "PayMongo checkout failed.";
    throw new Error(detail);
  }

  return {
    id: body.data?.id,
    checkoutUrl: body.data?.attributes?.checkout_url,
  };
}

// Verifies the Paymongo-Signature header against the raw request body.
// Header format: "t=<timestamp>,te=<test sig>,li=<live sig>".
function verifyWebhookSignature(rawBody, signatureHeader) {
  if (!WEBHOOK_SECRET || !signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((kv) => kv.split("="))
  );
  const timestamp = parts.t;
  const provided = parts.li || parts.te;
  if (!timestamp || !provided) return false;

  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(provided);
  if (expectedBuf.length !== providedBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}

module.exports = {
  isPaymongoConfigured,
  PAYMONGO_METHODS,
  toCheckoutPaymentType,
  createCheckoutSession,
  verifyWebhookSignature,
};
