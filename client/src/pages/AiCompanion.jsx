import { useState, useRef, useEffect } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Send, BrainCircuit } from "lucide-react";

export default function AICompanion() {
  const [messages, setMessages] = useState([
    { id: "1", sender: "ai", text: "Hello! I am your HealthHer Wellness Companion. 🌸 Ask me anything about cramps, iron diets, mood rhythms, or hygiene. I'm listening." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setInput("");
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: "ai", text: data.response }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: "ai", text: "My network seems offline. Please make sure the server is booted up. 💗" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <SiteHeader />
        
        <div className="mx-auto max-w-3xl px-5 py-8">
          <div className="bg-white border rounded-3xl shadow-soft h-[500px] flex flex-col justify-between overflow-hidden">
            <header className="border-b border-border p-4 bg-secondary/15 flex items-center gap-2 text-plum font-bold text-sm">
              <BrainCircuit className="h-5 w-5 text-primary animate-pulse" /> AI Wellness Companion
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <span className="text-3xs text-muted-foreground font-bold mb-0.5">{m.sender === "user" ? "You" : "Companion"}</span>
                  <span className={`text-xs px-3.5 py-2.5 rounded-2xl leading-relaxed ${m.sender === "user" ? "bg-gradient-primary text-white rounded-tr-none" : "bg-secondary text-plum rounded-tl-none"}`}>{m.text}</span>
                </div>
              ))}
              {loading && <p className="text-3xs text-muted-foreground animate-pulse">Companion is composing...</p>}
            </div>

            <form onSubmit={handleSend} className="border-t p-3 flex gap-2 bg-white">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about intimate hygiene, pms tips..." className="flex-1 text-xs border p-3 rounded-xl outline-none" />
              <button type="submit" className="bg-gradient-primary text-white p-3 rounded-xl"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}