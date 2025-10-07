const API_BASE = '/api/invoices';

export async function uploadInvoice(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(API_BASE + '/upload', {
    method: 'POST',
    body: formData
  });
  return response.json();
}

export async function getInvoices() {
  const response = await fetch(API_BASE);
  return response.json();
}