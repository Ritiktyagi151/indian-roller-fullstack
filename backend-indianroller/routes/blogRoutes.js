const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const blogController = require("../controllers/blogController");

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --- Blog Routes ---

// 1. Create Blog
router.post("/", upload.single("image"), blogController.createBlog);

// 2. Get All Blogs
router.get("/", blogController.getAllBlogs);

// 🔥 FIX: Added '/slug/' prefix to match Frontend request
// Frontend call: /api/blogs/slug/detail-ritik-tyagi
router.get("/slug/:slug", blogController.getBlogBySlug);

// 3. Get by ID (Agar kabhi ID se chahiye ho toh niche rakhein)
router.get("/:id", blogController.getBlogById);

// 4. Update Blog
router.put("/:id", upload.single("image"), blogController.updateBlog);

// 5. Delete Blog
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
