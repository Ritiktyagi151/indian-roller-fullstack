const express = require("express");
const router = express.Router();

const {
  createEnquiry,
  getAllEnquiries,
  updateEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiryController");

router.post("/", createEnquiry);
router.get("/", getAllEnquiries);
router.put("/:id", updateEnquiry);
router.delete("/:id", deleteEnquiry);

module.exports = router;
