import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!user) navigate("/login");
  }, []);

  return (
    <div className="min-h-screen pt-32 px-6 bg-pink-50">
    <motion.div
      className="flex justify-center mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-xl w-96 text-center">
        
        <h2 className="text-2xl font-bold text-pink-500">
          Welcome {user?.name} 💖
        </h2>

        <p className="mt-2 text-gray-600">{user?.email}</p>

        <button
          onClick={() => navigate("/tips")}
          className="mt-4 bg-pink-500 text-white px-4 py-2 rounded"
        >
          Health Tips 🌸
        </button>
        <button
          onClick={() => navigate("/tracker")}
            className="mt-4 bg-pink-500 text-white px-4 py-2 rounded"
          >
              Track Period 📅
        </button>

      </div>
    </motion.div>

    {/*Health summary*/}
    <div className="max-w-5xl mx-auto mt-10 grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow text-center hover:scale-105 transition">
        <p className="text-gray-500">Next Period</p>
          <h2 className="text-xl font-bold text-pink-500 mt-2">28 days</h2>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow text-center hover:scale-105 transition">
        <p className="text-gray-500">Ovulation</p>
          <h2 className="text-xl font-bold text-pink-500 mt-2"> In 12 days</h2>
      </div>
    </div>

    {/*AI Insights */}
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        AI Insights 
      </h2>
      <ul>
        <li>Your cycle is regular, lasting around 28 days.</li>
        <li>Stay Hydrated, your period is near!</li>
        <li>Consider taking a prenatal vitamin to support your health.</li>
      </ul>
    </div>
    </div>
  );
}

export default Dashboard;