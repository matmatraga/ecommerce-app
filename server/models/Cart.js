const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Properly reference the User model
      required: [true, "User ID is required"]
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference Product model
          required: [true, "Product ID is required"]
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity must be at least 1"]
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true // Adds createdAt and updatedAt
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
