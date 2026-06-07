const Product = require("../models/Product");

exports.validateStock = async (productId, requestedQty, existingCartQty = 0) => {
  const product = await Product.findById(productId);
  if (!product) {
    return { ok: false, status: 404, error: "Product not found." };
  }
  if (!product.isActive) {
    return { ok: false, status: 400, error: "Product is not available." };
  }
  const totalNeeded = existingCartQty + requestedQty;
  if (product.stock < totalNeeded) {
    return {
      ok: false,
      status: 400,
      error: `Insufficient stock for ${product.name}. Only ${product.stock} available.`,
    };
  }
  return { ok: true, product };
};

exports.decrementStock = async (products) => {
  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product || product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${item.productId}`);
    }
    product.stock -= item.quantity;
    await product.save();
  }
};

exports.restoreStock = async (products) => {
  for (const item of products) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity },
    });
  }
};
