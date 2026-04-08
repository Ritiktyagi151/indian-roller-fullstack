const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  updateNavbarOrder,
} = require("../controllers/categoryController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (["image", "bannerDesktop", "bannerMobile"].includes(file.fieldname)) {
      if (!allowedImageMimeTypes.includes(file.mimetype)) {
        const error = new Error("Only JPG, PNG, and WEBP images are allowed.");
        error.status = 400;
        return cb(error);
      }
    }

    cb(null, true);
  },
});

function categoryUploadMiddleware(req, res, next) {
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerDesktop", maxCount: 1 },
    { name: "bannerMobile", maxCount: 1 },
  ])(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Each image must be 2MB or smaller." });
    }

    return res.status(error.status || 400).json({ message: error.message });
  });
}

router.post("/", categoryUploadMiddleware, createCategory);
router.get("/", getAllCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.put("/navbar-order", updateNavbarOrder);
router.put("/:id", categoryUploadMiddleware, updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
