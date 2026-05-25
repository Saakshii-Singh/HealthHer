import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Calendar, Smile, Heart, Shield, Plus, Sparkles, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { BACKEND_URL } from "../config";

// Predefined lists
const SYMPTOMS = ["Cramps", "Headache", "Mood Swings", "Bloating", "Fatigue", "Backache", "Insomnia", "Nausea"];
const MOOD_EMOJIS = [
  { score: 1, emoji: "🌧️", label: "Low" },
  { score: 2, emoji: "☁️", label: "Sad" },
  { score: 3, emoji: "🍃", label: "Neutral" },
  { score: 4, emoji: "☀️", label: "Good" },
  { score: 5, emoji: "✨", label: "Wonderful" }
];

export default function Dashboard() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [token, setToken] = useState(() => localStorage.getItem("hh_token"));
  const [cutePopup, setCutePopup] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("hh_user");
    return saved ? JSON.parse(saved) : null;
  });
  
  // Auth Form State
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Email Verification States
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccessMessage, setResendSuccessMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devCode, setDevCode] = useState("");

  // App Tracker States
  const [moodLogs, setMoodLogs] = useState([]);
  const [cycleLogs, setCycleLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("cycle"); // cycle | mood
  
  // Log Inputs
  const [moodInput, setMoodInput] = useState({ score: 3, note: "", symptoms: [] });
  const [cycleInput, setCycleInput] = useState({ startDate: new Date().toISOString().split("T")[0], duration: 5, cycleLength: 28, symptoms: [] });
  const [savingLog, setSavingLog] = useState(false);

  // Sync state across storage
  useEffect(() => {
    const handleLoginChange = () => {
      setToken(localStorage.getItem("hh_token"));
      const savedUser = localStorage.getItem("hh_user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    handleLoginChange();
    window.addEventListener("hh_login_state_change", handleLoginChange);
    return () => window.removeEventListener("hh_login_state_change", handleLoginChange);
  }, []);

  // Fetch logged data
  useEffect(() => {
    if (!token) return;
    
    // Fetch moods
    fetch(`${BACKEND_URL}/api/moods`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setMoodLogs(data))
      .catch(err => console.error(err));

    // Fetch cycle
    fetch(`${BACKEND_URL}/api/cycle`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setCycleLogs(data))
      .catch(err => console.error(err));
  }, [token]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    setVerificationError("");
    setResendSuccessMessage("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin 
      ? { email: authForm.email, password: authForm.password }
      : authForm;

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      localStorage.setItem("hh_token", data.token);
      localStorage.setItem("hh_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      if (data._devVerificationCode) {
        setDevCode(data._devVerificationCode);
      } else {
        setDevCode("");
      }
      
      // Dispatch storage state
      window.dispatchEvent(new Event("hh_login_state_change"));
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Cooldown timer for resending verification code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setVerificationError("");
    setVerificationLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, code: verificationCode })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // Successful verification!
      const updatedUser = { ...user, isVerified: true };
      localStorage.setItem("hh_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setVerificationCode("");
      setDevCode("");
      
      // Dispatch login state change
      window.dispatchEvent(new Event("hh_login_state_change"));
      setCutePopup({ title: "Account Verified! 🎉", message: "Your email has been verified. Welcome to your safe, anonymous wellness dashboard!", icon: "💖" });
    } catch (err) {
      setVerificationError(err.message);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setVerificationError("");
    setResendSuccessMessage("");
    setResendLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend code");
      }

      setResendSuccessMessage("A new verification code has been sent!");
      setResendCooldown(60);
      
      if (data._devVerificationCode) {
        setDevCode(data._devVerificationCode);
      }
    } catch (err) {
      setVerificationError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hh_token");
    localStorage.removeItem("hh_user");
    setToken(null);
    setUser(null);
    setDevCode("");
    setVerificationCode("");
    setVerificationError("");
    setResendSuccessMessage("");
    window.dispatchEvent(new Event("hh_login_state_change"));
  };

  const handleLogMood = async (e) => {
    e.preventDefault();
    setSavingLog(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/moods`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(moodInput)
      });
      if (res.ok) {
        const newLog = await res.json();
        setMoodLogs(prev => [newLog, ...prev]);
        setMoodInput({ score: 3, note: "", symptoms: [] });
        setCutePopup({ title: "Beautiful Check-In! 🍃", message: "Your emotional wave and symptoms have been safely logged to your private journal. Be gentle with yourself today!", icon: "🌸" });
      } else {
        setCutePopup({ title: "Oops!", message: "Could not log mood. Please check your connection and try again.", icon: "⚠️" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLog(false);
    }
  };

  const handleLogCycle = async (e) => {
    e.preventDefault();
    setSavingLog(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/cycle`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(cycleInput)
      });
      if (res.ok) {
        const newLog = await res.json();
        setCycleLogs(prev => [newLog, ...prev]);
        setCutePopup({ title: "Cycle Logged! 🌙", message: "Your cycle calendar has been successfully updated. We have adjusted your flow predictions to match your body's rhythm.", icon: "✨" });
      } else {
        setCutePopup({ title: "Oops!", message: "Could not log cycle. Please check your inputs and try again.", icon: "⚠️" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLog(false);
    }
  };

  const toggleSymptom = (type, list, setList) => {
    if (list.includes(type)) {
      setList(list.filter(x => x !== type));
    } else {
      setList([...list, type]);
    }
  };

  // Calculations for Cycle prediction
  const nextPeriodCalculation = () => {
    if (cycleLogs.length === 0) return { daysLeft: "Log a period", dateStr: "No logs found" };
    
    // Get latest log
    const latest = cycleLogs[0];
    const startDate = new Date(latest.startDate);
    const cycleLength = latest.cycleLength || 28;
    
    const nextDate = new Date(startDate);
    nextDate.setDate(startDate.getDate() + cycleLength);
    
    const diffTime = nextDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      daysLeft: diffDays > 0 ? `${diffDays} days` : "Flow active or imminent",
      dateStr: nextDate.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
    };
  };

  const cycleStatus = nextPeriodCalculation();

  // Recharts chart data preparation
  const chartData = moodLogs
    .slice()
    .reverse()
    .map(log => ({
      date: new Date(log.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
      score: log.score,
      note: log.note,
    }));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {!token ? (
        /* ================= AUTHENTICATION VIEW ================= */
        <div className="mx-auto max-w-md px-5 py-16 flex flex-col justify-center min-h-[75vh]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-card p-8 shadow-glow"
          >
            <div className="text-center mb-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-primary mx-auto mb-3 shadow-soft">
                <Heart className="h-6 w-6" fill="currentColor" />
              </span>
              <h1 className="font-display text-3xl font-bold text-plum">Welcome to HealthHer</h1>
              <p className="text-xs text-muted-foreground mt-2">
                Sync your period tracking, journal emotional health, and chat with an AI companion.
              </p>
            </div>

            {/* Tab Swapper */}
            <div className="flex rounded-full bg-muted p-1 mb-6 border border-border/60">
              <button
                onClick={() => { setIsLogin(true); setAuthError(""); }}
                className={`flex-1 rounded-full py-2.5 text-xs font-semibold transition-all ${
                  isLogin ? "bg-white text-plum shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsLogin(false); setAuthError(""); }}
                className={`flex-1 rounded-full py-2.5 text-xs font-semibold transition-all ${
                  !isLogin ? "bg-white text-plum shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Create Account
              </button>
            </div>

            {authError && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3.5 flex items-start gap-2.5 text-xs text-red-600 font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-xs font-bold text-plum uppercase tracking-wider block mb-1.5">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={authForm.username}
                    onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-plum uppercase tracking-wider block mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-plum uppercase tracking-wider block mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              {!isLogin && authForm.password.length > 0 && (
                <div className="mt-2.5 p-3.5 rounded-2xl bg-secondary/20 border border-border/40 text-3xs space-y-1.5 font-semibold text-plum">
                  <p className="font-bold text-plum/80 uppercase tracking-wider mb-1">Password Requirements:</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full transition-colors ${authForm.password.length >= 8 ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                      <span className={authForm.password.length >= 8 ? "text-green-700" : "text-muted-foreground"}>Min 8 characters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full transition-colors ${/[A-Z]/.test(authForm.password) ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                      <span className={/[A-Z]/.test(authForm.password) ? "text-green-700" : "text-muted-foreground"}>1 Uppercase (A-Z)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full transition-colors ${/[a-z]/.test(authForm.password) ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                      <span className={/[a-z]/.test(authForm.password) ? "text-green-700" : "text-muted-foreground"}>1 Lowercase (a-z)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full transition-colors ${/\d/.test(authForm.password) ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                      <span className={/\d/.test(authForm.password) ? "text-green-700" : "text-muted-foreground"}>1 Number (0-9)</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <span className={`h-1.5 w-1.5 rounded-full transition-colors ${/[@$!%*?&]/.test(authForm.password) ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                      <span className={/[@$!%*?&]/.test(authForm.password) ? "text-green-700" : "text-muted-foreground"}>1 Special symbol (@$!%*?&)</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-full bg-gradient-primary py-3.5 text-sm font-semibold text-white shadow-soft hover:shadow-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> {isLogin ? "Verifying..." : "Creating Account..."}
                  </>
                ) : (
                  isLogin ? "Sign In" : "Sign Up & Begin"
                )}
              </button>
            </form>

            <div className="flex items-center gap-1.5 justify-center text-2xs text-muted-foreground mt-6 font-semibold">
              <Shield className="h-3 w-3" /> 256-bit encrypted data sync
            </div>
          </motion.div>
        </div>
      ) : user && !user.isVerified ? (
        /* ================= EMAIL VERIFICATION VIEW ================= */
        <div className="mx-auto max-w-md px-5 py-16 flex flex-col justify-center min-h-[75vh]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-card p-8 shadow-glow"
          >
            <div className="text-center mb-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-plum/10 text-plum mx-auto mb-3 shadow-soft">
                <Shield className="h-6 w-6" />
              </span>
              <h1 className="font-display text-2xl font-bold text-plum">Verify your Email</h1>
              <p className="text-xs text-muted-foreground mt-2">
                We sent a 6-digit confirmation code to <strong className="text-plum font-semibold">{user.email}</strong>.
              </p>
            </div>

            {verificationError && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3.5 flex items-start gap-2.5 text-xs text-red-600 font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{verificationError}</span>
              </div>
            )}

            {resendSuccessMessage && (
              <div className="mb-4 rounded-xl bg-green-50 border border-green-100 p-3.5 flex items-start gap-2.5 text-xs text-green-600 font-semibold">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
                <span>{resendSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="text-2xs font-bold text-plum uppercase tracking-wider block mb-1.5 text-center">Verification Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-lg tracking-[8px] font-mono rounded-xl border border-input bg-background px-3.5 py-3 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={verificationLoading || verificationCode.length !== 6}
                className="w-full rounded-full bg-gradient-primary py-3.5 text-sm font-semibold text-white shadow-soft hover:shadow-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {verificationLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  "Verify Account"
                )}
              </button>
            </form>

            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={handleResendCode}
                disabled={resendLoading || resendCooldown > 0}
                className="text-xs text-primary font-bold hover:underline transition-all disabled:text-muted-foreground disabled:no-underline text-center"
              >
                {resendLoading 
                  ? "Sending code..." 
                  : resendCooldown > 0 
                    ? `Resend Code in ${resendCooldown}s` 
                    : "Resend Verification Code"}
              </button>
              
              <button
                onClick={handleLogout}
                className="text-xs text-muted-foreground hover:text-plum font-semibold transition-all mt-2 text-center"
              >
                Sign Out / Use Another Account
              </button>
            </div>

            {devCode && (
              <div className="mt-5 rounded-xl bg-teal-50 border border-teal-100 p-3.5 text-center text-xs text-teal-700 font-semibold">
                <Sparkles className="h-4 w-4 inline mr-1.5 align-text-bottom text-teal-500" />
                Dev Mode Code: <span className="font-mono text-sm tracking-widest bg-white px-2 py-0.5 rounded border border-teal-200">{devCode}</span>
              </div>
            )}
          </motion.div>
        </div>
      ) : (
        /* ================= TRACKER DASHBOARD VIEW ================= */
        <div className="mx-auto max-w-6xl px-5 py-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Wellness Suite</span>
              <h1 className="font-display text-4xl font-semibold text-plum mt-1">Hello, {user?.username || "Jane"} 🌸</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("cycle")}
                className={`rounded-full px-5 py-2.5 text-xs font-bold shadow-soft transition-all flex items-center gap-1.5 ${
                  activeTab === "cycle" ? "bg-gradient-primary text-white scale-102" : "bg-card border border-border hover:bg-secondary text-plum"
                }`}
              >
                <Calendar className="h-4 w-4" /> Cycle Logger
              </button>
              <button
                onClick={() => setActiveTab("mood")}
                className={`rounded-full px-5 py-2.5 text-xs font-bold shadow-soft transition-all flex items-center gap-1.5 ${
                  activeTab === "mood" ? "bg-gradient-primary text-white scale-102" : "bg-card border border-border hover:bg-secondary text-plum"
                }`}
              >
                <Smile className="h-4 w-4" /> Mood Logger
              </button>
              <a
                href="/ai"
                className="rounded-full bg-teal-50 border border-teal-100 px-5 py-2.5 text-xs font-bold hover:bg-teal-100 text-teal-700 shadow-soft transition-all flex items-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" /> AI Chat
              </a>
            </div>
          </motion.div>

          {/* Quick Metrics Grid */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {/* Cycle Status Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 h-20 w-20 rounded-full bg-rose-50/50 flex items-center justify-center text-rose-300">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Next Period</h3>
              <p className="font-display text-3xl font-bold text-plum mt-3">{cycleStatus.daysLeft}</p>
              <p className="text-2xs text-muted-foreground font-semibold mt-1">Predicted Date: {cycleStatus.dateStr}</p>
            </div>

            {/* Last Logged Mood */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 h-20 w-20 rounded-full bg-purple-50/50 flex items-center justify-center text-purple-300">
                <Smile className="h-8 w-8" />
              </div>
              <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Today's Energy</h3>
              <p className="font-display text-3xl font-bold text-plum mt-3">
                {moodLogs.length > 0 ? (
                  <>
                    <span className="mr-1.5">{MOOD_EMOJIS.find(x => x.score === moodLogs[0].score)?.emoji}</span>
                    <span>{MOOD_EMOJIS.find(x => x.score === moodLogs[0].score)?.label}</span>
                  </>
                ) : (
                  "Not logged yet"
                )}
              </p>
              <p className="text-2xs text-muted-foreground font-semibold mt-1">
                {moodLogs.length > 0 ? `Logged ${new Date(moodLogs[0].createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Check in to log emotions"}
              </p>
            </div>

            {/* Health Checklist quick stat */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:col-span-2 md:col-span-1 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 h-20 w-20 rounded-full bg-teal-50/50 flex items-center justify-center text-teal-300">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Total Check-Ins</h3>
              <p className="font-display text-3xl font-bold text-plum mt-3">{moodLogs.length + cycleLogs.length} logs</p>
              <p className="text-2xs text-muted-foreground font-semibold mt-1">Excellent job keeping consistent! 🌸</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* Left Column: Interactive Logs Form */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === "cycle" ? (
                  /* Menstrual Cycle Logger Card */
                  <motion.div
                    key="cycleForm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft"
                  >
                    <h2 className="font-display text-2xl font-bold text-plum mb-1 flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-primary" /> Menstrual Period Logger
                    </h2>
                    <p className="text-xs text-muted-foreground mb-6 font-medium">Log the start date of your flow and physical symptoms to update future predictions.</p>
                    
                    <form onSubmit={handleLogCycle} className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="text-2xs uppercase tracking-wider font-bold text-plum block mb-1">Start Date</label>
                          <input
                            type="date"
                            max={todayStr}
                            value={cycleInput.startDate}
                            onChange={(e) => setCycleInput({ ...cycleInput, startDate: e.target.value })}
                            className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-2xs uppercase tracking-wider font-bold text-plum block mb-1">Bleeding Days ({cycleInput.duration})</label>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={cycleInput.duration}
                            onChange={(e) => setCycleInput({ ...cycleInput, duration: parseInt(e.target.value) })}
                            className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer mt-3"
                          />
                        </div>
                        <div>
                          <label className="text-2xs uppercase tracking-wider font-bold text-plum block mb-1">Cycle Length ({cycleInput.cycleLength} days)</label>
                          <input
                            type="range"
                            min={20}
                            max={45}
                            value={cycleInput.cycleLength}
                            onChange={(e) => setCycleInput({ ...cycleInput, cycleLength: parseInt(e.target.value) })}
                            className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer mt-3"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs uppercase tracking-wider font-bold text-plum block mb-2">Check Physical Symptoms</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {SYMPTOMS.map(s => {
                            const selected = cycleInput.symptoms.includes(s);
                            return (
                              <button
                                type="button"
                                key={s}
                                onClick={() => toggleSymptom(s, cycleInput.symptoms, (v) => setCycleInput({ ...cycleInput, symptoms: v }))}
                                className={`rounded-xl py-2 px-3 text-xs font-semibold border transition-all text-center ${
                                  selected 
                                    ? "bg-rose-50 border-primary text-primary" 
                                    : "bg-background border-border hover:bg-secondary/40 text-muted-foreground"
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={savingLog}
                        className="rounded-full bg-gradient-primary px-6 py-3 text-xs font-bold text-white shadow-soft hover:shadow-glow hover:scale-102 transition-all flex items-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" /> Save Period Entry
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  /* Emotional Mood Logger Card */
                  <motion.div
                    key="moodForm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft"
                  >
                    <h2 className="font-display text-2xl font-bold text-plum mb-1 flex items-center gap-2">
                      <Smile className="h-6 w-6 text-primary" /> Emotional Mood Journal
                    </h2>
                    <p className="text-xs text-muted-foreground mb-6 font-medium">Record how you're feeling right now, write optional private journal thoughts, and list symptoms.</p>
                    
                    <form onSubmit={handleLogMood} className="space-y-5">
                      <div>
                        <label className="text-2xs uppercase tracking-wider font-bold text-plum block mb-3">How do you feel today?</label>
                        <div className="flex items-center justify-around bg-secondary/35 border border-border/40 p-4 rounded-2xl">
                          {MOOD_EMOJIS.map(m => (
                            <button
                              type="button"
                              key={m.score}
                              onClick={() => setMoodInput({ ...moodInput, score: m.score })}
                              className={`flex flex-col items-center gap-1.5 transition-transform ${
                                moodInput.score === m.score ? "scale-125" : "opacity-60 hover:opacity-100"
                              }`}
                            >
                              <span className="text-3xl select-none">{m.emoji}</span>
                              <span className="text-3xs font-bold text-plum">{m.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs uppercase tracking-wider font-bold text-plum block mb-1">Journal Note (Private)</label>
                        <textarea
                          rows={2}
                          value={moodInput.note}
                          onChange={(e) => setMoodInput({ ...moodInput, note: e.target.value })}
                          placeholder="Write down any emotional wave, stress triggers, or things you're grateful for today..."
                          className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-2xs uppercase tracking-wider font-bold text-plum block mb-2">Logged Physical Symptoms</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {SYMPTOMS.map(s => {
                            const selected = moodInput.symptoms.includes(s);
                            return (
                              <button
                                type="button"
                                key={s}
                                onClick={() => toggleSymptom(s, moodInput.symptoms, (v) => setMoodInput({ ...moodInput, symptoms: v }))}
                                className={`rounded-xl py-2 px-3 text-xs font-semibold border transition-all text-center ${
                                  selected 
                                    ? "bg-purple-50 border-primary text-primary" 
                                    : "bg-background border-border hover:bg-secondary/40 text-muted-foreground"
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={savingLog}
                        className="rounded-full bg-gradient-primary px-6 py-3 text-xs font-bold text-white shadow-soft hover:shadow-glow hover:scale-102 transition-all flex items-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" /> Save Journal Entry
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic Mood History Graph Card */}
              {moodLogs.length > 0 && (
                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="font-display text-lg font-bold text-plum mb-4">Mood Trends Graph</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#b8586c" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#b8586c" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebdcd9" />
                        <XAxis dataKey="date" tick={{ fill: '#7c636c', fontSize: 10 }} axisLine={{ stroke: '#ebdcd9' }} />
                        <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: '#7c636c', fontSize: 10 }} axisLine={{ stroke: '#ebdcd9' }} />
                        <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #ebdcd9", fontSize: "12px" }} />
                        <Area type="monotone" dataKey="score" stroke="#b8586c" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" name="Mood Score" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Historical Logs Lists */}
            <div className="space-y-6">
              {/* Menstrual Logs List */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <h3 className="font-display text-lg font-bold text-plum mb-4 flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Logged Periods</h3>
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {cycleLogs.length === 0 ? (
                    <div className="text-center py-10 text-xs text-muted-foreground font-semibold">No period logs logged.</div>
                  ) : (
                    cycleLogs.map((log) => (
                      <div key={log._id || log.id} className="border-b border-border/40 pb-3 flex flex-col gap-1 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-plum">
                            {new Date(log.startDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <span className="bg-rose-50 border border-primary/20 text-primary text-3xs font-bold px-2 py-0.5 rounded-full">
                            {log.duration} Flow Days
                          </span>
                        </div>
                        {log.symptoms && log.symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {log.symptoms.map(s => (
                              <span key={s} className="bg-secondary text-plum text-3xs font-semibold px-2 py-0.5 rounded-full">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Mood Notes History List */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <h3 className="font-display text-lg font-bold text-plum mb-4 flex items-center gap-1.5"><Smile className="h-4 w-4" /> Mood History & Notes</h3>
                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                  {moodLogs.length === 0 ? (
                    <div className="text-center py-10 text-xs text-muted-foreground font-semibold">No mood journal logs yet.</div>
                  ) : (
                    moodLogs.map((log) => (
                      <div key={log._id || log.id} className="border-b border-border/40 pb-3.5 flex items-start gap-2.5 last:border-b-0 last:pb-0">
                        <span className="text-2xl select-none mt-0.5 shrink-0">
                          {MOOD_EMOJIS.find(x => x.score === log.score)?.emoji}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-plum">
                              {MOOD_EMOJIS.find(x => x.score === log.score)?.label} Energy
                            </span>
                            <span className="text-3xs text-muted-foreground font-semibold">
                              {new Date(log.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                            </span>
                          </div>
                          {log.note && (
                            <p className="text-2xs text-muted-foreground mt-1 bg-muted/30 p-2 rounded-lg leading-relaxed">{log.note}</p>
                          )}
                          {log.symptoms && log.symptoms.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {log.symptoms.map(s => (
                                <span key={s} className="bg-secondary text-plum text-3xs font-semibold px-2 py-0.5 rounded-full">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />

      {/* Cute Celebratory Modal Popup */}
      <AnimatePresence>
        {cutePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-plum/45 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl border border-primary/20 bg-white p-8 shadow-glow text-center overflow-hidden"
            >
              {/* Decorative top pink circle */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-primary" />
              
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-4xl mx-auto mb-4 shadow-soft select-none animate-bounce">
                {cutePopup.icon}
              </span>
              
              <h3 className="font-display text-xl font-bold text-plum">{cutePopup.title}</h3>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed font-semibold">
                {cutePopup.message}
              </p>
              
              <button
                onClick={() => setCutePopup(null)}
                className="mt-6 w-full rounded-full bg-gradient-primary py-3 text-xs font-bold text-white shadow-soft hover:shadow-glow hover:scale-[1.02] active:scale-95 transition-all"
              >
                Wonderful, thank you 💗
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
