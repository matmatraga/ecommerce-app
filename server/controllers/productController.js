const Product = require("../models/Product");
const { body, validationResult } = require("express-validator");

// ========================
// Validation Chains
// ========================

module.exports.validateCreateProduct = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 100 }),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 }),
  body("img").notEmpty().withMessage("Image URL is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  body("stock").optional().isInt({ min: 0 }),
  body("category").optional().isString(),
];

module.exports.validateUpdateProduct = [
  body("name").optional().isLength({ max: 100 }),
  body("description").optional().isLength({ max: 1000 }),
  body("img").optional().notEmpty(),
  body("price").optional().isFloat({ gt: 0 }),
  body("isActive").optional().isBoolean(),
  body("stock").optional().isInt({ min: 0 }),
  body("category").optional().isString(),
];

// ========================
// Controller Methods
// ========================

module.exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin privileges required." });
    }

    const { name, description, img, price, isActive, stock, category } = req.body;

    const newProduct = new Product({
      name,
      description,
      img,
      price,
      isActive,
      stock: stock ?? 10,
      category: category || "general",
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: "Product created successfully.",
      product: savedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create product." });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin privileges required." });
    }

    const products = await Product.find({});
    res.status(200).json({
      message: "All products retrieved successfully.",
      products,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve products." });
  }
};

module.exports.getAllActiveProducts = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const products = await Product.find(filter);
    res.status(200).json({
      message: "All active products retrieved successfully.",
      products,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve active products." });
  }
};

module.exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({
      message: "Product retrieved successfully.",
      product,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve product." });
  }
};

module.exports.updateProductInformation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin privileges required." });
    }

    const updatedFields = {
      name: req.body.name,
      description: req.body.description,
      img: req.body.img,
      price: req.body.price,
      isActive: req.body.isActive,
      stock: req.body.stock,
      category: req.body.category,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      updatedFields,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product." });
  }
};

module.exports.archiveProduct = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin privileges required." });
    }

    const archivedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { isActive: false },
      { new: true }
    );

    if (!archivedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({
      message: "Product archived successfully.",
      product: archivedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to archive product." });
  }
};

module.exports.unarchiveProduct = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin privileges required." });
    }

    const unarchivedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { isActive: true },
      { new: true }
    );

    if (!unarchivedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({
      message: "Product unarchived successfully.",
      product: unarchivedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to unarchive product." });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Admin privileges required." });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({
      message: "Product deleted successfully.",
      product: deletedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product." });
  }
};

// ========================
// Search Products by Name
// ========================
module.exports.searchProductsByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "Product name query is required." });
    }

    const products = await Product.find({
      name: { $regex: name, $options: "i" },
      isActive: true,
    });

    res.status(200).json({
      message: "Products matching name retrieved successfully.",
      products,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to search products by name." });
  }
};

// ========================
// Search Products by Price
// ========================
module.exports.searchProductsByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    if (!minPrice && !maxPrice) {
      return res.status(400).json({ error: "Price range query is required." });
    }

    const query = {};

    if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };

    query.isActive = true;
    const products = await Product.find(query);

    res.status(200).json({
      message: "Products matching price range retrieved successfully.",
      products,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to search products by price." });
  }
};

module.exports.addProductReview = async (req, res) => {
  try {
    const { rating, comment, name } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    product.reviews.push({
      userId: req.user?.id,
      name: name || req.user?.email || "Anonymous",
      rating,
      comment: comment || "",
    });

    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.numReviews = product.reviews.length;
    product.ratings = totalRating / product.numReviews;

    await product.save();

    res.status(201).json({
      message: "Review added successfully.",
      product,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add review." });
  }
};
