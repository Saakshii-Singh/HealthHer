import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //  Dynamic Data
  const trackers = [
    {
      title: "Period Tracker",
      desc: "Track your cycle",
      path: "/period-tracker",
      color: "bg-pink-100",
    },
    {
      title: "Ovulation",
      desc: "Know fertile days",
      path: "/ovulation",
      color: "bg-purple-100",
    },
    {
      title: "Health",
      desc: "Track habits",
      path: "/health",
      color: "bg-green-100",
    },
  ];

  const symptoms = [
    { title: "Cramps", desc: "Pain during periods" },
    { title: "Mood Swings", desc: "Emotional changes" },
    { title: "Headache", desc: "Hormonal effect" },
    { title: "Acne", desc: "Skin changes" },
  ];

  // 🔥 Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/period/${user._id}`
        );
        setData(res.data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //  Reusable Card
  const Card = ({ title, desc, color, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} p-4 rounded-2xl cursor-pointer shadow-sm`}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen bg-pink-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/*  Header */}
      <h1 className="text-3xl font-bold mb-6">
        Welcome {user?.name || "User"} 
      </h1>

      {/*  Loading */}
      {loading && (
        <div className="text-center text-gray-500 mb-6">
          Loading your data...
        </div>
      )}

      {/*  Error */}
      {error && (
        <div className="text-center text-red-500 mb-6">
          {error}
        </div>
      )}

      {/*  No Data */}
      {!loading && !data && !error && (
        <div className="bg-white p-5 rounded-xl shadow mb-6 text-center">
          <p className="text-gray-600">
            No period data found.
          </p>
          <button
            onClick={() => navigate("/period-tracker")}
            className="mt-3 bg-pink-400 text-white px-4 py-2 rounded-lg"
          >
            Start Tracking
          </button>
        </div>
      )}

      {/*  Insight */}
      {data && (
        <motion.div
          className="bg-white p-5 rounded-2xl shadow mb-6 border-l-4 border-pink-300"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="font-semibold mb-2">Cycle Insight</h2>
          <p>
            Next Period:{" "}
            {new Date(data.nextPeriod).toDateString()}
          </p>
          <p>Phase: {data.phase}</p>
          <p className="text-pink-500 mt-1">{data.insight}</p>
        </motion.div>
      )}

      {/*  Trackers */}
      <h2 className="text-xl font-semibold mb-3">Trackers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {trackers.map((item, i) => (
          <Card
            key={i}
            {...item}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      {/*  AI Assistant */}
      <motion.div
        className="bg-gradient-to-r from-pink-200 to-purple-200 p-5 rounded-2xl mb-6"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <h2 className="font-semibold text-lg">AI Assistant </h2>
        <p className="text-sm mb-3">
          Ask anything about your health
        </p>

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
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <h2 className="font-semibold text-lg">
          Anonymous Chat 
        </h2>
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

      {/*  Symptoms */}
      <h2 className="text-xl font-semibold mb-3">
        Common Symptoms
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {symptoms.map((item, i) => (
          <Card key={i} {...item} color="bg-white" />
        ))}
      </div>
    </motion.div>
  );
}

export default Dashboard;