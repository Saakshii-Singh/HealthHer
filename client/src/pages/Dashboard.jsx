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
    <motion.div
      className="flex justify-center mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
  );
}

export default Dashboard;