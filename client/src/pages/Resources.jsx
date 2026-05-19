import { useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ChevronDown, ChevronUp, Droplets, Brain, HeartPulse, Apple } from "lucide-react";

const TOPICS = [
  { icon: Droplets, title: "Cycle Basics", tag: "Cycle", desc: "Understanding flow parameters.", text: "Hormonal loops trigger the four phases (menstruation, follicular, ovulation, luteal). Tracking dates helps schedule rest schedules." },
  { icon: Brain, title: "Mental Wellness", tag: "Mind", desc: "Managing emotional spikes.", text: "Luteal drop in serotonin causes premenstrual changes. Engage in calm breathing and journaling to stabilize waves." },
  { icon: HeartPulse, title: "Intimate Care", tag: "Body", desc: "Gentle hygiene practices.", text: "Wash externally using water only to preserve healthy vaginal pH balances. Opt for loose cotton undergarments." },
  { icon: Apple, title: "Replenishing Diet", tag: "Food", desc: "Iron and vitamin minerals.", text: "Eat spinach, chickpeas, and seeds with vitamin C (like orange juice) to replace flow-related iron losses." }
];

export default function Resources() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-5 py-12">
        <h1 className="font-display text-4xl font-bold text-plum mb-2">Wellness Guides</h1>
        <p className="text-sm text-muted-foreground mb-8">Honest, reliable educational health articles for women.</p>

        <div className="grid gap-6 sm:grid-cols-2">
          {TOPICS.map((item, idx) => (
            <div key={idx} className="bg-white border border-border p-6 rounded-2xl shadow-soft">
              <span className="text-3xs bg-secondary text-plum px-2.5 py-1 rounded-full font-bold uppercase">{item.tag}</span>
              <h3 className="font-display text-xl font-bold text-plum mt-3 flex items-center gap-2"><item.icon className="h-5 w-5 text-primary" /> {item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1.5">{item.desc}</p>
              {openIdx === idx && <p className="text-xs text-foreground bg-secondary/25 p-3 rounded-xl mt-3 leading-relaxed">{item.text}</p>}
              <button className="text-xs text-primary font-bold mt-4 flex items-center gap-1" onClick={() => setOpenIdx(openIdx === idx ? null : idx)}>
                {openIdx === idx ? "Read Less" : "Read More"} {openIdx === idx ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}