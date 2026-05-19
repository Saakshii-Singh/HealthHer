import { useState, useEffect } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, Smile, Plus, User, Heart } from "lucide-react";

export default function Dashboard() {
  const [token, setToken] = useState(localStorage.getItem("hh_token"));
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" });
  
  const [moodLogs, setMoodLogs] = useState([]);
  const [cycleLogs, setCycleLogs] = useState([]);
  
  const [moodInput, setMoodInput] = useState({ score: 3, note: "" });
  const [cycleInput, setCycleInput] = useState({ startDate: new Date().toISOString().split("T")[0], duration: 5 });

  const checkUserStatus = () => {
    setToken(localStorage.getItem("hh_token"));
    const u = localStorage.getItem("hh_user");
    if (u) setUser(JSON.parse(u));
  };

  useEffect(() => {
    checkUserStatus();
    window.addEventListener("hh_login_state_change", checkUserStatus);
    return () => window.removeEventListener("hh_login_state_change", checkUserStatus);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/moods", { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => res.json()).then(setMoodLogs).catch(() => {});
    fetch("/api/cycle", { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => res.json()).then(setCycleLogs).catch(() => {});
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm)
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("hh_token", data.token);
      localStorage.setItem("hh_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("hh_login_state_change"));
    } else {
      alert(data.message || "Auth failed");
    }
  };

  const logMood = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/moods", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(moodInput)
    });
    if (res.ok) {
      const saved = await res.json();
      setMoodLogs([saved, ...moodLogs]);
      setMoodInput({ score: 3, note: "" });
      alert("Logged 💗");
    }
  };

  const logCycle = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/cycle", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(cycleInput)
    });
    if (res.ok) {
      const saved = await res.json();
      setCycleLogs([saved, ...cycleLogs]);
      alert("Logged 🌙");
    }
  };

  const chartData = moodLogs.slice().reverse().map(l => ({
    date: new Date(l.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
    mood: l.score
  }));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-5 py-12">
        {!token ? (
          <div className="max-w-md mx-auto bg-white border p-8 rounded-3xl shadow-soft">
            <h2 className="font-display text-2xl font-bold text-center text-plum mb-6">{isLogin ? "Log In" : "Register"}</h2>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <input placeholder="Username" value={authForm.username} onChange={e => setAuthForm({ ...authForm, username: e.target.value })} className="w-full text-xs border p-3 rounded-xl" required />
              )}
              <input type="email" placeholder="Email" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} className="w-full text-xs border p-3 rounded-xl" required />
              <input type="password" placeholder="Password" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} className="w-full text-xs border p-3 rounded-xl" required />
              <button type="submit" className="w-full bg-gradient-primary text-white py-3 rounded-full text-xs font-bold">{isLogin ? "Sign In" : "Sign Up"}</button>
            </form>
            <button className="w-full mt-4 text-3xs text-primary font-bold text-center" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Need an account? Sign Up" : "Have an account? Sign In"}</button>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="font-display text-3xl font-bold text-plum">Welcome, {user?.username} 🌸</h1>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white p-6 border rounded-2xl shadow-soft space-y-4">
                <h3 className="font-display text-lg font-bold text-plum flex items-center gap-1"><Calendar className="h-5 w-5 text-primary" /> Period Logger</h3>
                <form onSubmit={logCycle} className="space-y-3">
                  <input type="date" value={cycleInput.startDate} onChange={e => setCycleInput({ ...cycleInput, startDate: e.target.value })} className="w-full border p-2 text-xs rounded-xl" />
                  <input type="number" placeholder="Flow days (e.g. 5)" value={cycleInput.duration} onChange={e => setCycleInput({ ...cycleInput, duration: parseInt(e.target.value) })} className="w-full border p-2 text-xs rounded-xl" />
                  <button type="submit" className="bg-gradient-primary text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1"><Plus className="h-4 w-4" /> Save Period</button>
                </form>
              </div>

              <div className="bg-white p-6 border rounded-2xl shadow-soft space-y-4">
                <h3 className="font-display text-lg font-bold text-plum flex items-center gap-1"><Smile className="h-5 w-5 text-primary" /> Mood Logger</h3>
                <form onSubmit={logMood} className="space-y-3">
                  <input type="number" min="1" max="5" placeholder="Rate mood (1-5)" value={moodInput.score} onChange={e => setMoodInput({ ...moodInput, score: parseInt(e.target.value) })} className="w-full border p-2 text-xs rounded-xl" />
                  <input placeholder="Note..." value={moodInput.note} onChange={e => setMoodInput({ ...moodInput, note: e.target.value })} className="w-full border p-2 text-xs rounded-xl" />
                  <button type="submit" className="bg-gradient-primary text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1"><Plus className="h-4 w-4" /> Save Mood</button>
                </form>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="bg-white p-6 border rounded-2xl shadow-soft">
                <h3 className="font-display text-lg font-bold text-plum mb-4">Mood Trends Graph</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid stroke="#ebdcd9" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: '#7c636c', fontSize: 10 }} />
                      <YAxis domain={[1, 5]} tick={{ fill: '#7c636c', fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="mood" stroke="#b8586c" strokeWidth={2.5} name="Mood" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}