import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import Navbar from "../components/Navbar";

function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/transactions/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.log(err);
        setError("Could not load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <div style={{ fontFamily: "Segoe UI, Arial, sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
        {loading && <p>Loading order...</p>}

        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: "8px" }}>
            {error}
          </div>
        )}

        {order && (
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "32px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>✅</div>
            <h2 style={{ margin: "0 0 6px" }}>Order Confirmed!</h2>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              Order #{order.transactionId} — {order.transactionType === "RENT" ? "Rental" : "Purchase"}
            </p>

            <div style={{ textAlign: "left", borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
              {order.items.map((item) => (
                <div
                  key={item.itemId}
                  style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "0.95rem" }}
                >
                  <span>{item.productName} x{item.quantity}</span>
                  <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "2px solid #e5e7eb",
                marginTop: "16px",
                paddingTop: "16px",
                fontWeight: "700",
                fontSize: "1.1rem",
              }}
            >
              <span>Total</span>
              <span>Rs. {order.totalAmount?.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
              <button
                onClick={() => navigate("/user")}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Continue Browsing
              </button>
              <button
                onClick={() => navigate("/orders")}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(90deg,#fbbf24,#d97706)",
                  color: "#111827",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                View My Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderConfirmation;