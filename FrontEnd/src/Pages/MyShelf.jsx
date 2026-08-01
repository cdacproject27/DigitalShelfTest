import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import ReadBookModal from "../components/ReadBookModal";

function MyShelf() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readingId, setReadingId] = useState(null);

  const [modalBlobUrl, setModalBlobUrl] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const fetchShelf = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/my-shelf");
      // My Shelf only shows permanently owned books (no expiry date = bought outright)
      const ownedOnly = res.data.filter((item) => !item.productExpiryDate);
      setItems(ownedOnly);
    } catch (err) {
      console.log(err);
      setError("Could not load your shelf.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelf();
  }, []);

  const fetchPdfBlobUrl = async (productId) => {
    const res = await api.get(`/my-shelf/${productId}/read`, {
      responseType: "blob",
    });
    return URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  };

  const handleRead = async (item) => {
    setReadingId(item.productId);

    try {
      const blobUrl = await fetchPdfBlobUrl(item.productId);
      // Everything on this page is owned outright, so always open normally
      window.open(blobUrl, "_blank");
    } catch (err) {
      console.log(err);

      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const parsed = JSON.parse(text);
          alert(parsed.message || "Could not open this book.");
        } catch {
          alert("Could not open this book.");
        }
      } else {
        alert("Could not open this book.");
      }
    } finally {
      setReadingId(null);
    }
  };

  const handleCloseModal = () => {
    if (modalBlobUrl) {
      URL.revokeObjectURL(modalBlobUrl);
    }
    setModalBlobUrl(null);
    setModalTitle("");
  };

  return (
    <div style={{ fontFamily: "Segoe UI, Arial, sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 20px" }}>
        <h2 style={{ marginBottom: "20px" }}>My Shelf</h2>
        <p style={{ color: "#6b7280", marginTop: "-14px", marginBottom: "20px" }}>
          Books you own permanently.
        </p>

        {loading && <p>Loading your shelf...</p>}

        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: "8px" }}>
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <p style={{ color: "#6b7280" }}>
            You don't own any books yet. Browse the catalog and buy something to get started.
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.shelfId}
              style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "160px",
                  background: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {item.productImage ? (
                  <img
                    src={`https://localhost:7042${item.productImage}`}
                    alt={item.productName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ color: "#9ca3af" }}>No Image</span>
                )}
              </div>

              <div style={{ padding: "14px" }}>
                <h4 style={{ margin: "0 0 6px", fontSize: "1rem" }}>{item.productName}</h4>

                <p style={{ margin: "0 0 10px", fontSize: "0.8rem", color: "#6b7280" }}>
                  Owned permanently
                </p>

                <button
                  onClick={() => handleRead(item)}
                  disabled={!item.hasPdfAvailable || readingId === item.productId}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    background: !item.hasPdfAvailable ? "#d1d5db" : "linear-gradient(90deg,#fbbf24,#d97706)",
                    color: "#111827",
                    fontWeight: "700",
                    cursor: !item.hasPdfAvailable ? "not-allowed" : "pointer",
                  }}
                >
                  {readingId === item.productId
                    ? "Opening..."
                    : !item.hasPdfAvailable
                    ? "Not Available"
                    : "Read Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalBlobUrl && (
        <ReadBookModal blobUrl={modalBlobUrl} title={modalTitle} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default MyShelf;