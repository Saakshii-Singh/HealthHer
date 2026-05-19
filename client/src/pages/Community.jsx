import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Send, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ROOMS = [
  { id: "general", label: "General", emoji: "🌸" },
  { id: "cycle", label: "Cycle & Periods", emoji: "🌙" },
  { id: "mind", label: "Mental Wellness", emoji: "🧘‍♀️" },
  { id: "body", label: "Body & Care", emoji: "💗" }
];

export default function Community() {
  const [nickname, setNickname] = useState("");
  const [room, setRoom] = useState("general");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("hh_nickname");
    setNickname(saved || `BraveRose${Math.floor(Math.random() * 90 + 10)}`);
  }, []);

  useEffect(() => {
    const socketUrl = window.location.hostname === "localhost" ? "http://localhost:5000" : window.location.origin;
    const socket = io(socketUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("new_message", (message) => {
      if (message.room === room) {
        setMessages(prev => {
          if (prev.some(x => x._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    });

    return () => socket.disconnect();
  }, [room]);

  useEffect(() => {
    if (!socketRef.current) return;
    setLoading(true);
    socketRef.current.emit("join_room", { room });

    fetch(`/api/messages/${room}`)
      .then(res => res.json())
      .then(data => { setMessages(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [room, connected]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;

    const payload = { nickname, content, room };

    if (socketRef.current && connected) {
      socketRef.current.emit("send_message", payload);
      setDraft("");
    } else {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setMessages(prev => [...prev, saved]);
        setDraft("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-5 py-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className="bg-white p-4 border border-border rounded-2xl shadow-soft">
            <label className="text-2xs uppercase tracking-wider block font-bold text-plum">Chat Name</label>
            <input value={nickname} onChange={e => { setNickname(e.target.value); localStorage.setItem("hh_nickname", e.target.value); }} className="w-full mt-2 text-xs border border-border p-2 rounded-xl outline-none" />
          </div>
          <div className="bg-white p-4 border border-border rounded-2xl">
            <h4 className="text-2xs font-bold uppercase text-plum mb-2">Channels</h4>
            <div className="flex flex-col gap-1">
              {ROOMS.map(r => (
                <button key={r.id} onClick={() => setRoom(r.id)} className={`text-left text-xs p-2 rounded-xl ${room === r.id ? "bg-secondary text-plum font-bold" : "hover:bg-muted"}`}>{r.emoji} {r.label}</button>
              ))}
            </div>
          </div>
        </aside>

        <div className="bg-white border border-border rounded-3xl shadow-soft flex flex-col h-[500px]">
          <header className="border-b border-border p-4 bg-secondary/20 flex justify-between text-xs text-plum font-bold">
            <span>{ROOMS.find(r => r.id === room)?.emoji} {ROOMS.find(r => r.id === room)?.label} Room</span>
            <span>{connected ? "Realtime Active" : "Offline mode"}</span>
          </header>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? <p className="text-center text-xs text-muted-foreground py-10">Loading...</p> : messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.nickname === nickname ? "items-end" : "items-start"}`}>
                <span className="text-3xs text-muted-foreground font-bold mb-0.5">{m.nickname}</span>
                <span className={`text-xs px-3.5 py-2 rounded-2xl ${m.nickname === nickname ? "bg-gradient-primary text-white rounded-tr-none" : "bg-secondary text-plum rounded-tl-none"}`}>{m.content}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="border-t border-border p-3 flex gap-2">
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type a supportive word..." className="flex-1 text-xs border p-3 rounded-xl outline-none" />
            <button type="submit" className="bg-gradient-primary text-white p-3 rounded-xl"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}