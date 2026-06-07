const Cart = require("../models/Cart");
const { calculateSubtotals, calculateTotal } = require("../utils/cartUtils");
const { validateStock } = require("../utils/stockUtils");

// ========== Add to Cart ==========
module.exports.addToCart = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).json({ error: "Admins cannot manage carts." });
    }

    const { productId, quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1." });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    const existingItem = cart?.products.find(
      (p) => p.productId.toString() === productId
    );
    const existingQty = existingItem ? existingItem.quantity : 0;

    const stockCheck = await validateStock(productId, quantity, existingQty);
    if (!stockCheck.ok) {
      return res.status(stockCheck.status).json({ error: stockCheck.error });
    }

    let cartDoc = cart;

    if (!cartDoc) {
      cartDoc = new Cart({
        userId: req.user.id,
        products: [{ productId, quantity }],
      });
    } else {
      const index = cartDoc.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (index !== -1) {
        cartDoc.products[index].quantity += quantity;
      } else {
        cartDoc.products.push({ productId, quantity });
      }
    }

    await cartDoc.save();

    const populatedCart = await Cart.findById(cartDoc._id).populate({
      path: "products.productId",
      model: "Product"
    });

    const productsWithSubtotals = calculateSubtotals(populatedCart);

    res.status(200).json({
      message: "Cart updated successfully.",
      cart: {
        _id: cartDoc._id,
        userId: cartDoc.userId,
        products: productsWithSubtotals,
      },
      total: calculateTotal(populatedCart),
    });
  } catch (err) {
	console.error("Cart Update Error:", err);
    res.status(500).json({ error: "Failed to update cart." });
  }
};

// ========== Get User Cart ==========
module.exports.getUserCart = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).json({ error: "Admins do not have carts." });
    }

    const cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: "products.productId",
      model: "Product"
    });

    if (!cart || cart.products.length === 0) {
      return res.status(200).json({
        message: "Cart retrieved successfully.",
        cart: { products: [] },
        total: 0,
      });
    }

    const productsWithSubtotals = calculateSubtotals(cart);

    res.status(200).json({
      message: "Cart retrieved successfully.",
      cart: {
        _id: cart._id,
        userId: cart.userId,
        products: productsWithSubtotals,
      },
      total: calculateTotal(cart),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve cart." });
  }
};

// ========== Change Quantities ==========
module.exports.updateQuantities = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).json({ error: "Admins do not have carts." });
    }

    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Products must be a non-empty array." });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    for (const update of products) {
      const index = cart.products.findIndex(
        (item) => item.productId.toString() === update.productId
      );

      if (index === -1) {
        return res.status(400).json({ error: `Product ${update.productId} not found in cart.` });
      }

      if (update.quantity < 1) {
        cart.products.splice(index, 1);
        continue;
      }

      const stockCheck = await validateStock(update.productId, update.quantity, 0);
      if (!stockCheck.ok) {
        return res.status(stockCheck.status).json({ error: stockCheck.error });
      }

      cart.products[index].quantity = update.quantity;
    }

    await cart.save();

    // Populate and compute subtotals
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "products.productId",
      model: "Product"
    });

    const productsWithSubtotals = calculateSubtotals(populatedCart);

    res.status(200).json({
      message: "Product quantities updated.",
      cart: {
        _id: cart._id,
        userId: cart.userId,
        products: productsWithSubtotals,
      },
      total: calculateTotal(populatedCart),
    });
  } catch (err) {
    console.error("Update Quantities Error:", err);
    res.status(500).json({ error: "Failed to update cart." });
  }
};

// ========== Optional: Clear Cart Products but Keep Cart ==========
module.exports.clearCart = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).json({ error: "Admins do not have carts." });
    }

    const cleared = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { products: [] },
      { new: true }
    );

    if (!cleared) {
      return res.status(404).json({ error: "Cart not found." });
    }

    res.status(200).json({ message: "Cart cleared successfully.", cart: cleared });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart." });
  }
};
