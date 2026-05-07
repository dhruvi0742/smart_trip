import React from "react";
import { useNavigate } from "react-router-dom";

import {
  MessageSquare,
  Play,
  Heart,
  MapPin,
  MoreVertical,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  // ✅ Check login before navigating
  const handleStartChatting = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#FACC15] text-black font-sans overflow-x-hidden selection:bg-black selection:text-white">

      {/* Hero Section */}
      <main className="min-h-screen flex flex-col lg:flex-row items-center pt-32 lg:pt-0 max-w-[1440px] mx-auto px-8 gap-12 overflow-hidden">
        
        {/* LEFT TEXT */}
        <div className="w-full lg:w-1/2 flex flex-col items-start z-10">
          <h1 className="text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-[0.95] tracking-tighter mb-8">
            Travel <br /> differently.
          </h1>

          <p className="text-lg md:text-xl opacity-90 leading-relaxed mb-12 max-w-md">
            SmartTrip brings the world to you and empowers you to experience it 
            <span className="font-bold underline decoration-4 decoration-black/20 ml-1">
              your
            </span>{" "}
            way.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* ✅ START CHATTING */}
            <button
              onClick={handleStartChatting}
              className="bg-black text-white py-5 px-10 rounded-full font-bold text-xl flex items-center gap-3 hover:shadow-2xl transition active:scale-95"
            >
              Start chatting
              <MessageSquare className="w-6 h-6" />
            </button>

            <button className="flex items-center gap-4 font-bold text-lg hover:opacity-70">
              <span className="bg-black text-white p-3 rounded-full">
                <Play className="w-5 h-5 fill-current" />
              </span>
              Play video
            </button>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="w-full lg:w-1/2 relative h-[600px] lg:h-screen flex items-center justify-center">
          <div className="relative w-full h-full max-w-[600px]">

            {/* Big Ben */}
            <div className="absolute right-4 top-20 w-48 z-0">
              <img 
                className="rounded-t-full grayscale brightness-75 contrast-125 shadow-2xl border-4 border-white/20"
                src="https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=400"
                alt="Big Ben"
              />
            </div>

            {/* Eiffel Tower */}
            <div className="absolute left-1/2 -translate-x-1/2 top-32 w-72 h-96 bg-blue-600 rounded-t-full border-[12px] border-yellow-400 overflow-hidden z-10 shadow-2xl rotate-3">
              <img 
                className="w-full h-full object-cover opacity-90 scale-110"
                src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600"
                alt="Eiffel Tower"
              />
            </div>

            {/* Colosseum */}
            <div className="absolute bottom-12 left-0 w-56 z-20">
              <div className="relative">
                <img 
                  className="rounded-3xl grayscale brightness-90 shadow-2xl -rotate-6"
                  src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400"
                  alt="Colosseum"
                />
                <div className="absolute -top-6 -right-4 bg-rose-500 p-3 rounded-2xl text-white shadow-xl rotate-12">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute top-1/4 -left-12 bg-white/95 p-4 rounded-[2rem] flex items-center gap-4 shadow-xl border border-white/20 w-64 -rotate-2">
              <div className="w-12 h-12 rounded-full bg-slate-300 ring-2 ring-yellow-400 overflow-hidden">
                <img src="https://i.pravatar.cc/100?u=1" alt="user" />
              </div>
              <div className="flex-1">
                <div className="h-2.5 w-24 bg-gray-200 rounded-full mb-2"></div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                </div>
              </div>
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </div>

            <div className="absolute bottom-1/3 -right-8 bg-white/95 p-4 rounded-[2rem] flex items-center gap-4 shadow-xl border border-white/20 w-60 rotate-2">
              <div className="w-12 h-12 rounded-full bg-slate-300 ring-2 ring-yellow-400 overflow-hidden">
                <img src="https://i.pravatar.cc/100?u=2" alt="user" />
              </div>
              <div className="flex-1">
                <div className="h-2.5 w-20 bg-gray-200 rounded-full mb-2"></div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
                </div>
              </div>
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
