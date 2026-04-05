import { useState, useEffect } from "react";
import axios from "axios";

function PeriodTracker() {
  const [lastDate, setLastDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const today = new Date().getDate();

  // 🔥 FETCH HISTORY
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/period/${user._id}`
        );
        setHistory(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user]);

  // 🔥 PERIOD LOGIC
  const isPeriodDay = (day) => {
    if (!lastDate) return false;

    const last = new Date(lastDate);
    const current = new Date(
      last.getFullYear(),
      last.getMonth(),
      day
    );

    const diff = Math.floor(
      (current - last) / (1000 * 60 * 60 * 24)
    );

    return diff >= 0 && diff % cycleLength < 5;
  };

  // 🔥 FERTILE LOGIC
  const isFertileDay = (day) => {
    if (!lastDate) return false;

    const last = new Date(lastDate);
    const current = new Date(
      last.getFullYear(),
      last.getMonth(),
      day
    );

    const diff = Math.floor(
      (current - last) / (1000 * 60 * 60 * 24)
    );

    return diff >= 12 && diff <= 16;
  };

  // 🔥 CALCULATE + SAVE
  const calculatePeriod = async () => {
    if (!lastDate) {
      alert("Select a date");
      return;
    }

    const last = new Date(lastDate);

    const next = new Date(last);
    next.setDate(next.getDate() + Number(cycleLength));

    const fertileStart = new Date(last);
    fertileStart.setDate(fertileStart.getDate() + 12);

    const fertileEnd = new Date(last);
    fertileEnd.setDate(fertileEnd.getDate() + 16);

    setResults({
      nextPeriod: next.toDateString(),
      fertileWindow: `${fertileStart.toDateString()} - ${fertileEnd.toDateString()}`
    });

    try {
      await axios.post("http://localhost:5000/api/period", {
        userId: user._id,
        lastDate,
        cycleLength
      });

      // refresh history
      const { data } = await axios.get(
        `http://localhost:5000/api/period/${user._id}`
      );
      setHistory(data);

    } catch (error) {
      console.error(error);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-200 flex justify-center items-center">

    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-[380px]">

      <h2 className="text-3xl font-bold text-center text-pink-500 mb-6">
        Period Tracker 💖
      </h2>


        {/* INPUTS */}
        <input
          type="date"
          className="border p-2 mb-3 w-full rounded"
          value={lastDate}
          onChange={(e) => setLastDate(e.target.value)}
        />

        <input
          type="number"
          className="border p-2 mb-3 w-full rounded"
          value={cycleLength}
          onChange={(e) => setCycleLength(e.target.value)}
        />

        <button
          onClick={calculatePeriod}
          className="bg-pink-500 text-white px-4 py-2 rounded w-full"
        >
          Predict 💖
        </button>

        {/* RESULT */}
        {results && (
          <div className="mt-4 text-left">
            <p>📅 Next Period: {results.nextPeriod}</p>
            <p>🌸 Fertile Window: {results.fertileWindow}</p>
          </div>
        )}

        {/* HISTORY */}
        <div className="mt-5 text-left">
          <h3 className="font-bold text-pink-500 mb-2">
            History 📅
          </h3>

          {history.length === 0 ? (
            <p>No history yet</p>
          ) : (
            history.map((item, i) => (
              <p key={i}>
                {new Date(item.lastDate).toDateString()} (Cycle: {item.cycleLength})
              </p>
            ))
          )}
        </div>

        {/* CALENDAR */}
        <div className="mt-8">
          <h3 className="text-pink-500 font-bold mb-3">
            Calendar 📅
          </h3>

          <div className="grid grid-cols-7 gap-2 text-center">
            
            {/* DAYS */}
            {["S","M","T","W","T","F","S"].map((d) => (
              <div key={d} className="font-bold text-gray-600">
                {d}
              </div>
            ))}

            {/* DATES */}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={`p-2 rounded-lg shadow ${
                  isPeriodDay(day)
                    ? "bg-pink-500 text-white"
                    : isFertileDay(day)
                    ? "bg-pink-200"
                    : day === today
                    ? "bg-pink-300"
                    : "bg-white"
                }`}
              >
                {day}
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

export default PeriodTracker;