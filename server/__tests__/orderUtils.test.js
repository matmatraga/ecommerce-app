const { calculateOrderTotals } = require("../utils/orderUtils");

describe("calculateOrderTotals", () => {
  it("applies 12% tax and flat shipping", () => {
    const result = calculateOrderTotals(100);
    expect(result.subTotal).toBe(100);
    expect(result.salesTax).toBe(12);
    expect(result.shippingFee).toBe(40);
    expect(result.total).toBe(152);
  });
});
