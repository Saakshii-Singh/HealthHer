import Period from "../models/periodModel.js";


const calculateData=(lastDate,cycleLength)=>{
    const last=new Date(lastDate);
    const nextPeriod=new Date(last);
    nextPeriod.setDate(last.getDate() + cycleLength);
    const ovulation=new Date(nextPeriod);
    ovulation.setDate(nextPeriod.getDate() - 14);

    const today=new Date();
    const diff=Math.floor((today - last) / (1000 * 60 * 60 * 24));
    const day=diff % cycleLength;

    let phase="";
    if (day < 5) phase="Menstrual";
    else if (day < 14) phase="Follicular";
    else if (day < 19) phase="Ovulation";
    else phase="Luteal";

    const insights={
        Menstrual:"Your period is currently active. It's a good time to focus on self-care and rest.",
        Follicular:"Your body is preparing for ovulation. Consider engaging in light exercise and maintaining a balanced diet.",
        Ovulation:"You are in your fertile window. This is the best time for conception if you're trying to conceive.",
        Luteal:"Your body is preparing for the next period. Focus on stress reduction and maintaining a healthy lifestyle."
    };

    return { nextPeriod, ovulation, phase, insights: insights[phase] };
};

export const savePeriod=async (req, res) => {
    try{
        const {userId,lastPeriodDate,cycleLength,duration}=req.body;

        if(!lastPeriodDate || !cycleLength || !duration){
            return res.status(400).json({ message: "All fields are required" });
        }
        const result=calculateData(lastPeriodDate,cycleLength);

        const  data=await Period.create({
            userId,lastPeriodDate,cycleLength,duration,...result,
        });
        res.status(201).json(data);
    }catch(error){
        res.status(500).json({ message: "Server error" });
    }
};

export const getPeriod=async (req, res) => {
    try{
        const {userId}=req.params;
        const data=await Period.find({ userId }).sort({ createdAt: -1 });
        res.json(data);
    } catch(error){
        res.status(500).json({ message: "Server error" });
    }
};
