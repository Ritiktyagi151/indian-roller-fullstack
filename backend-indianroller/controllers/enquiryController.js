const Enquiry = require("../models/Enquiry");
const { sendAdminNotification, sendAutoResponder } = require("../services/mailService");

exports.createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message, sourceType, formName, metadata } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "At least an email or phone number is required." });
    }

    const enquiry = await Enquiry.create({
      name: name || "Website Visitor",
      email: email || "",
      phone: phone || "",
      message: message || "",
      sourceType: sourceType || "contact",
      formName: formName || "Contact Form",
      metadata: metadata || {},
    });

    const [adminMail, autoReplyMail] = await Promise.allSettled([
      sendAdminNotification(enquiry),
      sendAutoResponder(enquiry),
    ]);

    const warnings = [];

    if (adminMail.status === "rejected") {
      warnings.push("Admin notification email could not be sent.");
    }

    if (autoReplyMail.status === "rejected") {
      warnings.push("Auto-responder email could not be sent.");
    }

    res.status(201).json({
      enquiry,
      warnings,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
