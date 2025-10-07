const express = require("express");
const router = express.Router();

router.post("/match", (req, res) => {
  const invoices = req.app.locals.invoices || [];
  const pos = req.app.locals.pos || [];

  if (invoices.length === 0 || pos.length === 0) {
    return res.status(400).json({ error: "Invoice or PO not found" });
  }

  // Use the latest uploaded invoice/PO
  const invoice = invoices[invoices.length - 1];
  const po = pos[pos.length - 1];

  const vendorMatch = invoice.vendor.trim().toLowerCase() === po.vendor.trim().toLowerCase();
  const totalMatch = Math.abs(invoice.total - po.total) < 0.01;
  const lineItemsMatch = invoice.lineItems.length === po.lineItems.length;

  const overallScore = ((vendorMatch ? 1 : 0) + (totalMatch ? 1 : 0) + (lineItemsMatch ? 1 : 0)) / 3;
  const status = vendorMatch && totalMatch ? "Matched" : "Mismatch";

  console.log(`=== MATCH RESULTS ===\nInvoice ${invoice.number} ↔ PO ${po.number} | Score: ${overallScore.toFixed(2)}`);

  res.json({
    invoiceNumber: invoice.number,
    poNumber: po.number,
    invoiceVendor: invoice.vendor,
    poVendor: po.vendor,
    invoiceTotal: invoice.total,
    poTotal: po.total,
    invoiceLineItems: invoice.lineItems,
    poLineItems: po.lineItems,
    vendorMatch,
    totalMatch,
    lineItemsMatch,
    overallScore: parseFloat(overallScore.toFixed(2)),
    status,
  });
});

module.exports = router;
