const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createCategory,
  getAllCategories,
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
const upload = multer({ storage });

router.post("/", upload.single("image"), createCategory);
router.get("/", getAllCategories);
router.put("/navbar-order", updateNavbarOrder);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
