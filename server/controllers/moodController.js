import Mood from "../models/Mood.js";

// @desc    Get all mood logs for the authenticated user
// @route   GET /api/moods
export async function getMoodLogs(req, res) {
  try {
    const moods = await Mood.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Log a new mood entry
// @route   POST /api/moods
export async function createMoodLog(req, res) {
  const { score, note, symptoms } = req.body;

  try {
    if (!score) {
      return res.status(400).json({ message: "Mood score is required" });
    }

    const mood = await Mood.create({
      userId: req.user._id,
      score,
      note,
      symptoms: symptoms || [],
    });

    res.status(201).json(mood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}