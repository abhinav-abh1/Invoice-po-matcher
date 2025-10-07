// frontend/src/invoice/upload.js
async function uploadInvoice(file) {
  const formData = new FormData();
  formData.append("file", file); // MUST match backend field name

  const response = await fetch("/api/invoices/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Upload failed");
  return data;
}

// Example usage:
const fileInput = document.querySelector("#invoiceInput");
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const result = await uploadInvoice(file);
    console.log("Invoice uploaded:", result.data);
  } catch (err) {
    console.error("Upload error:", err.message);
  }
});
