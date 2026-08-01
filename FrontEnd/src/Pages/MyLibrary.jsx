import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import ReadBookModal from "../components/ReadBookModal";

function MyLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readingId, setReadingId] = useState(null);

  const [modalBlobUrl, setModalBlobUrl] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const fetchLibrary = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/my-shelf");
     const rentedOnly = res.data.filter((item) => !!item.productExpiryDate && !item.isExpired);
      setItems(rentedOnly);
    } catch (err) {
      console.log(err);
      setError("Could not load your library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
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
      // Everything on this page is rented, so always open in the view-only in-app modal
      setModalTitle(item.productName);
      setModalBlobUrl(blobUrl);
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

  const formatExpiry = (dateStr) => {
    const date = new Date(dateStr);
    return `Rented until ${date.toLocaleDateString()}`;
  };

  return (
    <div style={{ fontFamily: "Segoe UI, Arial, sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 20px" }}>
        <h2 style={{ marginBottom: "20px" }}>My Library</h2>
        <p style={{ color: "#6b7280", marginTop: "-14px", marginBottom: "20px" }}>
          Books you're currently renting.
        </p>

        {loading && <p>Loading your library...</p>}

        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: "8px" }}>
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <p style={{ color: "#6b7280" }}>
            You don't have any active rentals. Browse the catalog and rent a book to see it here.
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
                opacity: item.isExpired ? 0.6 : 1,
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

                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: "0.8rem",
                    color: item.isExpired ? "#dc2626" : "#6b7280",
                  }}
                >
                  {item.isExpired ? "Rental expired" : formatExpiry(item.productExpiryDate)}
                </p>

                <button
                  onClick={() => handleRead(item)}
                  disabled={item.isExpired || !item.hasPdfAvailable || readingId === item.productId}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    background:
                      item.isExpired || !item.hasPdfAvailable
                        ? "#d1d5db"
                        : "linear-gradient(90deg,#fbbf24,#d97706)",
                    color: "#111827",
                    fontWeight: "700",
                    cursor: item.isExpired || !item.hasPdfAvailable ? "not-allowed" : "pointer",
                  }}
                >
                  {readingId === item.productId
                    ? "Opening..."
                    : !item.hasPdfAvailable
                    ? "Not Available"
                    : item.isExpired
                    ? "Expired"
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

export default MyLibrary;