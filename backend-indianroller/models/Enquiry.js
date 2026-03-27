const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      enum: ["contact", "website-form", "support", "enquiry"],
      default: "contact",
    },
    formName: {
      type: String,
      default: "Contact Form",
    },
    name: {
      type: String,
      trim: true,
      default: "Website Visitor",
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Enquiry", enquirySchema);
