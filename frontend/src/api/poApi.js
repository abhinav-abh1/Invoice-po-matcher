const API_BASE = '/api/pos';

export async function uploadPO(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(API_BASE + '/upload', {
    method: 'POST',
    body: formData
  });
  return response.json();
}

export async function getPOs() {
  const response = await fetch(API_BASE);
  return response.json();
}