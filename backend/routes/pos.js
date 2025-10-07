const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { upload } = require("../utils/fileUpload");
const { extractFromFile } = require("../services/extractService");

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded." });

    const extractedData = await extractFromFile(req.file.buffer, "purchase_order");

    const poData = {
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

    // **Clear previous POs** for single match
    req.app.locals.pos = [poData];

    console.log(`[POs] Uploaded: ${poData.filename} | Number: ${poData.number}`);

    return res.status(201).json({ success: true, data: poData });
  } catch (err) {
    console.error("[POs] Upload failed:", err);
    return res.status(500).json({ success: false, error: "Failed to process PO.", details: err.message });
  }
});

router.get("/", (req, res) => {
  const pos = req.app.locals.pos || [];
  res.json({ success: true, data: pos });
});

module.exports = router;
