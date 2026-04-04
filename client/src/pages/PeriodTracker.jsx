import { useState, useEffect } from "react";
import axios from "axios";

function PeriodTracker() {
  const [lastDate, setLastDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  console.log("User:", user);

  // 🔥 FETCH HISTORY
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/period/${user._id}`
        );
        console.log("History:", data);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchData();
  }, [user]);

  // 🔥 CALCULATE + SAVE
  const calculatePeriod = async () => {
    if (!lastDate) {
      alert("Please select a date");
      return;
    }

    const last = new Date(lastDate);

    const next = new Date(last);
    next.setDate(next.getDate() + Number(cycleLength));

    const fertileStart = new Date(last);
    fertileStart.setDate(fertileStart.getDate() + 12);

    const fertileEnd = new Date(last);
    fertileEnd.setDate(fertileEnd.getDate() + 16);

    // ✅ SHOW RESULT
    setResults({
      nextPeriod: next.toDateString(),
      fertileWindow: `${fertileStart.toDateString()} - ${fertileEnd.toDateString()}`
    });

    try {
      // ✅ SAVE TO BACKEND
      const res = await axios.post(
        "http://localhost:5000/api/period",
        {
          userId: user._id,
          lastDate,
          cycleLength,
        }
      );

      console.log("Saved:", res.data);

      // ✅ REFRESH HISTORY
      const { data } = await axios.get(
        `http://localhost:5000/api/period/${user._id}`
      );
      setHistory(data);

    } catch (error) {
      console.error("Error saving period:", error);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-pink-50 p-6 rounded-xl shadow-xl w-96 text-center">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-pink-500 mb-4">
          Period Tracker 💖
        </h2>

        {/* DATE INPUT */}
        <input
          type="date"
          className="border border-pink-300 p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={lastDate}
          onChange={(e) => setLastDate(e.target.value)}
        />

        {/* CYCLE LENGTH */}
        <input
          type="number"
          className="border border-pink-300 p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={cycleLength}
          onChange={(e) => setCycleLength(e.target.value)}
        />

        {/* BUTTON */}
        <button
          className="bg-pink-500 hover:bg-pink-600 transition text-white px-4 py-2 rounded w-full"
          onClick={calculatePeriod}
        >
          Predict 💖
        </button>

        {/* RESULT */}
        {results && (
          <div className="mt-4 text-left bg-white p-3 rounded shadow">
            <p>
              <strong>📅 Next Period:</strong> {results.nextPeriod}
            </p>
            <p>
              <strong>🌸 Fertile Window:</strong> {results.fertileWindow}
            </p>
          </div>
        )}

        {/* HISTORY */}
        <div className="mt-5 text-left">
          <h3 className="font-bold text-pink-500 mb-2">
            Period History 📅
          </h3>

          {history.length === 0 ? (
            <p className="text-gray-500">No history yet</p>
          ) : (
            history.map((item, i) => (
              <div
                key={i}
                className="bg-pink-100 p-2 mb-2 rounded"
              >
                <p>
                  📅 {new Date(item.lastDate).toDateString()}
                </p>
                <p>Cycle: {item.cycleLength} days</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default PeriodTracker;