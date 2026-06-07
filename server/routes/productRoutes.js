const express = require("express");
const {
  validateCreateProduct,
  validateUpdateProduct,
  createProduct,
  getAllProducts,
  getAllActiveProducts,
  getSingleProduct,
  updateProductInformation,
  archiveProduct,
  unarchiveProduct,
  searchProductsByName,
  searchProductsByPrice,
  addProductReview,
} = require("../controllers/productController");

const { verify, requireAdmin } = require("../middleware/auth"); // assuming auth is centralized

const router = express.Router();

// ========== Protected Admin Routes ==========

// Create new product
router.post("/", verify, requireAdmin, validateCreateProduct, createProduct);

// Get all products (admin only)
router.get("/all", verify, requireAdmin, getAllProducts);

// Update a product
router.patch(
  "/:productId",
  verify,
  requireAdmin,
  validateUpdateProduct,
  updateProductInformation
);

// Archive a product
router.patch("/:productId/archive", verify, requireAdmin, archiveProduct);

// Unarchive a product
router.patch("/:productId/unarchive", verify, requireAdmin, unarchiveProduct);

// ========== Public Routes ==========

// Search routes must be registered before /:productId
router.get("/search/name", searchProductsByName);
router.get("/search/price", searchProductsByPrice);

// Get all active products (for all users)
router.get("/", getAllActiveProducts);

// Get a specific product by ID
router.get("/:productId", getSingleProduct);

// Add review (authenticated)
router.post("/:productId/reviews", verify, addProductReview);

module.exports = router;
