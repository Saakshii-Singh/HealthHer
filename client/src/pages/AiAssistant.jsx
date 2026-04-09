import {useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";

function AiAssistant() {
    const [question, setQuestion] = useState("");
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);

    const askAI= async () => {
        if (!question.trim()) return;

        const userMessage={
            type:"user",
            text: question,
        };
        setMessage((prev) => [...prev, userMessage]);
        setQuestion("");

        try{
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/ai", {question});
            const aiMessage={
                type:"ai",
                text: res.data.reply,
            };
            setMessage((prev) => [...prev, aiMessage]);
        } catch (err) {
            setMessage((prev)=>[...prev,{
                type:"ai",
                text: "Sorry, something went wrong. Please try again.",
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="min-h-screen bg-pink-50 flex flex-col p-4">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-4 text-center">
        AI Assistant 🤖
      </h1>

      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">

        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl max-w-xs ${
              msg.type === "user"
                ? "bg-pink-300 ml-auto text-white"
                : "bg-white shadow"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}

        {loading && (
          <p className="text-sm text-gray-500">AI is thinking...</p>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 p-2 rounded-lg border"
        />

        <button
          onClick={askAI}
          className="bg-pink-400 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AiAssistant;