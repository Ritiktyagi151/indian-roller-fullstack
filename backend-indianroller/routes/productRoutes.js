const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getProductBySlug, // ✅ Naya function import karein
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const imageMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (file.fieldname === "image" || file.fieldname === "images") {
      return cb(null, imageMimeTypes.includes(file.mimetype));
    }

    if (file.fieldname === "technicalDrawing") {
      return cb(
        null,
        [...imageMimeTypes, "application/pdf"].includes(file.mimetype),
      );
    }

    if (file.fieldname === "catalogDownload") {
      return cb(
        null,
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.mimetype),
      );
    }

    if (file.fieldname === "video") {
      return cb(null, file.mimetype.startsWith("video/"));
    }

    cb(null, true);
  },
});

// Base path: /api/products
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
    { name: "technicalDrawing", maxCount: 1 },
    { name: "catalogDownload", maxCount: 1 },
  ]),
  createProduct,
);
router.get("/", getAllProducts);
router.get("/category/:categorySlug", getProductsByCategory);

// 🔥 Yeh route zaruri hai clean URL ke liye (/ritik-roller)
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
    { name: "technicalDrawing", maxCount: 1 },
    { name: "catalogDownload", maxCount: 1 },
  ]),
  updateProduct,
);
router.delete("/:id", deleteProduct);

module.exports = router;
