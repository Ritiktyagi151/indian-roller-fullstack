const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// --- 🚀 ROUTE IMPORTS ---
const blogRoutes = require("./routes/blogRoutes");
const categoryRoutes = require("./routes/categoryRoutes"); // Naya import
const productRoutes = require("./routes/productRoutes"); // Naya import
const enquiryRoutes = require("./routes/enquiryRoutes");
const seoRoutes = require("./routes/seoRoutes");

const app = express();

// --- 🛠️ MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder for Images (Uploads folder handle karne ke liye)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 🗄️ DATABASE CONNECTION ---
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ Error: MONGO_URI is missing in .env file!");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Indian Roller DB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });

// --- 🚀 API ROUTES ---
app.use("/api/blogs", blogRoutes); // Blog APIs
app.use("/api/categories", categoryRoutes); // Category Manager APIs
app.use("/api/products", productRoutes); // Product Manager APIs
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/seo", seoRoutes);

// Default Root Route
app.get("/", (req, res) => {
  res.send("Indian Roller Backend API is Running... 🚀");
});

// --- ⚠️ ERROR HANDLING MIDDLEWARE ---
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found!" });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
});

// --- 🔊 SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is roaring on port ${PORT}`);
  console.log(`🔗 Blogs: http://localhost:${PORT}/api/blogs`);
  console.log(`🔗 Categories: http://localhost:${PORT}/api/categories`);
  console.log(`🔗 Products: http://localhost:${PORT}/api/products`);
});
