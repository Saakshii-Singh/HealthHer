import Period from "../models/periodModel.js";

export const savePeriod=async (req, res) => {
    const { userId, lastDate, cycleLength } = req.body;

    const period=await Period.create({
        userId,
        lastDate,
        cycleLength,
    });

    res.json(period);
};

export const getPeriod=async (req, res) => {
    const periods=await Period.find({ userId: req.params.userId }).sort({ createdAt: -1 });

    res.json(periods);
};