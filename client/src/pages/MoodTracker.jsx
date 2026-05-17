import { useState } from "react";
import axios from "axios";
import {motion} from "framer-motion";

const MoodTracker = () => {
    const user=JSON.parse(localStorage.getItem("userInfo"));
    const [mood, setMood] = useState("");
    const [stressLevel, setStressLevel] = useState(1);
    const [painLevel, setPainLevel] = useState(1);
    const [note, setNote] = useState("");

    const saveMood = async () => {
        try {
           await axios.post(
                "http://localhost:5000/api/mood",
                {
                    userId: user._id,
                    mood,
                    stressLevel,
                    painLevel,
                    symptoms,
                    note,
                }
            );  

            alert("Mood saved successfully!");

            setMood("");
            setStressLevel(1);
            setPainLevel(1);
            setNote("");
        } catch (error) {
            console.log(error);
            alert("Failed to save mood");
        }
    };
    return (
        <motion.div
        className="min-h-screen bg-pink-50 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        >
        <motion.h1
         className="text-3xl font-bold mb-6  text-pink-500"
         initial={{ y: -20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         >
            Mood Tracker
         </motion.h1>
        <motion.div
        className="bg-white p-6 rounded-3xl shadow-lg max-w-md mx-auto"
        initial={{y:40,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:0.5}}
        >
            <label className="font-semibold block mb-2">
                Select Mood
            </label>
            <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4 focus:outline-none"
            >
                <option value="">-- Select Mood --</option>
                <option value="Happy">Happy</option>
                <option value="Sad">Sad</option>
                <option value="Anxious">Anxious</option>
                <option value="Irritable">Irritable</option>
                <option value="Tired">Tired</option>
                <option value="Neutral">Neutral</option>
            </select>
            <label className="font-semibold block mb-2">
                Stress Level (1-10)
            </label>
            <input
            type="number"
            min="1"
            max="10"
            value={stressLevel}
            onChange={(e) => setStressLevel(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4"
            />
            <label className="font-semibold block mb-2"></label>
                Pain Level (1-10)
            </label>
            <input
            type="number"
            min="1"
            max="10"
            value={painLevel}
            onChange={(e) => setPainLevel(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4"
            />
           <label className="font-semibold block mb-2">Note</label>
            <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write How you are feeling"
            className="w-full p-3 border rounded-xl mb-5 h-28"
            />
            <motion.button
            whileHover={{scale:1.03}}
            whileTap={{scale:0.97}}
            onClick={saveMood}
            className="w-full bg-pink-500 text-white p-3 rounded-xl font-semibold"
            >
                Save Mood
            </motion.button>
        </motion.div>
        </motion.div>
    );
}
export default MoodTracker;