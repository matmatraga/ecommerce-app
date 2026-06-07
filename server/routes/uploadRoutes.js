const express = require("express");
const multer = require("multer");
const { verify, requireAdmin } = require("../middleware/auth");
const { uploadProductImage } = require("../controllers/uploadController");

const router = express.Router();

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed."));
  },
});

// Surface multer errors (size/type) as clean 400s instead of crashing.
const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.post("/", verify, requireAdmin, handleUpload, uploadProductImage);

module.exports = router;
