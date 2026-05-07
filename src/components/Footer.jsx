import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white text-black border-t border-black/10 pt-16 pb-10">

      <div className="max-w-[1440px] mx-auto px-8 grid md:grid-cols-5 gap-10 text-sm">

        {/* Logo */}
        <div>
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl mb-4">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            smarttrip.
          </Link>
          <p className="text-gray-500 leading-relaxed">
            Travel differently with AI-powered personalized journeys.
          </p>
        </div>

        {/* Creators */}
        <div>
          <h3 className="font-semibold mb-3">For Creators</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="/creator" className="hover:text-black">Become a Creator</Link></li>
            <li><Link to="/quiz" className="hover:text-black">Travel Quiz</Link></li>
            <li><Link to="/creator-hub" className="hover:text-black">Creator Hub</Link></li>
          </ul>
        </div>

        {/* Business */}
        <div>
          <h3 className="font-semibold mb-3">For Business</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="/business" className="hover:text-black">Overview</Link></li>
            <li><Link to="/destinations" className="hover:text-black">Destinations</Link></li>
            <li><Link to="/hotels" className="hover:text-black">Hotels</Link></li>
            <li><Link to="/packages" className="hover:text-black">Packages</Link></li>
            <li><Link to="/demo" className="hover:text-black">Book a Demo</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="/about" className="hover:text-black">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-black">Contact</Link></li>
          </ul>
        </div>

        {/* QR */}
        <div>
          <h3 className="font-semibold mb-3">Get SmartTrip App</h3>
          <img
            className="w-24 rounded-lg border border-black/10"
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://smarttrip.ai"
            alt="QR"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto px-8 mt-10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-700">

        <div className="flex gap-2 items-center">
          © 2026 SmartTrip, Inc.
          <span>•</span>
          <Link to="/privacy" className="hover:text-black font-medium">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-black font-medium">
            Terms of Service
          </Link>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0 text-lg text-black">
          <a href="#" className="fa-brands fa-instagram hover:opacity-60"></a>
          <a href="#" className="fa-brands fa-facebook hover:opacity-60"></a>
          <a href="#" className="fa-brands fa-x-twitter hover:opacity-60"></a>
          <a href="#" className="fa-brands fa-youtube hover:opacity-60"></a>
        </div>

      </div>
    </footer>
  );
}
