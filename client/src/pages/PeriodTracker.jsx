import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function PeriodTracker() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("userInfo")
  );

  // IF USER NOT LOGGED IN
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-lg text-center"
        >

          <h1 className="text-3xl font-bold text-pink-500">
            Please Login First 💖
          </h1>

          <p className="mt-3 text-gray-500">
            You need to login to access the tracker.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="mt-5 bg-pink-500 text-white px-6 py-2 rounded-xl"
          >
            Go to Login
          </motion.button>

        </motion.div>
      </div>
    );
  }

  const [form, setForm] = useState({
    lastPeriodDate: "",
    cycleLength: "",
    duration: "",
  });

  const [result, setResult] = useState(null);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const { data } = await axios.post(
        "http://localhost:5000/api/period",
        {
          userId: user._id,
          ...form,
        }
      );

      setResult(data);

    } catch (err) {

      console.log(err);

      alert("Error saving data");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-pink-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >

      <motion.div
        className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        {/* HEADING */}
        <h2 className="text-4xl font-bold text-center text-pink-500 mb-2">
          Period Tracker 🌸
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Track your cycle and health insights
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* LAST PERIOD DATE */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Last Period Date
            </label>

            <input
              type="date"
              name="lastPeriodDate"
              value={form.lastPeriodDate}
              onChange={handleChange}
              className="w-full p-3 border border-pink-200 rounded-xl outline-none focus:border-pink-500"
              required
            />
          </div>

          {/* CYCLE LENGTH */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Cycle Length
            </label>

            <input
              type="number"
              name="cycleLength"
              placeholder="e.g. 28"
              value={form.cycleLength}
              onChange={handleChange}
              className="w-full p-3 border border-pink-200 rounded-xl outline-none focus:border-pink-500"
              required
            />
          </div>

          {/* DURATION */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Duration
            </label>

            <input
              type="number"
              name="duration"
              placeholder="e.g. 5"
              value={form.duration}
              onChange={handleChange}
              className="w-full p-3 border border-pink-200 rounded-xl outline-none focus:border-pink-500"
              required
            />
          </div>

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold shadow-md"
          >
            Track Period 💖
          </motion.button>

        </form>

        {/* RESULT */}
        {result && (

          <motion.div
            className="mt-8 bg-pink-50 p-6 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

            <h3 className="text-2xl font-bold text-pink-500 mb-4">
              Your Insights ✨
            </h3>

            <div className="space-y-3 text-gray-700">

              <p>
                <strong>Next Period:</strong>{" "}
                {new Date(
                  result.nextPeriod
                ).toDateString()}
              </p>

              <p>
                <strong>Ovulation:</strong>{" "}
                {new Date(
                  result.ovulation
                ).toDateString()}
              </p>

              <p>
                <strong>Phase:</strong>{" "}
                {result.phase}
              </p>

              <p className="text-pink-600 font-medium">
                {result.insights}
              </p>

            </div>

          </motion.div>
        )}

      </motion.div>
    </motion.div>
  );
}

export default PeriodTracker;