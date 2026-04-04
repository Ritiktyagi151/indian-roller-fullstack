const express = require("express");
const router = express.Router();
const {
  getNavbarDropdownData,
  getNavbarDropdownSettings,
  updateNavbarDropdownSettings,
} = require("../controllers/navbarDropdownController");

router.get("/products-dropdown", getNavbarDropdownData);
router.get("/products-dropdown/config", getNavbarDropdownSettings);
router.put("/products-dropdown/config", updateNavbarDropdownSettings);

module.exports = router;
