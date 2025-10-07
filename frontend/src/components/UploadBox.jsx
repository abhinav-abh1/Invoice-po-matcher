import { useState } from 'react';
import '../styles/UploadBox.css'; // ✅ Add this line

function UploadBox({ title, onUpload, maxFiles = 3, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).slice(0, maxFiles - files.length);
    handleFiles(droppedFiles);
  };

  const handleFiles = async (newFiles) => {
    for (const file of newFiles) {
      try {
        const uploadedData = await onUpload(file);
        if (uploadedData) {
          setFiles(prev => [...prev, { ...uploadedData, filename: file.name }]);
          if (onSuccess) onSuccess();
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  return (
    <div
      className={`upload-box ${dragging ? 'dragging' : ''}`} // ✅ Add dynamic class
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`${title.toLowerCase()}-input`).click()}
    >
      <h3>{title} ({files.length}/{maxFiles})</h3>
      <p>Drag & drop or click to upload PDF/images</p>
      <input
        id={`${title.toLowerCase()}-input`}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        onChange={(e) => handleFiles(Array.from(e.target.files))}
        style={{ display: 'none' }}
      />
      {files.length > 0 && (
        <ul className="upload-list">
          {files.map((f, i) => <li key={i}>{f.filename}</li>)}
        </ul>
      )}
    </div>
  );
}

export default UploadBox;
