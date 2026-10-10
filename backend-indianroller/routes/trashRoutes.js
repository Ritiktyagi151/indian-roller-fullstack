const express = require("express");
const mongoose = require("mongoose");
const models = {
  product: require("../models/Product"),
  category: require("../models/Category"),
  blog: require("../models/Blog"),
  enquiry: require("../models/Enquiry"),
  seo: require("../models/SeoEntry"),
  redirect: require("../models/Redirect"),
};
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const groups = await Promise.all(Object.entries(models).map(async ([type, Model]) => {
      const records = await Model.find({ deletedAt: { $ne: null } })
        .setOptions({ includeDeleted: true })
        .select("name title pageName pageUrl from to email slug deletedAt")
        .lean();
      return records.map((record) => ({
        id: record._id, type,
        name: record.name || record.title || record.pageName || record.from || "Untitled",
        detail: record.email || record.slug || record.pageUrl || record.to || "",
        deletedAt: record.deletedAt,
      }));
    }));
    res.json(groups.flat().sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.param("type", (req, res, next, type) => {
  if (!Object.prototype.hasOwnProperty.call(models, type)) {
    return res.status(400).json({ message: "Invalid trash item type" });
  }
  req.trashModel = models[type];
  next();
});
router.param("id", (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: "Invalid trash item ID" });
  }
  next();
});

router.post("/:type/:id/restore", async (req, res) => {
  try {
    const record = await req.trashModel.findOneAndUpdate(
      { _id: req.params.id, deletedAt: { $ne: null } },
      { $set: { deletedAt: null } },
      { returnDocument: "after", includeDeleted: true, runValidators: true },
    );
    if (!record) return res.status(404).json({ message: "Trash item not found" });
    res.json({ message: "Item restored successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:type/:id", async (req, res) => {
  try {
    const record = await req.trashModel.findOneAndDelete(
      { _id: req.params.id, deletedAt: { $ne: null } },
      { includeDeleted: true },
    );
    if (!record) return res.status(404).json({ message: "Trash item not found" });
    res.json({ message: "Item permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
