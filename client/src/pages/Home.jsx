import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShieldCheck, MessagesSquare, Flower2, ArrowRight, Calendar, Smile, BrainCircuit } from "lucide-react";
import heroImg from "../assets/hero.png";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden pt-12 pb-16">
        <div className="absolute inset-0 bg-gradient-warm opacity-60" />
        <div className="mx-auto max-w-6xl px-5 grid gap-12 md:grid-cols-2 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-3.5 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
              <Flower2 className="h-3.5 w-3.5 text-primary" /> Women-centric wellness
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.1] text-plum">
              Your health,<br />
              <span className="text-primary">your community</span>,<br />
              your space.
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed text-sm md:text-base">
              HealthHer offers cycle logs, daily emotional diaries, a conversational AI counselor, and a fully anonymous community circle.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/community" className="bg-gradient-primary text-white rounded-full px-6 py-3 text-sm font-bold shadow-soft hover:shadow-glow flex items-center gap-1">
                Anonymous Chat <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/dashboard" className="bg-white border border-border text-plum rounded-full px-6 py-3 text-sm font-bold hover:bg-secondary">
                Trackers Hub
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
            <img src={heroImg} alt="Women wellness" className="rounded-3xl shadow-glow border border-border/40 w-full" />
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="font-display text-3xl font-bold text-center text-plum mb-8">Pillars of Care</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Calendar, title: "Cycle Tracker", text: "Track flow dates, predict windows, and log symptoms." },
            { icon: Smile, title: "Mood Journal", text: "Spot emotional peaks & luteal drops using tracking statistics." },
            { icon: BrainCircuit, title: "AI Companion", text: "Ask health and care queries 24/7 in total privacy." },
            { icon: MessagesSquare, title: "Peer Circles", text: "Realtime anonymous chat circles without accounts." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-border p-6 rounded-2xl shadow-soft hover:shadow-glow transition-all">
              <item.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-bold text-plum text-lg">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}