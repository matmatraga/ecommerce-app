const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { calculateSubtotals } = require("../utils/cartUtils");

// ========== Add to Cart ==========
module.exports.addToCart = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).json({ error: "Admins cannot manage carts." });
    }

    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        products: [{ productId, quantity }]
      });
    } else {
      const index = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (index !== -1) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();

    // Populate and compute subtotal
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "products.productId",
      model: "Product"
    });

    const productsWithSubtotals = calculateSubtotals(populatedCart);

    res.status(200).json({
      message: "Cart updated successfully.",
      cart: {
        _id: cart._id,
        userId: cart.userId,
        products: productsWithSubtotals
      }
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

    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
	}
	  
	const productsWithSubtotals = calculateSubtotals(cart);

	  res.status(200).json({
		message: "Cart retrieved successfully.",
		cart: {
			_id: cart._id,
			userId: cart.userId,
			products: productsWithSubtotals
		}
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

    // Update quantities of matching products only
    for (const update of products) {
      const index = cart.products.findIndex(
        (item) => item.productId.toString() === update.productId
      );

      if (index !== -1) {
        cart.products[index].quantity = update.quantity;
      } else {
        return res.status(400).json({ error: `Product ${update.productId} not found in cart.` });
      }
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
        products: productsWithSubtotals
      }
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
