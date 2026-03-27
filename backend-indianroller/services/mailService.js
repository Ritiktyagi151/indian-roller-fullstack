const nodemailer = require("nodemailer");

const SALES_EMAIL = process.env.SALES_EMAIL || "sales@indianroller.com";
const FROM_EMAIL =
  process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || SALES_EMAIL;
const FROM_NAME = process.env.SMTP_FROM_NAME || "Indian Roller";

let transporter;

function hasSmtpConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS,
  );
}

function getTransporter() {
  if (!hasSmtpConfig()) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production", // ← yeh add karo
      },
    });
  }

  return transporter;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatValue(value) {
  if (value === undefined || value === null || value === "") {
    return "Not provided";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function buildRows(payload) {
  return Object.entries(payload)
    .map(([label, value]) => {
      const safeLabel = escapeHtml(label);
      const safeValue = escapeHtml(formatValue(value)).replace(/\n/g, "<br />");
      return `<tr><td style="padding:10px;border:1px solid #e5e7eb;font-weight:600;background:#f8fafc;">${safeLabel}</td><td style="padding:10px;border:1px solid #e5e7eb;">${safeValue}</td></tr>`;
    })
    .join("");
}

async function sendAdminNotification(enquiry) {
  const mailer = getTransporter();

  if (!mailer) {
    return { skipped: true, reason: "SMTP is not configured." };
  }

  const payload = {
    "Form Name": enquiry.formName,
    "Source Type": enquiry.sourceType,
    Name: enquiry.name,
    Email: enquiry.email,
    Phone: enquiry.phone,
    Message: enquiry.message,
    Metadata: enquiry.metadata,
    "Created At": enquiry.createdAt,
    "Database ID": enquiry._id,
  };

  await mailer.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: SALES_EMAIL,
    replyTo: enquiry.email || undefined,
    subject: `[Indian Roller] ${enquiry.formName} submission from ${enquiry.name || "Website Visitor"}`,
    text: Object.entries(payload)
      .map(([label, value]) => `${label}: ${formatValue(value)}`)
      .join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#111827;">
        <h2 style="margin-bottom:8px;">New Website Form Submission</h2>
        <p style="margin-top:0;color:#4b5563;">A new submission was received on the Indian Roller website.</p>
        <table style="border-collapse:collapse;width:100%;max-width:760px;">
          ${buildRows(payload)}
        </table>
      </div>
    `,
  });

  return { skipped: false };
}

async function sendAutoResponder(enquiry) {
  const mailer = getTransporter();

  if (!mailer) {
    return { skipped: true, reason: "SMTP is not configured." };
  }

  if (!enquiry.email) {
    return { skipped: true, reason: "Sender email not provided." };
  }

  await mailer.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: enquiry.email,
    subject: "Thank you for contacting Indian Roller",
    text: [
      `Hello ${enquiry.name || "there"},`,
      "",
      "Thank you for contacting Indian Roller.",
      `We have received your ${enquiry.formName.toLowerCase()} and our team will review it shortly.`,
      "If your request needs urgent attention, you can also reply to this email.",
      "",
      "Regards,",
      "Indian Roller Sales Team",
      SALES_EMAIL,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6;">
        <h2 style="margin-bottom:8px;">Thank you for contacting Indian Roller</h2>
        <p>Hello ${escapeHtml(enquiry.name || "there")},</p>
        <p>We have received your <strong>${escapeHtml(enquiry.formName.toLowerCase())}</strong> and our team will review it shortly.</p>
        <p>If your request needs urgent attention, you can reply to this email and our sales team will get back to you.</p>
        <p style="margin-top:24px;">Regards,<br />Indian Roller Sales Team<br />${escapeHtml(SALES_EMAIL)}</p>
      </div>
    `,
  });

  return { skipped: false };
}

module.exports = {
  SALES_EMAIL,
  FROM_EMAIL,
  hasSmtpConfig,
  getTransporter,
  sendAdminNotification,
  sendAutoResponder,
};
