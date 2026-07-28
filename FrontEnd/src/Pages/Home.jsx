import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Segoe UI, Arial, sans-serif",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #312e81)",
        color: "#f8fafc",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
        }}
      >
        <h2 style={{ margin: 0, color: "#fbbf24", fontWeight: "700" }}>
          DigitalShelf
        </h2>

        <div>
          <Link
            to="/login"
            style={{
              color: "#f8fafc",
              textDecoration: "none",
              marginRight: "20px",
              fontWeight: "600",
            }}
          >
            Login
          </Link>

          <Link
            to="/signup"
            style={{
              backgroundColor: "#fbbf24",
              color: "#111827",
              padding: "8px 18px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Hero section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "16px",
            maxWidth: "700px",
          }}
        >
          Your Smart Digital Library & Bookshelf
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#cbd5e1",
            maxWidth: "600px",
            marginBottom: "32px",
            lineHeight: "1.7",
          }}
        >
          Discover, buy, and rent books. Organize your personal shelf,
          track your reading, and manage your digital library — all in
          one premium platform.
        </p>

        <div>
          <Link
            to="/login"
            style={{
              backgroundColor: "#fbbf24",
              color: "#111827",
              padding: "12px 28px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "700",
              marginRight: "14px",
            }}
          >
            Get Started
          </Link>

          <Link
            to="/signup"
            style={{
              border: "1px solid #f8fafc",
              color: "#f8fafc",
              padding: "12px 28px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          padding: "0 20px 60px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "24px",
            width: "260px",
          }}
        >
          <h3 style={{ color: "#fbbf24", marginTop: 0 }}>Buy or Rent</h3>
          <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
            Choose to purchase books outright or rent them for a flexible
            duration.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "24px",
            width: "260px",
          }}
        >
          <h3 style={{ color: "#fbbf24", marginTop: 0 }}>Your Shelf</h3>
          <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
            Keep track of everything you own or are currently reading in
            one organized place.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "24px",
            width: "260px",
          }}
        >
          <h3 style={{ color: "#fbbf24", marginTop: 0 }}>
            Library Packages
          </h3>
          <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
            Subscribe to a library plan and borrow multiple books within
            your allowance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;