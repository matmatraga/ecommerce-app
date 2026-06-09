process.env.PAYMONGO_SECRET_KEY = "sk_test_checkout_mapping";

const { toCheckoutPaymentType, createCheckoutSession } = require("../config/paymongo");

describe("PayMongo checkout payment types", () => {
  it("maps grabpay to grab_pay", () => {
    expect(toCheckoutPaymentType("grabpay")).toBe("grab_pay");
  });

  it("passes gcash and qrph through unchanged", () => {
    expect(toCheckoutPaymentType("gcash")).toBe("gcash");
    expect(toCheckoutPaymentType("qrph")).toBe("qrph");
  });

  it("sends grab_pay in the checkout session request body", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { id: "cs_test", attributes: { checkout_url: "https://checkout.paymongo.com/cs_test" } },
      }),
    });

    await createCheckoutSession({
      amount: 10000,
      description: "Test order",
      paymentMethod: "grabpay",
      referenceNumber: "order123",
      metadata: { orderId: "order123" },
      successUrl: "https://example.com/success",
      cancelUrl: "https://example.com/cancel",
    });

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.data.attributes.payment_method_types).toEqual(["grab_pay"]);
  });
});
