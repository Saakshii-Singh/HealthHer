import Cycle from "../models/Cycle.js";

// @desc    Get all cycle entries for authenticated user
// @route   GET /api/cycle
export async function getCycleLogs(req, res) {
  try {
    const logs = await Cycle.find({ userId: req.user._id })
      .sort({ startDate: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Create a new cycle log
// @route   POST /api/cycle
export async function createCycleLog(req, res) {
  const { startDate, duration, cycleLength, symptoms } = req.body;

  try {
    if (!startDate) {
      return res.status(400).json({ message: "Start date is required" });
    }

    const log = await Cycle.create({
      userId: req.user._id,
      startDate: new Date(startDate),
      duration: duration || 5,
      cycleLength: cycleLength || 28,
      symptoms: symptoms || [],
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}