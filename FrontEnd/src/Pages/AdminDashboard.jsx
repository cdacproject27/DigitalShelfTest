import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const emptyForm = {
  productName: "",
  productIsbn: "",
  productDescriptionShort: "",
  productDescriptionLong: "",
  productImage: "",
  productBaseprice: "",
  productOfferprice: "",
  discountPercent: "",
  rentPerDay: "",
  minRentDays: "",
  isRentable: false,
  isLibrary: false,
};  

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const navigate = useNavigate();

  const userDataRaw = localStorage.getItem("user");
  const adminName = userDataRaw ? JSON.parse(userDataRaw).userName : "Admin";

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/products", { params: { pageSize: 100 } });
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setForm({
      productName: product.productName || "",
      productIsbn: product.productIsbn || "",
      productDescriptionShort: product.productDescriptionShort || "",
      productDescriptionLong: product.productDescriptionLong || "",
      productImage: product.productImage || "",
      productBaseprice: product.productBaseprice ?? "",
      productOfferprice: product.productOfferprice ?? "",
      discountPercent: product.discountPercent ?? "",
      rentPerDay: product.rentPerDay ?? "",
      minRentDays: product.minRentDays ?? "",
      isRentable: !!product.isRentable,
      isLibrary: !!product.isLibrary,
    });
    setEditingId(product.productId);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      fetchProducts();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      productName: form.productName,
      productIsbn: form.productIsbn,
      productDescriptionShort: form.productDescriptionShort || null,
      productDescriptionLong: form.productDescriptionLong || null,
      productImage: form.productImage || null,
      productBaseprice: parseFloat(form.productBaseprice) || 0,
      productOfferprice: form.productOfferprice ? parseFloat(form.productOfferprice) : null,
      discountPercent: form.discountPercent ? parseFloat(form.discountPercent) : null,
      rentPerDay: form.rentPerDay ? parseFloat(form.rentPerDay) : null,
      minRentDays: form.minRentDays ? parseInt(form.minRentDays) : null,
      isRentable: form.isRentable,
      isLibrary: form.isLibrary,
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to save product");
    }
  };

  return (
    <div style={{ fontFamily: "Segoe UI, Arial, sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 40px",
          background: "#0f172a",
          color: "#f8fafc",
        }}
      >
        <h2 style={{ margin: 0, color: "#fbbf24" }}>DigitalShelf Admin</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span>Welcome, {adminName}</span>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid #f8fafc",
              color: "#f8fafc",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", padding: "20px 40px 0" }}>
        <button
          onClick={() => setActiveTab("products")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px 8px 0 0",
            border: "none",
            background: activeTab === "products" ? "#fff" : "#e5e7eb",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("users")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px 8px 0 0",
            border: "none",
            background: activeTab === "users" ? "#fff" : "#e5e7eb",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Users
        </button>
      </div>

      <div style={{ padding: "24px 40px 60px", background: "#fff" }}>
        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {loading && <p>Loading...</p>}

        {/* PRODUCTS TAB */}
        {!loading && activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ margin: 0 }}>Manage Products</h3>
              <button
                onClick={handleAddNew}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(90deg,#fbbf24,#d97706)",
                  color: "#111827",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                + Add Product
              </button>
            </div>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "24px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <h4 style={{ gridColumn: "1 / -1", margin: 0 }}>
                  {editingId ? "Edit Product" : "New Product"}
                </h4>

                <input
                  placeholder="Product Name"
                  value={form.productName}
                  onChange={(e) => handleFormChange("productName", e.target.value)}
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="ISBN"
                  value={form.productIsbn}
                  onChange={(e) => handleFormChange("productIsbn", e.target.value)}
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="Short Description"
                  value={form.productDescriptionShort}
                  onChange={(e) => handleFormChange("productDescriptionShort", e.target.value)}
                  style={{ ...inputStyle, gridColumn: "1 / -1" }}
                />

                <textarea
                  placeholder="Long Description"
                  value={form.productDescriptionLong}
                  onChange={(e) => handleFormChange("productDescriptionLong", e.target.value)}
                  style={{ ...inputStyle, gridColumn: "1 / -1", minHeight: "70px" }}
                />

                <input
                  placeholder="Image path (e.g. /Books-images/book.jpg)"
                  value={form.productImage}
                  onChange={(e) => handleFormChange("productImage", e.target.value)}
                  style={{ ...inputStyle, gridColumn: "1 / -1" }}
                />

                <input
                  placeholder="Base Price"
                  type="number"
                  step="0.01"
                  value={form.productBaseprice}
                  onChange={(e) => handleFormChange("productBaseprice", e.target.value)}
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="Offer Price (optional)"
                  type="number"
                  step="0.01"
                  value={form.productOfferprice}
                  onChange={(e) => handleFormChange("productOfferprice", e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Discount Percent (optional)"
                  type="number"
                  step="0.01"
                  value={form.discountPercent}
                  onChange={(e) => handleFormChange("discountPercent", e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Rent Per Day (optional)"
                  type="number"
                  step="0.01"
                  value={form.rentPerDay}
                  onChange={(e) => handleFormChange("rentPerDay", e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Min Rent Days (optional)"
                  type="number"
                  value={form.minRentDays}
                  onChange={(e) => handleFormChange("minRentDays", e.target.value)}
                  style={inputStyle}
                />

                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    checked={form.isRentable}
                    onChange={(e) => handleFormChange("isRentable", e.target.checked)}
                  />
                  Is Rentable
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    checked={form.isLibrary}
                    onChange={(e) => handleFormChange("isLibrary", e.target.checked)}
                  />
                  Is Library Item
                </label>

                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#312e81",
                      color: "#fff",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    {editingId ? "Save Changes" : "Create Product"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Base Price</th>
                  <th style={thStyle}>Offer Price</th>
                  <th style={thStyle}>Rentable</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.productId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>{p.productId}</td>
                    <td style={tdStyle}>{p.productName}</td>
                    <td style={tdStyle}>Rs. {p.productBaseprice}</td>
                    <td style={tdStyle}>{p.productOfferprice ? `Rs. ${p.productOfferprice}` : "-"}</td>
                    <td style={tdStyle}>{p.isRentable ? "Yes" : "No"}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleEdit(p)} style={editBtnStyle}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.productId)} style={deleteBtnStyle}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && <p style={{ color: "#6b7280" }}>No products yet.</p>}
          </div>
        )}

        {/* USERS TAB */}
        {!loading && activeTab === "users" && (
          <div>
            <h3 style={{ marginTop: 0 }}>All Users</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.userId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>{u.userId}</td>
                    <td style={tdStyle}>{u.userName}</td>
                    <td style={tdStyle}>{u.userEmail}</td>
                    <td style={tdStyle}>{u.userPhone || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && <p style={{ color: "#6b7280" }}>No users found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.9rem",
};

const thStyle = { padding: "10px 8px", fontSize: "0.85rem", color: "#6b7280" };
const tdStyle = { padding: "10px 8px", fontSize: "0.9rem" };

const editBtnStyle = {
  padding: "6px 12px",
  marginRight: "8px",
  borderRadius: "6px",
  border: "1px solid #312e81",
  background: "transparent",
  color: "#312e81",
  cursor: "pointer",
};

const deleteBtnStyle = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid #dc2626",
  background: "transparent",
  color: "#dc2626",
  cursor: "pointer",
};

export default AdminDashboard;