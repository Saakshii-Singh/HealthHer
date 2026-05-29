import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "../components/SiteHeader";
import { Send, Sparkles, BrainCircuit, Heart, Plus, HelpCircle, ShieldAlert } from "lucide-react";
import { BACKEND_URL } from "../config";

const SUGGESTIONS = [
  "How can I relieve severe cramps naturally?",
  "What foods help replenish iron levels during periods?",
  "Why do I feel anxious or low right before my cycle?",
  "Intimate hygiene basics I should follow every day"
];

export default function AICompanion() {
  const [messages, setMessages] = useState([
    { 
      id: "welcome", 
      sender: "ai", 
      text: "Hello! I am your HealthHer Wellness Companion. 🌸 I am here to offer a safe, warm, and judgment-free space to answer questions about menstrual health, emotional wellbeing, intimate care, and simple self-checks. How are you feeling today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend.trim();
    if (!text) return;

    setInput("");
    const userMsg = { id: Date.now().toString(), sender: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error("Could not process request");
      
      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), sender: "ai", text: data.response }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          sender: "ai", 
          text: "I apologize, I am having a bit of trouble connecting to my cognitive networks. Remember to verify that the server is active, or write simple questions! 💗" 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header (fixed) */}
      <SiteHeader />

      {/* Main chat viewport container */}
      <main className="flex-1 flex flex-col overflow-hidden max-w-6xl w-full mx-auto px-4 py-4">
        <div className="flex-1 rounded-3xl border border-border bg-card shadow-soft overflow-hidden grid md:grid-cols-[1fr_280px]">
          
          {/* Primary Chat Box */}
          <div className="flex flex-col h-full bg-background/5 overflow-hidden">
            
            {/* Companion Compact Title Bar */}
            <div className="px-5 py-4 border-b border-border/40 bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-600 shadow-soft">
                  <BrainCircuit className="h-5 w-5" />
                </span>
                <div>
                  <h1 className="font-display text-sm font-bold text-plum leading-tight">AI Wellness Companion</h1>
                  <p className="text-4xs text-muted-foreground font-semibold uppercase tracking-wider">Compassionate Assistant · 24/7</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-4xs font-semibold text-primary shadow-soft">
                <Sparkles className="h-3 w-3" /> Live Real-time AI
              </div>
            </div>

            {/* Message scroll log */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((m) => {
                  const isAi = m.sender === "ai";
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${!isAi ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold shadow-sm select-none ${
                        isAi ? "bg-teal-50 text-teal-600 border border-teal-100" : "bg-rose-100 text-plum border border-rose-200"
                      }`}>
                        {isAi ? "🤖" : "👩"}
                      </div>
                      <div className={`max-w-[80%] flex flex-col ${!isAi ? "items-end" : ""}`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-soft border whitespace-pre-line ${
                          isAi 
                            ? "bg-card text-foreground border-border rounded-tl-sm"
                            : "bg-gradient-primary text-white border-primary/20 rounded-tr-sm"
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {loading && (
                <div className="flex gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-teal-50 text-teal-600 text-xs font-bold shadow-sm border border-teal-100">
                    🤖
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input form (Always Pinned at the very bottom!) */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="border-t border-border/60 p-4 bg-card flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me a question about women's health or cycles..."
                className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-plum font-semibold"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-white shadow-soft hover:shadow-glow hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Sidebar Suggestions */}
          <div className="hidden md:flex flex-col border-l border-border/60 bg-secondary/15 p-5 justify-between overflow-y-auto h-full">
            <div className="space-y-4">
              <h3 className="text-2xs font-bold uppercase tracking-wider text-plum flex items-center gap-1"><HelpCircle className="h-4.5 w-4.5" /> Quick Prompts</h3>
              <div className="space-y-2">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="w-full text-left text-2xs bg-card border border-border/60 p-3.5 rounded-xl hover:border-primary hover:bg-rose-50/20 hover:text-primary transition-all font-semibold leading-relaxed shadow-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-rose-100/50 bg-rose-50/30 p-4 text-3xs text-muted-foreground leading-relaxed flex items-start gap-2 mt-6 shrink-0">
              <ShieldAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Reminder:</strong> HealthHer Companion is designed for educational & wellness advice. It is not a clinical replacement for professional medical consults.
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
