import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = [];

    if (!formData.email) newErrors.push("Email is required");
    if (!formData.password) newErrors.push("Password is required");

    setErrors(newErrors);

    if (newErrors.length === 0) {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          formData
        );

        // ✅ Save session data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data.id);

        // ✅ Redirect with history replace (important)
if (res.data.role === "admin") {
  navigate("/admin/dashboard", { replace: true });
} else {
  navigate("/dashboard", { replace: true });
}

      } catch (err) {
        setErrors([err.response?.data?.msg || "Login failed"]);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="glass-card">
        <h2>Login</h2>

        {errors.length > 0 && (
          <div className="error-box">
            <ul>
              {errors.map((err, i) => (
                <li key={i}>• {err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="floating-input">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Email</label>
          </div>

          <div className="floating-input">
            <input
              type="password"
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label>Password</label>
          </div>

          <button type="submit" className="btn-gradient ripple">
            Login
          </button>
        </form>

        <p className="login-text">
          Don&apos;t have an account?
          <a href="/register"> Register</a>
        </p>
      </div>
    </div>
  );
}