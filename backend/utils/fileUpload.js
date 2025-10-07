const multer = require('multer');

// Configure multer to use memory storage.
// This is more efficient as it avoids writing temporary files to disk.
const storage = multer.memoryStorage();

// Create the multer instance with the storage configuration.
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    // Optional: filter for specific file types like PDF or images.
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
    }
  }
});

// Export the configured multer instance.
module.exports = { upload };