import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [transactionType, setTransactionType] = useState("BUY");
  const [rentDays, setRentDays] = useState(7);
  const [checkingOut, setCheckingOut] = useState(false);

  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/cart");
      setItems(res.data);
    } catch (err) {
      console.log(err);
      setError("Could not load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQtyChange = async (cartId, newQty) => {
    if (newQty < 1) return;

    try {
      await api.put(`/cart/${cartId}`, { qty: newQty });
      fetchCart();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Could not update quantity");
    }
  };

  const handleRemove = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      fetchCart();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Could not remove item");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Clear your entire cart?")) return;

    try {
      await api.delete("/cart");
      fetchCart();
    } catch (err) {
      console.log(err);
      alert("Could not clear cart");
    }
  };

  const handleCheckout = async () => {
    setError("");
    setCheckingOut(true);

    const payload = { transactionType };
    if (transactionType === "RENT") {
      payload.rentDays = parseInt(rentDays) || 7;
    }

    try {
      const res = await api.post("/transactions/checkout", payload);
      navigate(`/order-confirmation/${res.data.transactionId}`);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Checkout failed. Please try again.");
      setCheckingOut(false);
    }
  };

  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const hasNonRentable = items.some((item) => !item.isRentable);

  return (
    <div style={{ fontFamily: "Segoe UI, Arial, sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0 }}>Your Cart</h2>
          <button
            onClick={() => navigate("/user")}
            style={{
              border: "1px solid #d1d5db",
              background: "#fff",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Continue Browsing
          </button>
        </div>

        {loading && <p>Loading cart...</p>}

        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: "8px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
            <p>Your cart is empty.</p>
            <button
              onClick={() => navigate("/user")}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(90deg,#fbbf24,#d97706)",
                color: "#111827",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Browse Books
            </button>
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            {items.map((item) => (
              <div
                key={item.cartId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  background: "#fff",
                  borderRadius: "10px",
                  padding: "14px",
                  marginBottom: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "90px",
                    background: "#e5e7eb",
                    borderRadius: "6px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {item.productImage ? (
                    <img
                      src={`http://localhost:5173/${item.productImage}`}
                      alt={item.productName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : null}
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 4px" }}>{item.productName}</h4>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
                    Rs. {item.productOfferprice || item.productBaseprice} each
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button onClick={() => handleQtyChange(item.cartId, item.qty - 1)} style={qtyBtnStyle}>
                    -
                  </button>
                  <span style={{ minWidth: "20px", textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => handleQtyChange(item.cartId, item.qty + 1)} style={qtyBtnStyle}>
                    +
                  </button>
                </div>

                <div style={{ minWidth: "90px", textAlign: "right", fontWeight: "700" }}>
                  Rs. {item.lineTotal.toFixed(2)}
                </div>

                <button
                  onClick={() => handleRemove(item.cartId)}
                  style={{
                    border: "1px solid #dc2626",
                    color: "#dc2626",
                    background: "transparent",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Checkout options */}
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                marginTop: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <h4 style={{ marginTop: 0 }}>Checkout Options</h4>

              <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="transactionType"
                    checked={transactionType === "BUY"}
                    onChange={() => setTransactionType("BUY")}
                  />
                  Buy
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: hasNonRentable ? "not-allowed" : "pointer",
                    color: hasNonRentable ? "#9ca3af" : "inherit",
                  }}
                >
                  <input
                    type="radio"
                    name="transactionType"
                    checked={transactionType === "RENT"}
                    disabled={hasNonRentable}
                    onChange={() => setTransactionType("RENT")}
                  />
                  Rent
                </label>
              </div>

              {hasNonRentable && transactionType !== "RENT" && (
                <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "-8px" }}>
                  Note: one or more items in your cart aren't rentable, so "Rent" is disabled for this cart.
                </p>
              )}

              {transactionType === "RENT" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "0.9rem" }}>
                    Rent for how many days?
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rentDays}
                    onChange={(e) => setRentDays(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db", width: "100px" }}
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={handleClearCart}
                  style={{ border: "none", background: "transparent", color: "#6b7280", cursor: "pointer", fontSize: "0.9rem" }}
                >
                  Clear Cart
                </button>

                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700" }}>
                    Total: Rs. {total.toFixed(2)}
                  </p>
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    style={{
                      marginTop: "10px",
                      padding: "12px 28px",
                      borderRadius: "8px",
                      border: "none",
                      background: checkingOut ? "#d1d5db" : "linear-gradient(90deg,#fbbf24,#d97706)",
                      color: "#111827",
                      fontWeight: "700",
                      cursor: checkingOut ? "not-allowed" : "pointer",
                    }}
                  >
                    {checkingOut ? "Processing..." : "Proceed to Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const qtyBtnStyle = {
  width: "26px",
  height: "26px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
};

export default Cart;