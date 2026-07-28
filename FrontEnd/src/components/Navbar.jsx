import { useNavigate } from "react-router-dom";

function Navbar({ search, onSearchChange, onSearchSubmit }) {
  const navigate = useNavigate();

  const userDataRaw = localStorage.getItem("user");
  const userName = userDataRaw ? JSON.parse(userDataRaw).userName : "Reader";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 32px",
        background: "#0f172a",
        color: "#f8fafc",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <h2 style={{ margin: 0, color: "#fbbf24", cursor: "pointer" }} onClick={() => navigate("/user")}>
        DigitalShelf
      </h2>

      {onSearchSubmit && (
        <form
          onSubmit={onSearchSubmit}
          style={{ display: "flex", gap: "8px", flex: 1, maxWidth: "420px", margin: "0 24px" }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search books by title..."
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.9rem",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#fbbf24",
              color: "#111827",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "0.9rem" }}>Hi, {userName}</span>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid #f8fafc",
            color: "#f8fafc",
            padding: "6px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;