import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    const nameRegex = /^[A-Za-z\s]+$/; // only letters and spaces

    if (!formData.name) {
      newErrors.push("Name is required");
    } else if (!nameRegex.test(formData.name)) {
      newErrors.push("Name must contain only letters");
    }

    if (!formData.email) newErrors.push("Email is required");

    if (!formData.password) newErrors.push("Password is required");

    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match");
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      try {
        await axios.post("http://localhost:5000/api/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        alert("Registered Successfully!");
        navigate("/login");

      } catch (err) {
        setErrors([err.response?.data?.msg || "Registration failed"]);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="glass-card">
        <h2>Create Account</h2>

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
              type="text"
              name="name"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label>Name</label>
          </div>

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

          <div className="floating-input">
            <input
              type="password"
              name="confirmPassword"
              placeholder=" "
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label>Confirm Password</label>
          </div>

          <button type="submit" className="btn-gradient ripple">
            Register
          </button>
        </form>

        <p className="login-text">
          Already have an account?
          <a href="/login"> Login</a>
        </p>
      </div>
    </div>
  );
}