import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username: username.trim(),
        password,
      });
      const { token, user } = response.data || {};

      if (!token || !user) {
        setError("The server did not return a valid login session.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "FACULTY") navigate("/faculty-dashboard");
      else if (user.role === "STUDENT") navigate("/student");
      else setError("Your account has an unrecognized role. Contact your administrator.");
    } catch (err) {
      setError(
        err.response?.data && typeof err.response.data === "string"
          ? err.response.data
          : err.response
            ? "Invalid username or password. Please try again."
            : "Cannot connect to the backend. Check that Spring Boot is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand"><span className="login-brand-mark">S</span>Smart SMS</div>
        <div className="login-brand-copy">
          <span className="eyebrow">Student Management Platform</span>
          <h2>One place for better campus management.</h2>
          <p>Student records, courses, attendance, and academic performance in one organized workspace.</p>
        </div>
        <div className="login-brand-foot">Smart Student Management System · Academic Portal</div>
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <h1>Welcome back</h1>
          <p className="login-intro">Sign in with your registered account to continue.</p>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-field">
              <label htmlFor="username">Username</label>
              <input id="username" type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter your username" required />
            </div>
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
            </div>
            {error && <div className="login-error" role="alert">{error}</div>}
            <button className="login-submit" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
          </form>
          <p className="login-security-note">Your account access is managed by your institution.</p>
        </div>
      </section>
    </div>
  );
}

export default Login;
