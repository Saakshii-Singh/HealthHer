import { motion } from "framer-motion";
import { Shield, Lock, EyeOff, CheckCircle } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <SiteHeader />

        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-gradient-warm opacity-40" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-5 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary shadow-soft">
              <Shield className="h-3.5 w-3.5" />
              Privacy Policy & Commitments
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold text-plum">Your Privacy is Sacred</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
              At HealthHer, we believe intimate health information deserves the highest grade of security. No trackers, no data sales, pure safety.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 pb-20 space-y-12">
          {/* Main Pillars */}
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Lock, title: "100% Encrypted", text: "Your cycle logs, physical symptoms, and emotional journals are fully encrypted under secure protocols." },
              { icon: EyeOff, title: "Zero Tracking Chat", text: "Our community chat requires zero accounts, zero IP tracing, and saves only alias identifiers." },
              { icon: CheckCircle, title: "Full Ownership", text: "Your personal data is strictly yours. You can wipe your account logs and traces instantly at any time." },
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

          {/* Detailed sections */}
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 leading-relaxed text-xs">
            <div>
              <h2 className="font-display text-lg font-bold text-plum mb-2">1. Data We Do Not Collect</h2>
              <p>
                We do not sell, rent, or monetize your physical symptoms, bleeding logs, intimate notes, or emotional state. Unlike commercial trackers that sell hormonal profiles to advertising networks, HealthHer stores database logs strictly for personalized predictions and your private journal history.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-plum mb-2">2. Anonymous Community Chat Privacy</h2>
              <p>
                To enter our peer chat rooms, you do not need to register with an email address or link a social profile. Every time you open the chat, a temporary floral alias is randomly generated. We do not store browser cookies or fingerprinting profiles that map your real identity to your community messages.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-plum mb-2">3. Empathetic AI Companion Data Handling</h2>
              <p>
                Conversations with the HealthHer Wellness Companion are designed to offer helpful educational answers. Questions sent to the AI are not shared with public search indexes or used to train commercial advertising algorithms.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-plum mb-2">4. Your Control and Wiping Data</h2>
              <p>
                Should you wish to delete your HealthHer account, you can log out or trigger a deletion. All stored records, including period dates and historical mood notes, will be purged from our database immediately.
              </p>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
