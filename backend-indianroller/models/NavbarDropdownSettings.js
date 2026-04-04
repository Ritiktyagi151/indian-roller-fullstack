const mongoose = require("mongoose");

const dropdownItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["category", "product"],
      required: true,
    },
    refId: {
      type: String,
      required: true,
      trim: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: "",
      trim: true,
    },
    categoryReference: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false },
);

const dropdownSectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ["industry", "material"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    displayType: {
      type: String,
      enum: ["category", "product"],
      default: "category",
    },
    items: {
      type: [dropdownItemSchema],
      default: [],
    },
  },
  { _id: false },
);

const navbarDropdownSettingsSchema = new mongoose.Schema(
  {
    sections: {
      type: [dropdownSectionSchema],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("NavbarDropdownSettings", navbarDropdownSettingsSchema);
