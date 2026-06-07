const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const UPLOAD_FOLDER = process.env.CLOUDINARY_FOLDER || "aster-products";

module.exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: "Admin privileges required." });
    }

    if (!isCloudinaryConfigured) {
      return res.status(503).json({
        error:
          "Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET, or paste an image URL instead.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: UPLOAD_FOLDER, resource_type: "image" },
        (error, uploadResult) => {
          if (error) return reject(error);
          resolve(uploadResult);
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(201).json({
      message: "Image uploaded successfully.",
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload image." });
  }
};
