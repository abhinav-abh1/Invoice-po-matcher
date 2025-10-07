// frontend/src/utils/downloadMatchResult.js

export function downloadMatchResult(pair) {
  if (!pair) return;

  // CSV headers
  let csvContent = `Section,Field,Value\n`;

  // Invoice Info
  csvContent += `Invoice,Number,${pair.invoiceNumber}\n`;
  csvContent += `Invoice,Vendor,${pair.invoiceVendor}\n`;
  csvContent += `Invoice,Total,${pair.invoiceTotal}\n`;
  csvContent += `Invoice,Line Items,${pair.invoiceLineItems.length}\n`;

  // Purchase Order Info
  csvContent += `Purchase Order,Number,${pair.poNumber}\n`;
  csvContent += `Purchase Order,Vendor,${pair.poVendor}\n`;
  csvContent += `Purchase Order,Total,${pair.poTotal}\n`;
  csvContent += `Purchase Order,Line Items,${pair.poLineItems.length}\n`;

  // Overall Match Info
  csvContent += `Match,Status,${pair.status}\n`;
  csvContent += `Match,Overall Score,${pair.overallScore}\n`;

  // Blank line separator
  csvContent += `\nLine Items Comparison,Invoice Item,PO Item\n`;

  // Line item comparisons
  pair.invoiceLineItems.forEach((item, i) => {
    const poItem = pair.poLineItems[i];
    const invoiceName = item.name || item.description || "N/A";
    const poName = poItem?.name || poItem?.description || "N/A";
    csvContent += `Line Item,"${invoiceName.replace(/"/g, '""')}","${poName.replace(/"/g, '""')}"\n`;
  });

  // Create downloadable CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Match_Result_${pair.invoiceNumber || "Unknown"}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// Make it available globally for your button click
window.downloadMatchResult = downloadMatchResult;
