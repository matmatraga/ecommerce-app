const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required!"],
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: [true, "Product description is required!"],
      maxlength: 1000
    },
    img: {
      type: String,
      required: [true, "Image URL is required!"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required!"],
      min: [0, "Price must be a positive number"]
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    category: {
      type: String,
      trim: true,
      default: "general"
    },
    tags: {
      type: [String],
      default: []
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: { type: String, trim: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true // adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
