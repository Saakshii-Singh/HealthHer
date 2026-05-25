import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Send, Shield, Sparkles, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../config";

const ROOMS = [
  { id: "general", label: "General", emoji: "🌸" },
  { id: "cycle", label: "Cycle & Periods", emoji: "🌙" },
  { id: "mind", label: "Mental Wellness", emoji: "🧘‍♀️" },
  { id: "body", label: "Body & Care", emoji: "💗" },
];

const ADJECTIVES = ["Kind", "Brave", "Gentle", "Bright", "Calm", "Wild", "Soft", "Bold", "Sunny", "Quiet"];
const FLOWERS = ["Lily", "Rose", "Iris", "Jasmine", "Poppy", "Daisy", "Violet", "Orchid", "Tulip", "Peony"];

function randomNickname() {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const f = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
  return `${a}${f}${Math.floor(Math.random() * 90 + 10)}`;
}

export default function Community() {
  const [nickname, setNickname] = useState("");
  const [room, setRoom] = useState("general");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [roomSearch, setRoomSearch] = useState("");
  const [msgSearch, setMsgSearch] = useState("");
  const [cooldownActive, setCooldownActive] = useState(false);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);

  const roomRef = useRef(room);
  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  // Initialize nickname
  useEffect(() => {
    const saved = localStorage.getItem("hh_nickname");
    setNickname(saved || randomNickname());
  }, []);

  // Initialize socket connection once on mount
  useEffect(() => {
    const socketUrl = BACKEND_URL || "http://localhost:5000";
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"]
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // Listen for new messages
    socket.on("new_message", (message) => {
      if (message.room === roomRef.current) {
        setMessages((prev) => {
          if (prev.some((x) => x._id === message._id || x.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    });

    // Listen for rate limit errors
    socket.on("rate_limit_error", (data) => {
      alert(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Join room history from REST API only when channel changes
  useEffect(() => {
    setMsgSearch(""); // Reset message filter when room changes
    setLoading(true);
    
    // Fetch message history from REST API
    fetch(`${BACKEND_URL}/api/messages/${room}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load history");
        return res.json();
      })
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading chat history:", err);
        setLoading(false);
      });
  }, [room]);

  // Separate effect to handle WebSockets room joining when connection or room changes
  useEffect(() => {
    if (socketRef.current && connected) {
      socketRef.current.emit("join_room", { room });
    }
  }, [room, connected]);

  // Autoscroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const saveNickname = (v) => {
    const clean = v.trim().slice(0, 40);
    setNickname(clean);
    if (clean) localStorage.setItem("hh_nickname", clean);
  };

  const generateNewNickname = () => {
    const newName = randomNickname();
    setNickname(newName);
    localStorage.setItem("hh_nickname", newName);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const content = draft.trim();
    const name = nickname.trim() || randomNickname();
    if (!content) return;

    if (cooldownActive) {
      alert("Slow down! Please wait a moment before sending another message. 🌸");
      return;
    }

    if (content.length > 1000) {
      alert("Message too long (max 1000 characters)");
      return;
    }

    // Activate anti-spam cooldown
    setCooldownActive(true);
    setTimeout(() => {
      setCooldownActive(false);
    }, 1500);

    const payload = {
      nickname: name,
      content,
      room
    };

    // Emit message to Socket.io server
    if (socketRef.current && connected) {
      socketRef.current.emit("send_message", payload);
      setDraft("");
    } else {
      // Fallback to HTTP POST if socket is disconnected
      try {
        const res = await fetch(`${BACKEND_URL}/api/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const savedMsg = await res.json();
          setMessages((prev) => [...prev, savedMsg]);
          setDraft("");
        } else {
          alert("Could not send message.");
        }
      } catch (err) {
        console.error("Failed to send message over HTTP:", err);
        alert("Failed to send message.");
      }
    }
  };

  const avatarColor = useMemo(() => (name) => {
    let h = 0;
    for (let i = 0; i < name.length; i++) {
      h = (h * 31 + name.charCodeAt(i)) % 360;
    }
    return `hsl(${h}, 70%, 85%)`;
  }, []);

  const filteredRooms = useMemo(() => {
    return ROOMS.filter(r => r.label.toLowerCase().includes(roomSearch.toLowerCase()));
  }, [roomSearch]);

  const filteredMessages = useMemo(() => {
    if (!msgSearch.trim()) return messages;
    const query = msgSearch.toLowerCase();
    return messages.filter(m => 
      m.nickname.toLowerCase().includes(query) || 
      m.content.toLowerCase().includes(query)
    );
  }, [messages, msgSearch]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden py-10">
        <div className="absolute inset-0 bg-gradient-warm opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-4 py-1.5 text-xs font-semibold border border-border shadow-soft text-primary">
            <Shield className="h-3.5 w-3.5" />
            Anonymous · Secure Connections · Zero accounts required
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-plum">Anonymous Chat</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground text-sm md:text-base">
            Share advice, seek support, and talk with other women globally. Choose a room, define your alias, and write freely.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <label className="text-xs uppercase tracking-wider text-plum font-bold block mb-1">Your Alias</label>
            <input
              value={nickname}
              onChange={(e) => saveNickname(e.target.value)}
              placeholder="Pick a nickname"
              maxLength={40}
              className="mt-2 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            <button
              onClick={generateNewNickname}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              <Sparkles className="h-3.5 w-3.5" /> Generate a floral nickname
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wider text-plum font-bold mb-3">Chat Channels</p>
            
            <input
              type="text"
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
              placeholder="Search channels..."
              className="w-full mb-3 rounded-xl border border-input bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />

            <div className="flex flex-col gap-1.5">
              {filteredRooms.length === 0 ? (
                <div className="text-center py-4 text-xs text-muted-foreground font-medium">
                  No channels found
                </div>
              ) : (
                filteredRooms.map((r) => {
                  const active = room === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRoom(r.id)}
                      className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm transition-all text-left ${
                        active 
                          ? "bg-gradient-primary text-white shadow-soft font-bold scale-[1.02]" 
                          : "hover:bg-secondary/60 text-muted-foreground hover:text-foreground font-semibold"
                      }`}
                    >
                      <span className="text-base">{r.emoji}</span>
                      <span>{r.label}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 p-5 text-xs text-muted-foreground">
            <p className="font-bold text-plum flex items-center gap-1.5 mb-2.5"><Users className="h-3.5 w-3.5" /> Community Guidelines</p>
            <ul className="space-y-1.5 list-disc pl-4 font-medium leading-relaxed">
              <li>Be extremely respectful & kind.</li>
              <li>Never share phone numbers or social handles.</li>
              <li>This is not clinical medical advice.</li>
            </ul>
          </div>
        </aside>

        {/* Chat window */}
        <div className="flex flex-col rounded-2xl border border-border bg-card shadow-soft overflow-hidden min-h-[550px] max-h-[650px]">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 px-5 py-4 bg-secondary/30">
            <div>
              <h2 className="font-display text-xl font-bold text-plum">
                {ROOMS.find((r) => r.id === room)?.emoji} {ROOMS.find((r) => r.id === room)?.label} Room
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <span className={`h-2 w-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
                <span>{connected ? "Connected to realtime stream" : "Reconnecting..."}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-center">
              <input
                type="text"
                value={msgSearch}
                onChange={(e) => setMsgSearch(e.target.value)}
                placeholder="Search messages..."
                className="rounded-xl border border-input bg-white px-3.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all w-40 sm:w-48"
              />
              <span className="text-xs font-semibold bg-white border border-border px-3 py-1 rounded-full text-plum">
                {filteredMessages.length} {filteredMessages.length === 1 ? "entry" : "entries"}
              </span>
            </div>
          </header>

          {/* Message List */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-background/25">
            {loading ? (
              <div className="text-center text-sm text-muted-foreground py-16 flex flex-col items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Fetching conversations...</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-20 font-medium">
                {messages.length === 0 
                  ? "No chat logs here yet. Say something kind to start the circle 💗" 
                  : "No messages match your search filter."}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((m, index) => {
                  const mine = m.nickname === nickname;
                  const keyId = m._id || m.id || index;
                  return (
                    <motion.div 
                      key={keyId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex gap-3 ${mine ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold shadow-sm select-none"
                        style={{ backgroundColor: avatarColor(m.nickname), color: "#561d33" }}
                      >
                        {m.nickname.charAt(0).toUpperCase()}
                      </div>
                      <div className={`max-w-[75%] ${mine ? "items-end text-right" : ""} flex flex-col`}>
                        <div className="text-xs text-muted-foreground mb-1 font-medium">
                          <span className="font-bold text-plum">{m.nickname}</span>
                          <span className="mx-1.5">·</span>
                          <time>{new Date(m.createdAt || m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-soft border ${
                            mine
                              ? "bg-gradient-primary text-white border-primary/20 rounded-tr-sm"
                              : "bg-card text-foreground border-border rounded-tl-sm"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="border-t border-border/60 p-3 flex items-end gap-2 bg-card">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              rows={1}
              maxLength={1000}
              disabled={cooldownActive}
              placeholder={cooldownActive ? "Spam protection cooldown... 🌸" : `Share advice with the ${ROOMS.find((r) => r.id === room)?.label} circle...`}
              className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary max-h-32 transition-all disabled:opacity-75 disabled:bg-secondary/20"
            />
            <button
              type="submit"
              disabled={!draft.trim() || !connected || cooldownActive}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-white shadow-soft hover:shadow-glow hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
