import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShieldCheck, Users, ArrowRight } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-warm opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-5 pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">About</p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl font-semibold leading-tight">
              Health care, the way it should feel.
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed text-balance">
              HealthHer was built because every woman deserves health information that's honest, accessible, and kind and a community that listens without judgment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy cards */}
      <section className="mx-auto max-w-4xl px-5 py-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-3"
        >
          {[
            { icon: Heart, title: "Made with care", text: "Every feature and article is built and curated with the actual needs of women in mind." },
            { icon: ShieldCheck, title: "Private by default", text: "We believe privacy is a right. Your cycles and moods are yours, and our chat is completely anonymous." },
            { icon: Users, title: "Community first", text: "Real conversations, mutual support, and validation, available 24/7 in a judgment-free space." },
          ].map(({ icon: Icon, title, text }) => (
            <motion.div 
              key={title} 
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-plum">{title}</h3>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission narrative */}
      <section className="mx-auto max-w-3xl px-5 py-10 space-y-6">
        <h2 className="font-display text-3xl font-semibold text-plum">Our mission</h2>
        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
          We're building HealthHer so that wellness, hygiene, and emotional support are no longer hard to find — or hard to talk about. From your first cycle to long-term intimate wellness, you deserve a space that is supportive, informative, and private.
        </p>
        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
          Today that means a unified tracking dashboard, supportive AI check-ins, and an anonymous room chat. Tomorrow it means even more: expert-guided medical roundtables, period product guides, and deeper analytics that put your health back in your own hands.
        </p>
        <div className="pt-4 pb-12">
          <Link to="/community" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow hover:scale-[1.02] transition-transform">
            Join the Chat Circle <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}