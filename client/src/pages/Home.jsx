import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Sparkles, ShieldCheck, MessagesSquare, BookOpenText, Flower2, ArrowRight, Activity, Calendar, Smile, BrainCircuit } from "lucide-react";
import heroImg from "../assets/hero.jpg";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 20, stiffness: 80 }
  }
};

const features = [
  { 
    icon: Calendar, 
    title: "Cycle Tracker", 
    text: "Understand your flow, track physical symptoms, and receive gentle, personalized predictions.",
    to: "/dashboard",
    color: "bg-rose-50 text-rose-500" 
  },
  { 
    icon: Smile, 
    title: "Mood Journal", 
    text: "Check in with your emotional self. Spot trends, record symptoms, and log hormonal waves.",
    to: "/dashboard",
    color: "bg-purple-50 text-purple-500"
  },
  { 
    icon: BrainCircuit, 
    title: "AI Wellness Companion", 
    text: "An empathetic companion ready to chat 24/7. Get instant answers about hygiene & health.",
    to: "/dashboard",
    color: "bg-teal-50 text-teal-500"
  },
  { 
    icon: MessagesSquare, 
    title: "Anonymous Community", 
    text: "Talk freely in a safe room with other women. No accounts, no tracing, pure support.",
    to: "/community",
    color: "bg-indigo-50 text-indigo-500"
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 md:pt-12">
        <div className="absolute inset-0 bg-gradient-warm opacity-60" aria-hidden />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blush/25 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-5 py-12 md:py-20 grid gap-12 md:grid-cols-2 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.span 
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full bg-card/85 backdrop-blur px-4 py-1.5 text-xs font-semibold text-muted-foreground border border-border shadow-soft"
            >
              <Flower2 className="h-3.5 w-3.5 text-primary" />
              Women-centric wellness, made simple
            </motion.span>
            
            <motion.h1 
              variants={itemVariants}
              className="mt-6 font-display text-5xl md:text-6xl font-semibold leading-[1.05]"
            >
              Your health,<br />
              <span className="text-primary">your community</span>,<br />
              your space.
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mt-5 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              HealthHer is a beautiful, safe space for cycle prediction, emotional check-ins, compassionate AI guidance, and honest community chats, completely private and anonymous.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/community" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-all hover:scale-[1.02]">
                Join Anonymous Chat <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-6 py-3.5 text-sm font-semibold hover:bg-secondary transition-all hover:scale-[1.02]">
                Open Tracker Hub
              </Link>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex items-center gap-6 text-xs text-muted-foreground font-medium"
            >
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> 100% Secure & Private</span>
              <span className="flex items-center gap-1.5"><Heart className="h-4 w-4 text-primary" fill="currentColor" /> Built with Care</span>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-primary blur-2xl opacity-20" aria-hidden />
            <img
              src={heroImg}
              alt="Diverse women supporting each other in wellness"
              className="relative rounded-3xl shadow-glow border border-border/40 w-full object-cover max-h-[450px]"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Core Pillars</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">Care that meets you where you are</h2>
          <p className="mt-4 text-muted-foreground">Tailored tracking tools, trusted science, and private peer circles.</p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map(({ icon: Icon, title, text, to, color }) => (
            <motion.div 
              key={title} 
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-glow transition-all"
            >
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${color} shadow-sm font-semibold`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-plum">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
              <Link to={to} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline group-hover:gap-1.5 transition-all">
                Access Feature <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Elegant CTA banner */}
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 md:p-14 text-primary-foreground shadow-glow"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="relative grid gap-6 md:grid-cols-[1.4fr_auto] items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
                A judgment-free place to ask, share, and feel heard.
              </h2>
              <p className="mt-3 max-w-xl text-primary-foreground/90 text-sm md:text-base leading-relaxed">
                Our anonymous community is open 24/7. No sign-up. Pick an alias and join the rooms that speak to you.
              </p>
            </div>
            <Link to="/community" className="inline-flex items-center gap-2 rounded-full bg-card text-plum px-6 py-3.5 text-sm font-semibold shadow-soft hover:scale-[1.03] active:scale-95 transition-transform text-center whitespace-nowrap">
              Enter Community Chat <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  );
}
