const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { upload } = require("../utils/fileUpload"); // multer memory storage
const { extractFromFile } = require("../services/extractService");

const MAX_INVOICES = 5; // optional limit, but we'll clear old ones for single match

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const extractedData = await extractFromFile(req.file.buffer, "invoice");

    const invoiceData = {
      id: uuidv4(),
      filename: req.file.originalname,
      number: extractedData.number || "UNKNOWN",
      vendor: extractedData.vendor || "UNKNOWN",
      total: extractedData.total || 0,
      lineItems: extractedData.lineItems || [],
      currency: extractedData.currency || "USD",
      rawText: extractedData.rawText || "",
      source: extractedData.rawText ? "OCR/AI" : "unknown",
      uploadedAt: new Date().toISOString(),
    };

    // **Clear previous invoices** to allow single match
    req.app.locals.invoices = [invoiceData];

    console.log(`[Invoices] Uploaded: ${invoiceData.filename} | Number: ${invoiceData.number}`);

    return res.status(201).json({ success: true, data: invoiceData });
  } catch (error) {
    console.error("[Invoices] Upload failed:", error);
    return res.status(500).json({ success: false, error: "Failed to process invoice.", details: error.message });
  }
});

router.get("/", (req, res) => {
  const invoices = req.app.locals.invoices || [];
  res.json({ success: true, data: invoices });
});

module.exports = router;
