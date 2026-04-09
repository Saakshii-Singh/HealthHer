import { model } from "mongoose";
import OpenAi from "openai";

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

export const askAI = async (req, res) => {
    try {
        const { question } = req.body;

        const response = await openai.chat.completions.create({
            model:"gpt-4.1-mini",
            messages:[
                {
                    role:"system",
                    content: "You are a helpful women's health assistant. Give safe, simple, and caring answers.",
        },
        {
            role:"user",
            content: question,
        }
            ],
        });

        res.jsn({
            reply: response.choices[0].message.content,
        })
    } catch(error){
        res.status(500).json({ error: "Failed to get AI response" });
    }
};

