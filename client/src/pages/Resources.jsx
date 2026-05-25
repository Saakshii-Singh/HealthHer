import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BookOpen, Droplets, Brain, Apple, Moon, HeartPulse, ChevronDown, ChevronUp } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
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

const topics = [
  { 
    icon: Droplets, 
    title: "Menstrual Health", 
    tag: "Cycle",
    text: "Understanding your cycle, managing premenstrual symptoms (PMS), tracking flow phases, and navigating different sanitary care products.",
    content: "A female's menstrual cycle is divided into four main phases: the menstrual phase, the follicular phase, the ovulatory phase, and the luteal phase. Hormones like estrogen and progesterone fluctuate, affecting energy levels, emotional state, and physical comfort. Tracking these symptoms can reveal patterns, making PMS management (like cycle syncing your nutrition and exercise) highly effective."
  },
  { 
    icon: Brain, 
    title: "Mental Wellness", 
    tag: "Mind",
    text: "Navigating stress, anxiety, hormonal mood swings, and practicing gentle self-compassion tools that actually fit into a busy day.",
    content: "Hormonal shifts throughout the cycle can influence key neurotransmitters like serotonin and dopamine, causing fluctuations in mood. During the luteal phase, many women experience a drop in energy and mood. Implementing soft mindfulness, setting gentle boundaries, and checking in with your emotional journal helps cultivate strong emotional resilience."
  },
  { 
    icon: HeartPulse, 
    title: "Intimate Care & Hygiene", 
    tag: "Body",
    text: "Trustworthy basics about vaginal health, intimate care routines, common symptoms, and guidelines on when to consult a specialist.",
    content: "Intimate health thrives on simple care. The vagina is a self-cleaning organ, and using harsh soaps can disrupt the natural pH level, leading to imbalances. Choose breathable cotton fabrics, stay hydrated, and practice gentle hygiene after workouts or sexual activity. Always consult a healthcare professional for persistent pain, itching, or abnormal discharge."
  },
  { 
    icon: Apple, 
    title: "Cycle-Phase Nutrition", 
    tag: "Food",
    text: "Essential vitamins, replenishing iron, calcium-rich diets, and intuitive food strategies tailored to feed your body in every phase.",
    content: "During your period, the body loses iron, making iron-rich foods (like spinach, lentils, and lean proteins) crucial. In the follicular phase, lighter, fresh foods support active metabolism. During the luteal and premenstrual phases, complex carbohydrates support serotonin levels to help curb high-sugar cravings and stabilize blood glucose levels."
  },
  { 
    icon: Moon, 
    title: "Sleep & Circadian Rhythm", 
    tag: "Rest",
    text: "Analyzing why sleep quality shifts with your hormone cycle, and establishing bedtime rituals to experience deep restorative rest.",
    content: "Progesterone acts as a natural relaxant, and its drop right before menstruation can sometimes trigger mild insomnia or restless sleep. Maintaining a regular sleep schedule, lowering room temperatures, limiting screens at night, and practicing calming breathing exercises can significantly improve slow-wave deep sleep quality."
  },
  { 
    icon: BookOpen, 
    title: "Preventive Care Checks", 
    tag: "Care",
    text: "A straightforward guide to self-checks, regular medical screenings, and the specific healthcare conversations worth starting early.",
    content: "Preventive wellness is empowering. Perform monthly breast self-exams a few days after your period ends when tissue is least tender. Schedule routine PAP tests and pelvic exams as recommended by your physician. Write down a list of queries to discuss openly with your gynecologist without any embarrassment."
  },
];

export default function Resources() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-warm opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Resources</p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl font-semibold leading-tight text-balance">
              Reliable wellness guides, without the noise.
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              Honest, practical, and science-backed articles on the topics women care about most, written and reviewed with gentle care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {topics.map(({ icon: Icon, title, text, tag, content }, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <motion.article 
                key={title} 
                variants={itemVariants}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-glow transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs rounded-full bg-secondary px-3 py-1 text-plum font-semibold">{tag}</span>
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-plum">{title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-4 pt-4 border-t border-border/60 text-xs md:text-sm text-foreground leading-relaxed bg-muted/40 p-3 rounded-lg"
                      >
                        {content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => toggleExpand(index)}
                  className="mt-5 text-sm font-semibold text-primary hover:text-plum transition-colors flex items-center gap-1 self-start"
                >
                  {isExpanded ? (
                    <>Show Less <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>Read Details <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      <SiteFooter />
    </div>
  );
}
