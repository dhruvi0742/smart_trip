import React, { useEffect, useState } from "react";
import { Sparkles, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ NEW: check login
  const handleGetStarted = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
      ${scrolled ? "bg-white/70 backdrop-blur-xl shadow-md" : "bg-transparent"}`}
    >
      <div className="max-w-[1440px] mx-auto px-8 py-6 flex items-center justify-between">
        
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <Sparkles className="w-8 h-8 transition-transform group-hover:rotate-12" />
          <span className="font-extrabold text-2xl tracking-tighter">
            smarttrip.
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {["Creators", "Business", "Get inspired"].map((link) => (
            <a key={link} className="font-semibold text-sm hover:opacity-60">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          
          <button
            onClick={() => navigate("/login")}
            className="hidden md:block font-semibold text-sm hover:opacity-60"
          >
            Log in
          </button>

          {/* ✅ UPDATED BUTTON */}
          <button
            onClick={handleGetStarted}
            className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform"
          >
            Get started
          </button>

          <button className="md:hidden p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
