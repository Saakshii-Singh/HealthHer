import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function AiAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage = {
      type: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = question;

    setQuestion("");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/ai",
        {
          question: currentQuestion,
        }
      );

      const aiMessage = {
        type: "ai",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Sorry, something went wrong.",
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col p-4">

      <h1 className="text-3xl font-bold text-center text-pink-500 mb-4">
        AI Assistant 
      </h1>

      <div className="flex-1 overflow-y-auto bg-pink-100 rounded-2xl p-4 space-y-3 shadow">

        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-2xl max-w-xs break-words ${
              msg.type === "user"
                ? "bg-pink-400 text-white ml-auto"
                : "bg-white shadow"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}

        {loading && (
          <div className="bg-white shadow px-4 py-2 rounded-xl w-fit">
            AI is thinking...
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      <div className="flex gap-2 mt-4">

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && askAI()
          }
          placeholder="Ask something..."
          className="flex-1 p-3 rounded-xl border border-pink-300 focus:outline-none"
        />

        <button
          onClick={askAI}
          className="bg-pink-400 hover:bg-pink-500 text-white px-6 rounded-xl"
        >
          Send
        </button>

      </div>
    </div>
  );
}

export default AiAssistant;