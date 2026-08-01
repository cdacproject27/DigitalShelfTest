import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Load the PDF.js worker from a CDN — avoids Vite bundling headaches
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function ReadBookModal({ blobUrl, title, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const blockShortcuts = (e) => {
      // Block Save, Print (print dialogs allow "save as PDF"), and DevTools shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p")) {
        e.preventDefault();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", blockShortcuts);
    return () => document.removeEventListener("keydown", blockShortcuts);
  }, [onClose]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const goToNextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#1e1e1e",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          background: "#0f172a",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        <span style={{ fontWeight: "700" }}>{title} (Rented — view only)</span>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {numPages && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={goToPrevPage} disabled={pageNumber <= 1} style={navBtnStyle}>
                ← Prev
              </button>
              <span style={{ fontSize: "0.9rem" }}>
                Page {pageNumber} of {numPages}
              </span>
              <button onClick={goToNextPage} disabled={pageNumber >= numPages} style={navBtnStyle}>
                Next →
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid #fff",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* PDF viewer area — custom rendered, no native browser toolbar exists at all */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          userSelect: "none", 
        }}
      >
        {loadError && (
          <p style={{ color: "#f87171" }}>{loadError}</p>
        )}

        <Document
          file={blobUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => {
            console.log(err);
            setLoadError("Could not load this PDF.");
          }}
          loading={<p style={{ color: "#fff" }}>Loading book...</p>}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={Math.min(800, window.innerWidth - 80)}
          />
        </Document>
      </div>
    </div>
  );
}

const navBtnStyle = {
  background: "transparent",
  border: "1px solid #94a3b8",
  color: "#fff",
  padding: "4px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.85rem",
};

export default ReadBookModal;