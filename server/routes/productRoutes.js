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

// Get all active products (for all users)
router.get("/", getAllActiveProducts);

// Get a specific product by ID
router.get("/:productId", getSingleProduct);

// Get a specific product by name
router.get("/search/name", searchProductsByName);

// Get a specific product by price range
router.get("/search/price", searchProductsByPrice);

module.exports = router;
