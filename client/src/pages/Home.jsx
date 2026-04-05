import React from "react";
import Slider from "../components/Slider";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate=useNavigate();
  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-pink-100 min-h-screen">

      {/* HERO SECTION */}
      <section className="pt-36 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
        
        {/* LEFT */}
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight">
            Your personal
            <span className="block text-pink-500">
              health companion
            </span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            Track periods, understand your body, and feel empowered every day.
          </p>

          <p className="mt-6 text-pink-600 font-semibold text-lg italic">
            “Your period is powerful — not something to hide, but something to understand.”
          </p>

          <div className="mt-8">
            <button 
            onClick={()=>navigate("/racker")}
            className="bg-pink-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-pink-600 text-lg">
              Start Tracking 
            </button>
          </div>
        </div>

        {/* RIGHT SIDE (SLIDER + FLOAT CARDS) */}
        <div className="relative mt-12 md:mt-0">

          {/* SLIDER replaces image */}
          <Slider />

          {/* FLOAT CARD 1 */}
          <div className="absolute -left-10 top-10 bg-white p-4 rounded-2xl shadow-lg z-10">
            <p className="text-sm text-gray-500">Period in</p>
            <p className="font-bold text-pink-500">5 days</p>
          </div>

          {/* FLOAT CARD 2 */}
          <div className="absolute -right-10 bottom-10 bg-white p-4 rounded-2xl shadow-lg z-10">
            <p className="text-sm text-gray-500">Cycle Health</p>
            <p className="font-bold text-green-500">Normal</p>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="mt-24 text-center px-6 pb-20">
        <h2 className="text-3xl font-bold text-gray-800">
          What can you do with HealthHer?
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
            <h3 className="font-semibold text-lg">Track Cycle</h3>
            <p className="text-gray-500 text-sm mt-2">
              Know your patterns
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
            <h3 className="font-semibold text-lg">Fertility Insights</h3>
            <p className="text-gray-500 text-sm mt-2">
              Understand your body
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
            <h3 className="font-semibold text-lg">Health Tips</h3>
            <p className="text-gray-500 text-sm mt-2">
              Daily suggestions
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}