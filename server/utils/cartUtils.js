// utils/cartUtils.js
exports.calculateSubtotals = (cart) => {
  return cart.products.map(item => ({
    name: item.productId.name,
    quantity: item.quantity,
    subtotal: item.quantity * item.productId.price
  }));
};

exports.calculateTotal = (cart) => {
  return cart.products.reduce(
    (total, item) => total + item.quantity * item.productId.price,
    0
  );
};
