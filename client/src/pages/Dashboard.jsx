import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/period/${user._id}`
      );
      setData(res.data);
    };
    fetchData();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-pink-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >

      {/*  Header */}
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Welcome {user?.name} 
      </motion.h1>

      {/*  Insight Card */}
      {data && (
        <motion.div
          className="bg-white p-5 rounded-2xl shadow mb-6 border-l-4 border-pink-300"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-lg font-semibold mb-2">Cycle Insight</h2>
          <p className="text-sm text-gray-600">
            Next Period: {new Date(data.nextPeriod).toDateString()}
          </p>
          <p>Phase: {data.phase}</p>
          <p className="mt-2 text-pink-500">{data.insight}</p>
        </motion.div>
      )}

      {/* Trackers */}
      <h2 className="text-xl font-semibold mb-3">Trackers</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        
        {/* Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/period-tracker")}
          className="bg-pink-100 p-4 rounded-2xl cursor-pointer shadow-sm"
        >
          <h3 className="font-semibold">Period Tracker</h3>
          <p className="text-sm text-gray-600">Track your cycle</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-purple-100 p-4 rounded-2xl shadow-sm"
        >
          <h3 className="font-semibold">Ovulation</h3>
          <p className="text-sm text-gray-600">Know fertile days</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-green-100 p-4 rounded-2xl shadow-sm"
        >
          <h3 className="font-semibold">Health</h3>
          <p className="text-sm text-gray-600">Track habits</p>
        </motion.div>

      </div>

      {/*  AI Assistant */}
      <motion.div
        className="bg-gradient-to-r from-pink-200 to-purple-200 p-5 rounded-2xl mb-6"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <h2 className="font-semibold text-lg">AI Assistant 🤖</h2>
        <p className="text-sm mb-3">Ask anything about your health</p>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-white px-4 py-2 rounded-lg"
        >
          Ask Now
        </motion.button>
      </motion.div>

      {/*  Chat */}
      <motion.div
        className="bg-white p-5 rounded-2xl shadow mb-6"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <h2 className="font-semibold text-lg">Anonymous Chat 💬</h2>
        <p className="text-sm text-gray-600 mb-3">
          Talk freely without revealing identity
        </p>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-pink-400 text-white px-4 py-2 rounded-lg"
        >
          Join Chat
        </motion.button>
      </motion.div>

      {/* 🩺 Symptoms */}
      <h2 className="text-xl font-semibold mb-3">Common Symptoms</h2>

      <div className="grid grid-cols-2 gap-4">
        {["Cramps", "Mood Swings"].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white p-4 rounded-xl shadow"
          >
            <h3>{item}</h3>
            <p className="text-sm text-gray-500">
              Tap to learn more
            </p>
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}

export default Dashboard;