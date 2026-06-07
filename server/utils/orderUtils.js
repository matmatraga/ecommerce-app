exports.calculateOrderTotals = (subTotal) => {
  const salesTax = subTotal * 0.12;
  const shippingFee = 40;
  const total = subTotal + salesTax + shippingFee;
  return { subTotal, salesTax, shippingFee, total };
};
