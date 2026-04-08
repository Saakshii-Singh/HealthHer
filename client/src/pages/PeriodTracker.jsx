import { useState } from "react";
import axios from "axios";

function PeriodTracker() {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [form, setForm] = useState({
    lastPeriodDate: "",
    cycleLength: "",
    duration: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      alert("Error saving data");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-pink-50 p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Period Tracker 💖
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="lastPeriodDate"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="cycleLength"
          placeholder="Cycle Length (e.g. 28)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="duration"
          placeholder="Duration (e.g. 5)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button className="w-full bg-pink-400 text-white py-2 rounded">
          Track
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <p>
            <strong>Next Period:</strong>{" "}
            {new Date(result.nextPeriod).toDateString()}
          </p>

          <p>
            <strong>Ovulation:</strong>{" "}
            {new Date(result.ovulation).toDateString()}
          </p>

          <p>
            <strong>Phase:</strong> {result.phase}
          </p>

          <p className="mt-2 text-pink-600">{result.insight}</p>
        </div>
      )}
    </div>
  );
}

export default PeriodTracker;