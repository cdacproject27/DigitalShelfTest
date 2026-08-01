import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import FilterSidebar from "../components/FilterSidebar";

function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  const fetchProducts = async (searchTerm, activeFilters) => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (activeFilters.genreId) params.genreId = activeFilters.genreId;
      if (activeFilters.languageId) params.languageId = activeFilters.languageId;
      if (activeFilters.minPrice) params.minPrice = activeFilters.minPrice;
      if (activeFilters.maxPrice) params.maxPrice = activeFilters.maxPrice;
      if (activeFilters.isRentable) params.isRentable = true;

      const res = await api.get("/products", { params });
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      setError("Could not load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(search, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(search, filters);
  };

  const handleFilterChange = (partialFilter) => {
    setFilters((prev) => ({ ...prev, ...partialFilter }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearch("");
    fetchProducts("", {});
  };

  const handleAddToCart = async (productId) => {
    setCartMessage("");
    try {
      await api.post("/cart", { productId, qty: 1 });
      setCartMessage("Added to cart! Choose Buy or Rent at checkout.");
      setTimeout(() => setCartMessage(""), 2500);
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "Could not add to cart";
      setCartMessage(message);
    }
  };

  return (
    <div style={{ fontFamily: "Segoe UI, Arial, sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <Navbar search={search} onSearchChange={setSearch} onSearchSubmit={handleSearchSubmit} />

      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div style={{ flex: 1, padding: "24px 32px" }}>
          {cartMessage && (
            <div
              style={{
                backgroundColor: "#dcfce7",
                color: "#166534",
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "0.9rem",
              }}
            >
              {cartMessage}
            </div>
          )}

          {loading && <p>Loading books...</p>}

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

          {!loading && !error && products.length === 0 && (
            <p style={{ color: "#6b7280" }}>No books found.</p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.productId}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    height: "180px",
                    background: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {product.productImage ? (
                    <img
                      src={`https://localhost:7042${product.productImage}`}
                      alt={product.productName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: "#9ca3af" }}>No Image</span>
                  )}
                </div>

                <div style={{ padding: "14px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h4 style={{ margin: "0 0 4px", fontSize: "1rem" }}>{product.productName}</h4>

                  {product.authorName && (
                    <p style={{ margin: "0 0 4px", color: "#6b7280", fontSize: "0.85rem" }}>
                      by {product.authorName}
                    </p>
                  )}

                  {product.genreName && (
                    <span
                      style={{
                        alignSelf: "flex-start",
                        background: "#ede9fe",
                        color: "#5b21b6",
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        marginBottom: "8px",
                      }}
                    >
                      {product.genreName}
                    </span>
                  )}

                  <div style={{ marginTop: "auto" }}>
                    <div style={{ marginBottom: "10px" }}>
                      {product.productOfferprice ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#9ca3af",
                              marginRight: "8px",
                              fontSize: "0.85rem",
                            }}
                          >
                            Rs. {product.productBaseprice}
                          </span>
                          <span style={{ fontWeight: "700", color: "#111827" }}>
                            Rs. {product.productOfferprice}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontWeight: "700", color: "#111827" }}>
                          Rs. {product.productBaseprice}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleAddToCart(product.productId)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: "6px",
                          border: "none",
                          background: "linear-gradient(90deg,#fbbf24,#d97706)",
                          color: "#111827",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        Buy
                      </button>

                      {product.isRentable && (
                        <button
                          onClick={() => handleAddToCart(product.productId)}
                          style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #312e81",
                            background: "transparent",
                            color: "#312e81",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          Rent
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;