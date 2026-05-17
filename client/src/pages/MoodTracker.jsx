import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const MoodTracker = () => {

    const user = JSON.parse(
        localStorage.getItem("userInfo")
    );

    const [mood, setMood] = useState("");
    const [stressLevel, setStressLevel] = useState(1);
    const [painLevel, setPainLevel] = useState(1);
    const [note, setNote] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [history, setHistory] = useState([]);

    // Fetch Mood History
    useEffect(() => {

        fetchMoodHistory();

    }, []);

    const fetchMoodHistory = async () => {

        try {

            const res = await axios.get(
                `http://localhost:5000/api/mood/${user._id}`
            );

            setHistory(res.data);

        } catch (error) {

            console.log(error);
        }
    };

    // Save Mood
    const saveMood = async () => {

        try {

            await axios.post(
                "http://localhost:5000/api/mood",
                {
                    userId: user._id,
                    mood,
                    stressLevel,
                    painLevel,
                    note,
                }
            );

            alert("Mood saved successfully!");

            fetchMoodHistory();

            setMood("");
            setStressLevel(1);
            setPainLevel(1);
            setNote("");

        } catch (error) {

            console.log(error);

            alert("Failed to save mood");
        }
    };

    // Insight Logic
    const getInsight = () => {

        if (stressLevel >= 8) {
            return "You seem very stressed today 😣 Try meditation and proper sleep.";
        }

        if (painLevel >= 8) {
            return "Your pain level is high 🤕 Consider rest and hydration.";
        }

        if (mood === "Sad") {
            return "It's okay to have hard days 💖 Take care of yourself.";
        }

        if (mood === "Happy") {
            return "Great to see you feeling happy today 🌸";
        }

        return "Keep tracking your wellness daily ✨";
    };

    return (

        <motion.div
            className="min-h-screen bg-pink-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >

            {/* Header */}
            <motion.h1
                className="text-3xl font-bold mb-6 text-pink-500"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                Mood Tracker 🙂
            </motion.h1>

            {/* Main Card */}
            <motion.div
                className="bg-white p-6 rounded-3xl shadow-lg max-w-md mx-auto"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >

                {/* Mood */}
                <label className="font-semibold block mb-2">
                    Select Mood
                </label>

                <select
                    value={mood}
                    onChange={(e) =>
                        setMood(e.target.value)
                    }
                    className="w-full p-3 border rounded-xl mb-4 focus:outline-none"
                >

                    <option value="">
                        -- Select Mood --
                    </option>

                    <option value="Happy">
                        Happy 🙂
                    </option>

                    <option value="Sad">
                        Sad 😔
                    </option>

                    <option value="Anxious">
                        Anxious 😟
                    </option>

                    <option value="Irritable">
                        Irritable 😤
                    </option>

                    <option value="Tired">
                        Tired 😴
                    </option>

                    <option value="Neutral">
                        Neutral 😐
                    </option>

                </select>

                {/* Stress */}
                <label className="font-semibold block mb-2">
                    Stress Level (1-10)
                </label>

                <input
                    type="number"
                    min="1"
                    max="10"
                    value={stressLevel}
                    onChange={(e) =>
                        setStressLevel(e.target.value)
                    }
                    className="w-full p-3 border rounded-xl mb-4"
                />

                {/* Pain */}
                <label className="font-semibold block mb-2">
                    Pain Level (1-10)
                </label>

                <input
                    type="number"
                    min="1"
                    max="10"
                    value={painLevel}
                    onChange={(e) =>
                        setPainLevel(e.target.value)
                    }
                    className="w-full p-3 border rounded-xl mb-4"
                />

                {/* Notes */}
                <label className="font-semibold block mb-2">
                    Notes
                </label>

                <textarea
                    value={note}
                    onChange={(e) =>
                        setNote(e.target.value)
                    }
                    placeholder="Write how you're feeling..."
                    className="w-full p-3 border rounded-xl mb-5 h-28"
                />

                {/* Insight */}
                <motion.div
                    className="bg-pink-100 p-4 rounded-2xl mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >

                    <p className="text-pink-700 font-medium">
                        {getInsight()}
                    </p>

                </motion.div>

                {/* Save Button */}
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveMood}
                    className="bg-pink-500 hover:bg-pink-600 text-white w-full py-3 rounded-xl font-semibold"
                >
                    Save Mood
                </motion.button>

            </motion.div>

            {/* Mood History */}
            <motion.div
                className="max-w-md mx-auto mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >

                <h2 className="text-2xl font-bold mb-4">
                    Mood History 📖
                </h2>

                <div className="space-y-4">

                    {history.map((item) => (

                        <motion.div
                            key={item._id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-4 rounded-2xl shadow"
                        >

                            <p>
                                <strong>Mood:</strong> {item.mood}
                            </p>

                            <p>
                                <strong>Stress:</strong> {item.stressLevel}/10
                            </p>

                            <p>
                                <strong>Pain:</strong> {item.painLevel}/10
                            </p>

                            <p>
                                <strong>Notes:</strong> {item.note}
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                {new Date(
                                    item.createdAt
                                ).toDateString()}
                            </p>

                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Wellness Trends */}
            <motion.div
                className="bg-white p-6 rounded-3xl shadow-lg max-w-md mx-auto mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >

                <h2 className="text-2xl font-bold mb-4">
                    Wellness Trends 📊
                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <LineChart data={history}>

                        <XAxis
                            dataKey="createdAt"
                            tickFormatter={(value) =>
                                new Date(value)
                                    .toLocaleDateString()
                            }
                        />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="stressLevel"
                        />

                        <Line
                            type="monotone"
                            dataKey="painLevel"
                        />

                    </LineChart>

                </ResponsiveContainer>

            </motion.div>
            <motion.div
    className="bg-white p-6 rounded-3xl shadow-lg max-w-md mx-auto mt-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
>

    <h2 className="text-2xl font-bold mb-4">
        Wellness Calendar 📅
    </h2>

    <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
    />

    <p className="mt-4 text-pink-500 font-medium">
        Selected Date:
        {" "}
        {selectedDate.toDateString()}
    </p>

</motion.div>

        </motion.div>
    );
};

export default MoodTracker;