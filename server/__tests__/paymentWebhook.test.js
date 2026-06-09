const crypto = require("crypto");
const request = require("supertest");
const express = require("express");

// The PayMongo config reads env at module load, so set the secret before
// requiring the controller.
const WEBHOOK_SECRET = "whsk_test_secret_for_unit_tests";
process.env.PAYMONGO_WEBHOOK_SECRET = WEBHOOK_SECRET;

jest.mock("../models/Order");
const Order = require("../models/Order");
const { handleWebhook } = require("../controllers/paymentController");

// Mirrors how server.js mounts the webhook: raw body, before express.json().
function buildApp() {
  const app = express();
  app.post("/webhooks/paymongo", express.raw({ type: "application/json" }), handleWebhook);
  return app;
}

// Builds a valid "Paymongo-Signature: t=...,te=...,li=..." header for a body.
function signBody(rawBody, { secret = WEBHOOK_SECRET, live = false } = {}) {
  const timestamp = Math.floor(Date.now() / 1000);
  const digest = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  return live ? `t=${timestamp},li=${digest}` : `t=${timestamp},te=${digest}`;
}

function paidEventBody(orderId, { eventType = "checkout_session.payment.paid" } = {}) {
  return JSON.stringify({
    data: {
      attributes: {
        type: eventType,
        data: {
          id: "cs_test_123",
          type: "checkout_session",
          attributes: {
            metadata: { orderId },
            reference_number: orderId,
            payments: [{ id: "pay_test_123" }],
          },
        },
      },
    },
  });
}

function postWebhook(app, rawBody, signature) {
  const req = request(app)
    .post("/webhooks/paymongo")
    .set("Content-Type", "application/json");
  if (signature) req.set("Paymongo-Signature", signature);
  return req.send(rawBody);
}

describe("PayMongo webhook handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signature verification", () => {
    it("rejects requests with no signature header and never touches orders", async () => {
      const res = await postWebhook(buildApp(), paidEventBody("order1"));

      expect(res.status).toBe(401);
      expect(Order.findById).not.toHaveBeenCalled();
    });

    it("rejects requests signed with the wrong secret", async () => {
      const body = paidEventBody("order1");
      const badSignature = signBody(body, { secret: "whsk_wrong_secret" });

      const res = await postWebhook(buildApp(), body, badSignature);

      expect(res.status).toBe(401);
      expect(Order.findById).not.toHaveBeenCalled();
    });

    it("rejects a tampered body even with a previously valid signature", async () => {
      const original = paidEventBody("order1");
      const signature = signBody(original);
      const tampered = paidEventBody("attacker-order");

      const res = await postWebhook(buildApp(), tampered, signature);

      expect(res.status).toBe(401);
      expect(Order.findById).not.toHaveBeenCalled();
    });

    it("accepts live-mode (li=) signatures too", async () => {
      Order.findById.mockResolvedValue(null);
      const body = paidEventBody("order1");

      const res = await postWebhook(buildApp(), body, signBody(body, { live: true }));

      expect(res.status).toBe(200);
    });
  });

  describe("event filtering", () => {
    it("acknowledges unrelated events without touching the database", async () => {
      const body = paidEventBody("order1", { eventType: "payment.failed" });

      const res = await postWebhook(buildApp(), body, signBody(body));

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ received: true });
      expect(Order.findById).not.toHaveBeenCalled();
    });
  });

  describe("paid transition", () => {
    it("marks a pending order paid and stores the payment id", async () => {
      const order = { status: "pending", save: jest.fn().mockResolvedValue() };
      Order.findById.mockResolvedValue(order);
      const body = paidEventBody("order1");

      const res = await postWebhook(buildApp(), body, signBody(body));

      expect(res.status).toBe(200);
      expect(Order.findById).toHaveBeenCalledWith("order1");
      expect(order.status).toBe("paid");
      expect(order.paymongoPaymentId).toBe("pay_test_123");
      expect(order.save).toHaveBeenCalledTimes(1);
    });

    it("is idempotent: a redelivered event for an already-paid order is a no-op", async () => {
      const order = { status: "paid", save: jest.fn() };
      Order.findById.mockResolvedValue(order);
      const body = paidEventBody("order1");

      const res = await postWebhook(buildApp(), body, signBody(body));

      expect(res.status).toBe(200);
      expect(order.save).not.toHaveBeenCalled();
    });

    it("acknowledges events for unknown orders so PayMongo stops retrying", async () => {
      Order.findById.mockResolvedValue(null);
      const body = paidEventBody("missing-order");

      const res = await postWebhook(buildApp(), body, signBody(body));

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ received: true });
    });
  });
});
