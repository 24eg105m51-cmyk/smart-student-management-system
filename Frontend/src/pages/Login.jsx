import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username: username.trim(),
        password: password,
      });

      console.log("Login response:", response.data);

      const token = response.data.token;
      const user = response.data.user;

      if (!token) {
        setError("Login successful, but token was not received.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Token saved:", !!localStorage.getItem("token"));

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "FACULTY") {
        navigate("/faculty");
      } else if (user.role === "STUDENT") {
        navigate("/student");
      } else {
        setError("Unknown user role.");
      }

    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Invalid username or password."
        );
      } else {
        setError(
          "Cannot connect to the backend. Make sure Spring Boot is running on port 8080."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Smart Student Management System</h1>

      <form onSubmit={handleLogin}>

        <div>
          <label>Username</label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}

export default Login;