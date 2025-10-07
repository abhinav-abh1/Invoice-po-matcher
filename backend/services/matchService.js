// backend/services/matchService.js

const FIELDS = {
  number: 'number',
  date: 'date',
  vendor: 'vendor',
  total: 'total',
  lineItems: 'lineItems',
  currency: 'currency'
};

/**
 * Compare two strings ignoring case and spaces
 * Returns a score between 0 and 1
 */
function compareStrings(a = '', b = '') {
  if (!a || !b) return 0;
  return a.trim().toLowerCase() === b.trim().toLowerCase() ? 1 : 0;
}

/**
 * Compare two numbers with tolerance
 * Returns 1 for exact or within tolerance, else normalized 0-1
 */
function compareNumbers(a = 0, b = 0, tolerance = 0.01) {
  if (a === b) return 1;
  const diff = Math.abs(a - b);
  const max = Math.max(a, b);
  if (diff / max <= tolerance) return 1; // within tolerance
  // Partial score based on closeness
  return Math.max(0, 1 - diff / max);
}

/**
 * Compare line items
 * Returns normalized score 0-1
 */
function compareLineItems(invoiceItems = [], poItems = []) {
  if (!invoiceItems.length || !poItems.length) return 0;

  let matches = 0;
  invoiceItems.forEach(inv => {
    poItems.forEach(po => {
      if (
        inv.description.trim().toLowerCase() === po.description.trim().toLowerCase() &&
        inv.quantity === po.quantity &&
        Math.abs((inv.lineTotal || 0) - (po.lineTotal || 0)) < 0.01
      ) matches += 1;
    });
  });

  const maxItems = Math.max(invoiceItems.length, poItems.length);
  return matches / maxItems; // normalized 0-1
}

/**
 * Find best invoice-PO pairs
 * Weights:
 *  - total: 60%
 *  - vendor: 25%
 *  - line items: 15%
 */
function findBestPair(invoices = [], pos = []) {
  const results = [];

  invoices.forEach(invoice => {
    let bestScore = 0;
    let bestPO = null;

    pos.forEach(po => {
      const totalScore =
        compareNumbers(invoice[FIELDS.total], po[FIELDS.total]) * 0.6 +
        compareStrings(invoice[FIELDS.vendor], po[FIELDS.vendor]) * 0.25 +
        compareLineItems(invoice[FIELDS.lineItems], po[FIELDS.lineItems]) * 0.15;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestPO = po;
      }
    });

    results.push({
      invoice,
      po: bestPO,
      score: Number(bestScore.toFixed(3)), // rounded to 3 decimals
    });
  });

  return results;
}

module.exports = { findBestPair, FIELDS };
