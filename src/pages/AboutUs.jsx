import React from "react";
import "../css/AboutUs.css";

// Import images from src/images folder
import cat from "../images/cat.png";
import nisha from "../images/Nishaa.png";

export default function AboutUs() {
  return (
    <div className="about-container">

      {/* Hero Section */}
      <div className="about-hero">
        <h1>About Us</h1>
        <p>Your Smart AI Travel Planning Platform ✈️🌍</p>
      </div>

      {/* Main Content */}
      <div className="about-card">

        {/* About Website */}
        <div className="about-section">

          <img
            src="https://cdn-icons-png.flaticon.com/512/201/201623.png"
            alt="Travel"
            className="about-image"
          />

          <div>
            <h2>Who We Are</h2>

            <p>
              Welcome to <strong>AI Travel Planner</strong>, a smart platform
              designed to make travel planning easy, fast, and personalized.
            </p>

            <p>
              We use Artificial Intelligence and modern web technologies to help
              users discover destinations, generate itineraries, and organize
              complete trips in one place.
            </p>

            <p>
              Our aim is to reduce travel stress and provide a smooth planning
              experience for everyone.
            </p>
          </div>

        </div>

        {/* What We Do */}
        <div className="about-section reverse">

          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            alt="AI"
            className="about-image"
          />

          <div>
            <h2>What We Do</h2>

            <ul>
              <li>🤖 AI-based Travel Recommendations</li>
              <li>🗺️ Smart Destination Suggestions</li>
              <li>📅 Automatic Itinerary Creation</li>
              <li>💰 Budget Planning</li>
              <li>📄 PDF Travel Plans</li>
              <li>👨‍👩‍👧‍👦 Group Travel Support</li>
              <li>📱 Mobile & Desktop Friendly</li>
            </ul>

          </div>

        </div>

        {/* Our Mission */}
        <div className="mission-section">

          <h2>Our Mission</h2>

          <p>
            Our mission is to provide a simple, reliable, and intelligent travel
            planning system for users around the world.
          </p>

          <p>
            We aim to combine technology and creativity to make trip planning
            enjoyable and stress-free.
          </p>

        </div>

        {/* Team Section */}
        <div className="team-section">

          <h2>Meet Our Team</h2>

          <div className="team-grid">

            {/* Member 1 */}
            <div className="team-card">
              <img  src="https://cdn-icons-png.flaticon.com/512/3135/3135823.png" />
              <h3>Tandel Nisha</h3>
              <p>Frontend Developer</p>
            </div>

            {/* Member 2 */}
            <div className="team-card">
              <img  src="https://cdn-icons-png.flaticon.com/512/3135/3135823.png" />
              <h3>Tandel Niharika</h3>
              <p>Backend Developer</p>
            </div>

            {/* Member 3 */}
            <div className="team-card">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Rahul Mahto"
              />
              <h3>Rahul Mahto</h3>
              <p>AI & API Integration</p>
            </div>

            {/* Member 4 */}
            <div className="team-card">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135823.png"
                alt="Tandel Dhruvi"
              />
              <h3>Tandel Dhruvi</h3>
              <p>UI/UX Designer</p>
            </div>

          </div>

        </div>

        {/* Footer Message */}
        <div className="about-footer">

          <p>
            This project is developed as an academic project to demonstrate
            modern web development, AI integration, and teamwork.
          </p>

          <p>
            Thank you for visiting our website. 💙
          </p>

        </div>

      </div>

    </div>
  );
}
