import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!password) {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const res = await axios.post(
        "https://localhost:7042/api/users/login",
        {
          userEmail: email,
          password: password,
        }
      );

      const userData = res.data;

      localStorage.setItem("token", userData.token);
      dispatch(login(userData));

      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Invalid email or password";
      setError(message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #312e81)",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "rgba(255,255,255,0.97)",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          padding: "36px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1
            style={{
              margin: 0,
              color: "#312e81",
              fontSize: "1.8rem",
              fontWeight: "700",
            }}
          >
            DigitalShelf
          </h1>
          <p style={{ color: "#6b7280", marginTop: "6px" }}>
            Sign in to your account
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              padding: "10px 12px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                color: "#111827",
                fontSize: "0.9rem",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                color: "#111827",
                fontSize: "0.9rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(90deg, #fbbf24, #d97706)",
              color: "#111827",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#6b7280",
            fontSize: "0.85rem",
          }}
        >
          Premium Digital Library Platform
        </p>
      </div>
    </div>
  );
}

export default Login;