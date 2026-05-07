import React, { useState } from "react";
import axios from "axios";
import "../css/Contact.css";

export default function Contact() {

  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    message: ""
  });

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      message: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login first");
      return;
    }

    try {

      setLoading(true);

      await axios.post("http://localhost:5000/api/contact", {
        userId,
        message: form.message
      });

      setSuccess("✅ Message sent successfully! Admin will reply soon.");

      setForm({ message: "" });

    } catch (err) {

      alert("❌ Failed to send message. Try again.");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="contact-container">

      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you 💬</p>
      </div>

      <div className="contact-card">

        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>
            Have any questions or suggestions?
            Feel free to contact our team anytime.
          </p>
          <p>📧 Email: smarttrip@gmail.com</p>
          <p>📞 Phone: +91 98765 43210</p>
          <p>📍 Location: India</p>
        </div>

        <div className="contact-form">
          <h2>Send Message</h2>

          {success && (
            <p style={{ color: "green", marginBottom: "10px" }}>
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}