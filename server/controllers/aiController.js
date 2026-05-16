import OpenAi from "openai";

export const askAI = async (req, res) => {
    try {
        const openai = new OpenAi({
        apiKey: process.env.OPENAI_API_KEY,
            });
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

        res.json({
            reply: response.choices[0].message.content,
        });
    } catch(error){
        res.status(500).json({ error: "Failed to get AI response" });
    }
};

