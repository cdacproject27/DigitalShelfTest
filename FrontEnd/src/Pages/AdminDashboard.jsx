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
  productAuthor: "",
  productGenere: "",
  productLang: "",
  productType: "",
  productPublisher: "",
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [justCreated, setJustCreated] = useState(false);

  const navigate = useNavigate();

  const userDataRaw = localStorage.getItem("user");
  const adminName = userDataRaw ? JSON.parse(userDataRaw).userName : "Admin";

  const loadReferenceData = async () => {
    try {
      const [authorRes, genreRes, langRes, pubRes, typeRes] = await Promise.all([
        api.get("/authors"),
        api.get("/genres"),
        api.get("/languages"),
        api.get("/publishers"),
        api.get("/product-types"),
      ]);
      setAuthors(authorRes.data);
      setGenres(genreRes.data);
      setLanguages(langRes.data);
      setPublishers(pubRes.data);
      setProductTypes(typeRes.data);
    } catch (err) {
      console.log("Could not load reference data", err);
    }
  };

  useEffect(() => {
    loadReferenceData();
  }, []);

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
    setJustCreated(false);
  };

  const handleAddNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setJustCreated(false);
    setShowForm(true);
  };

  // Fetches the full product detail (with real FK ids) before opening the edit form
  const handleEdit = async (productListItem) => {
    try {
      const res = await api.get(`/products/${productListItem.productId}`);
      const product = res.data;

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
        productAuthor: product.authorId ?? "",
        productGenere: product.genreId ?? "",
        productLang: product.languageId ?? "",
        productType: product.typeId ?? "",
        productPublisher: product.publisherId ?? "",
      });
      setEditingId(product.productId);
      setJustCreated(false);
      setShowForm(true);
    } catch (err) {
      console.log(err);
      alert("Could not load product details for editing");
    }
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

  const handleUploadPdf = async (productId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(`/products/${productId}/pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("PDF uploaded successfully!");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to upload PDF");
    }
  };

  // Quick-add a new reference entry (author, genre, language, publisher, or type)
  // without leaving the product form or going to Swagger
  const handleQuickAdd = async (type) => {
    try {
      if (type === "author") {
        const name = window.prompt("New author name:");
        if (!name) return;
        const bio = window.prompt("Short bio (optional):") || "";
        const res = await api.post("/authors", { name, bio });
        await loadReferenceData();
        handleFormChange("productAuthor", res.data.authorId);
      } else if (type === "genre") {
        const genreDesc = window.prompt("New genre name:");
        if (!genreDesc) return;
        const res = await api.post("/genres", { genreDesc });
        await loadReferenceData();
        handleFormChange("productGenere", res.data.genreId);
      } else if (type === "language") {
        const languageDesc = window.prompt("New language name:");
        if (!languageDesc) return;
        const res = await api.post("/languages", { languageDesc });
        await loadReferenceData();
        handleFormChange("productLang", res.data.languageId);
      } else if (type === "publisher") {
        const name = window.prompt("New publisher name:");
        if (!name) return;
        const email = window.prompt("Publisher contact email:") || "";
        const res = await api.post("/publishers", { name, email });
        await loadReferenceData();
        handleFormChange("productPublisher", res.data.publisherId);
      } else if (type === "type") {
        const typeDesc = window.prompt("New product type (e.g. Paperback, Hardcover, E-book):");
        if (!typeDesc) return;
        const res = await api.post("/product-types", { typeDesc });
        await loadReferenceData();
        handleFormChange("productType", res.data.typeId);
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to add new entry");
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
      productAuthor: form.productAuthor ? parseInt(form.productAuthor) : null,
      productGenere: form.productGenere ? parseInt(form.productGenere) : null,
      productLang: form.productLang ? parseInt(form.productLang) : null,
      productType: form.productType ? parseInt(form.productType) : null,
      productPublisher: form.productPublisher ? parseInt(form.productPublisher) : null,
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        resetForm();
        fetchProducts();
      } else {
        const res = await api.post("/products", payload);
        // Keep the form open, switch into "edit mode" for the new product
        // so the admin can immediately upload its PDF without hunting for it in the table
        setEditingId(res.data.productId);
        setJustCreated(true);
        fetchProducts();
      }
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
                  {editingId && !justCreated
                    ? "Edit Product"
                    : justCreated
                      ? "Product Created — Add PDF Below"
                      : "New Product"}
                </h4>

                {justCreated && (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      background: "#dcfce7",
                      color: "#166534",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                    }}
                  >
                    Product created! You can now upload its PDF below, or click Done.
                  </div>
                )}

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

                {/* --- Reference data dropdowns, each with a quick "+ Add New" button --- */}

                <div style={{ display: "flex", gap: "6px" }}>
                  <select
                    value={form.productAuthor}
                    onChange={(e) => handleFormChange("productAuthor", e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  >
                    <option value="">-- Select Author --</option>
                    {authors.map((a) => (
                      <option key={a.authorId} value={a.authorId}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => handleQuickAdd("author")} style={quickAddBtnStyle}>
                    + New
                  </button>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <select
                    value={form.productGenere}
                    onChange={(e) => handleFormChange("productGenere", e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  >
                    <option value="">-- Select Genre --</option>
                    {genres.map((g) => (
                      <option key={g.genreId} value={g.genreId}>
                        {g.genreDesc}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => handleQuickAdd("genre")} style={quickAddBtnStyle}>
                    + New
                  </button>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <select
                    value={form.productLang}
                    onChange={(e) => handleFormChange("productLang", e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  >
                    <option value="">-- Select Language --</option>
                    {languages.map((l) => (
                      <option key={l.languageId} value={l.languageId}>
                        {l.languageDesc}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => handleQuickAdd("language")} style={quickAddBtnStyle}>
                    + New
                  </button>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <select
                    value={form.productPublisher}
                    onChange={(e) => handleFormChange("productPublisher", e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  >
                    <option value="">-- Select Publisher --</option>
                    {publishers.map((p) => (
                      <option key={p.publisherId} value={p.publisherId}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => handleQuickAdd("publisher")} style={quickAddBtnStyle}>
                    + New
                  </button>
                </div>

                <div style={{ display: "flex", gap: "6px", gridColumn: "1 / -1" }}>
                  <select
                    value={form.productType}
                    onChange={(e) => handleFormChange("productType", e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  >
                    <option value="">-- Select Product Type --</option>
                    {productTypes.map((t) => (
                      <option key={t.typeId} value={t.typeId}>
                        {t.typeDesc}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => handleQuickAdd("type")} style={quickAddBtnStyle}>
                    + New
                  </button>
                </div>

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

                {/* PDF upload — only shown once the product actually exists (editing or just-created) */}
                {editingId && (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      border: "1px dashed #059669",
                      borderRadius: "8px",
                      padding: "14px",
                    }}
                  >
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#059669" }}>
                      Upload Book PDF
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleUploadPdf(editingId, e.target.files[0])}
                    />
                  </div>
                )}

                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
                  {!justCreated && (
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
                  )}
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
                    {justCreated ? "Done" : "Cancel"}
                  </button>
                </div>
              </form>
            )}

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Author</th>
                  <th style={thStyle}>Genre</th>
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
                    <td style={tdStyle}>{p.authorName || "-"}</td>
                    <td style={tdStyle}>{p.genreName || "-"}</td>
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
                      <label style={uploadBtnStyle}>
                        Upload PDF
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleUploadPdf(p.productId, e.target.files[0])}
                          style={{ display: "none" }}
                        />
                      </label>
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

const uploadBtnStyle = {
  display: "inline-block",
  padding: "6px 12px",
  marginLeft: "8px",
  borderRadius: "6px",
  border: "1px solid #059669",
  color: "#059669",
  cursor: "pointer",
  fontSize: "0.85rem",
};

const quickAddBtnStyle = {
  padding: "0 12px",
  borderRadius: "6px",
  border: "1px solid #312e81",
  background: "transparent",
  color: "#312e81",
  cursor: "pointer",
  fontSize: "0.8rem",
  whiteSpace: "nowrap",
};

export default AdminDashboard;