const Tesseract = require('tesseract.js');

async function extractTextFromBuffer(buffer) {
  try {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
      logger: m => console.log(m), // optional progress
    });
    return text;
  } catch (err) {
    console.error('OCR error:', err);
    return '';
  }
}

module.exports = { extractTextFromBuffer };
