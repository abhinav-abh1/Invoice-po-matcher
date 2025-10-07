// frontend/src/api/matchApi.js

export async function uploadInvoice(formData) {
  const response = await fetch("/api/invoices/upload", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Invoice upload failed");
  }
  return response.json();
}

export async function uploadPO(formData) {
  const response = await fetch("/api/pos/upload", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "PO upload failed");
  }
  return response.json();
}

/**
 * Match a specific invoice and PO by ID
 */
export async function matchInvoicesPOs(invoiceId, poId) {
  const response = await fetch("/api/match/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invoiceId, poId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Match failed");
  }
  return response.json();
}
