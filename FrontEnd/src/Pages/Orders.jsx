import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import Navbar from "../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/transactions");
        setOrders(res.data);
      } catch (err) {
        console.log(err);
        setError("Could not load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ fontFamily: "Segoe UI, Arial, sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "32px 20px" }}>
        <h2 style={{ marginBottom: "20px" }}>My Orders</h2>

        {loading && <p>Loading...</p>}

        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: "8px" }}>
            {error}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <p style={{ color: "#6b7280" }}>You haven't placed any orders yet.</p>
        )}

        {orders.map((order) => (
          <div
            key={order.transactionId}
            onClick={() => navigate(`/order-confirmation/${order.transactionId}`)}
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: "700" }}>
                Order #{order.transactionId} — {order.transactionType === "RENT" ? "Rental" : "Purchase"}
              </p>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""} · {order.status}
              </p>
            </div>
            <p style={{ margin: 0, fontWeight: "700" }}>Rs. {order.totalAmount?.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;