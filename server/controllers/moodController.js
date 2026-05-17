import Mood from '../models/moodMood.js';

export const saveMood = async (req, res) => {
    try {
        const{
            userId,
            mood,
            stressLevel,
            painLevel,
            note
        }=req.body;

        const newMood=await Mood.create({
            userId,
            mood,
            stressLevel,
            painLevel,
            note
        });
        res.status(201).json(newMood);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Server error",
        });
    }
};

export const getMoods = async (req, res) => {
    try {
        const { userId } = req.params;
        const moods = await Mood.find({ userId }).sort({ createdAt: -1 });
        res.json(moods);
    }catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};