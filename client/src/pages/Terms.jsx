import { motion } from "framer-motion";
import { Scale, Heart, Users, ShieldAlert } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <SiteHeader />

        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-gradient-warm opacity-40" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-5 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary shadow-soft">
              <Scale className="h-3.5 w-3.5" />
              Terms of Use & Guidelines
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-plum">Community Guidelines & Terms</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
              Rules of engagement to maintain a safe, welcoming, and empowering environment for women everywhere.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 pb-20 space-y-12">
          {/* Values Grid */}
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Heart, title: "Respect & Kindness", text: "Treat every user with gentle care. We are here to support each other, not judge." },
              { icon: Users, title: "Zero Harassment", text: "We enforce strict censorship filters and rate limits to block malicious, aggressive, or spam behaviors." },
              { icon: ShieldAlert, title: "No Clinical Claims", text: "HealthHer is an educational space. Content is never a substitute for direct medical counseling." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-glow transition-all">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-primary shadow-sm mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-plum">{title}</h3>
                <p className="mt-2 text-2xs text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Legal and Etiquette Details */}
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 leading-relaxed text-xs">
            <div>
              <h2 className="font-display text-lg font-bold text-plum mb-2">1. Accepting Our Core Principles</h2>
              <p>
                By accessing HealthHer, you agree to respect the private and supportive nature of our tracker tools, resources, and community circles. We maintain the absolute right to block connections that violate these values or trigger anti-abuse protocols.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-plum mb-2">2. Chat Room Etiquette & Spam Abuse</h2>
              <p>
                Our real-time community chat enforces a strict **1.5-second anti-spam delay**. You agree not to use automation scripts or mashing techniques to flood channels. Messages that contain profanity, slurs, toxic language, or self-promotional ads are automatically censored or blocked before broadcast.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-plum mb-2">3. Important Medical Disclaimer</h2>
              <p>
                HealthHer, including the menstrual period predictions, articles, and AI Wellness Companion, is built for wellness support and informational purposes only. It is **not** a diagnostic utility or clinical treatment dashboard. If you experience abnormal severe bleeding, persistent cramps, or complex changes, please consult an accredited medical professional.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-plum mb-2">4. Platform Evolution</h2>
              <p>
                We continuously refine HealthHer to improve performance, add tracking features, and elevate user experience. We may tweak algorithms, update resources, and improve database performance periodically without notice.
              </p>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
