import { useState } from 'react';
import UploadBox from '../components/UploadBox';
import MatchResult from '../components/MatchResult';
import { uploadInvoice, uploadPO, matchInvoicesPOs } from '../api/matchApi';
import '../styles/Dashboard.css';  // ✅ Import the new CSS
import "../utils/downloadMatchResult";

function Dashboard() {
  const [invoice, setInvoice] = useState(null);
  const [po, setPO] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadInvoice = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const data = await uploadInvoice(formData);
    setInvoice(data);
    return data;
  };

  const handleUploadPO = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const data = await uploadPO(formData);
    setPO(data);
    return data;
  };

  const handleCompare = async () => {
    if (!invoice || !po) {
      alert('Please upload both an Invoice and a PO before comparing.');
      return;
    }
    setLoading(true);
    try {
      const result = await matchInvoicesPOs();
      setMatchResult(result);
    } catch (err) {
      console.error('Match failed:', err);
      alert('Matching failed. Check console for details.');
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Invoice & PO Matcher</h1>

      <div className="upload-section">
        <UploadBox title="Upload Invoice" maxFiles={1} onUpload={handleUploadInvoice} />
        <UploadBox title="Upload PO" maxFiles={1} onUpload={handleUploadPO} />
      </div>

      <button
        onClick={handleCompare}
        disabled={loading}
        className={`compare-btn ${loading ? 'loading' : ''}`}
      >
        {loading ? 'Matching...' : 'Compare Files'}
      </button>

      {matchResult && (
        <div className="result-section">
          <MatchResult pair={matchResult} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
