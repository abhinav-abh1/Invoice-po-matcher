import React from "react";
import "../styles/MatchResult.css";

function MatchResult({ pair }) {
  if (!pair) return null;

  const {
    invoiceNumber,
    poNumber,
    invoiceVendor,
    poVendor,
    invoiceTotal,
    poTotal,
    vendorMatch,
    totalMatch,
    lineItemsMatch,
    overallScore,
    status,
    invoiceLineItems,
    poLineItems
  } = pair;

  const getColor = (match) => (match ? "text-green" : "text-red");

  return (
    <div className="match-result-container">
      <h3>
        Match Result:{" "}
        <span
          className={`match-status ${
            status === "Matched" ? "matched" : "unmatched"
          }`}
        >
          {status}
        </span>
      </h3>
      <p><strong>Overall Score:</strong> {overallScore}</p>

      <div className="match-section">
        {/* Invoice info */}
        <div className="match-column">
          <h4>Invoice</h4>
          <p><strong>Number:</strong> {invoiceNumber}</p>
          <p><strong>Vendor:</strong> <span className={getColor(vendorMatch)}>{invoiceVendor}</span></p>
          <p><strong>Total:</strong> <span className={getColor(totalMatch)}>{invoiceTotal}</span></p>
          <p><strong>Line Items:</strong> <span className={getColor(lineItemsMatch)}>{invoiceLineItems.length}</span></p>
        </div>

        {/* PO info */}
        <div className="match-column">
          <h4>Purchase Order</h4>
          <p><strong>Number:</strong> {poNumber}</p>
          <p><strong>Vendor:</strong> <span className={getColor(vendorMatch)}>{poVendor}</span></p>
          <p><strong>Total:</strong> <span className={getColor(totalMatch)}>{poTotal}</span></p>
          <p><strong>Line Items:</strong> <span className={getColor(lineItemsMatch)}>{poLineItems.length}</span></p>
        </div>
      </div>

      {invoiceLineItems.length > 0 && poLineItems.length > 0 && (
        <div className="match-lineitems">
          <h4>Line Items Comparison</h4>
          <table>
            <thead>
              <tr>
                <th>Invoice Item</th>
                <th>PO Item</th>
              </tr>
            </thead>
            <tbody>
              {invoiceLineItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name || item.description || "N/A"}</td>
                  <td>{poLineItems[index]?.name || poLineItems[index]?.description || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        className="download-btn"
        onClick={() => window.downloadMatchResult(pair)}
      >
        Download Result
      </button>
      
    </div>
  );
}

export default MatchResult;
