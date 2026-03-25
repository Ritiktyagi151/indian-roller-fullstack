const express = require("express");
const router = express.Router();

const {
  getSeoPages,
  updateSeoPage,
  deleteSeoPage,
  getSeoMetaByPath,
  getSeoSettings,
  updateSeoSettings,
  getRedirects,
  createRedirect,
  deleteRedirect,
  getSitemap,
  getAudit,
} = require("../controllers/seoController");

router.get("/meta", getSeoMetaByPath);
router.get("/pages", getSeoPages);
router.put("/pages/:entityType/:id", updateSeoPage);
router.delete("/pages/:entityType/:id", deleteSeoPage);
router.get("/settings", getSeoSettings);
router.put("/settings", updateSeoSettings);
router.get("/redirects", getRedirects);
router.post("/redirects", createRedirect);
router.delete("/redirects/:id", deleteRedirect);
router.get("/sitemap", getSitemap);
router.get("/audit", getAudit);

module.exports = router;
