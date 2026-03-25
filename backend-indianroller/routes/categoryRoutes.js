const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
// Ensure all functions are imported correctly
const { 
    createCategory, 
    getAllCategories, 
    updateCategory, 
    deleteCategory 
} = require("../controllers/categoryController");

// Multer Storage Config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes logic
router.post("/", upload.single("image"), createCategory);
router.get("/", getAllCategories);

// ✅ Add these two lines for Edit and Delete to work
router.put("/:id", upload.single("image"), updateCategory); // Update with image support
router.delete("/:id", deleteCategory); // Delete by ID

module.exports = router;