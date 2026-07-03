import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BookOpen, Droplets, Brain, Apple, Moon, HeartPulse, ChevronDown, ChevronUp, Play, Pause, RotateCcw, Wind, Info, Sparkles } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const BREATH_PATTERNS = {
  box: {
    name: "Box Breathing",
    description: "Promotes deep relief, centering, and emotional balance.",
    phases: [
      { name: "Inhale", duration: 4, scale: 1.4, color: "border-teal-300 bg-teal-500/10 text-teal-700 shadow-[0_0_20px_rgba(20,184,166,0.2)]" },
      { name: "Hold", duration: 4, scale: 1.4, color: "border-amber-300 bg-amber-500/10 text-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.2)]" },
      { name: "Exhale", duration: 4, scale: 1.0, color: "border-rose-300 bg-rose-500/10 text-rose-700 shadow-[0_0_20px_rgba(244,63,94,0.2)]" },
      { name: "Hold", duration: 4, scale: 1.0, color: "border-indigo-300 bg-indigo-500/10 text-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.2)]" },
    ]
  },
  relief: {
    name: "4-7-8 Cramp & Anxiety Relief",
    description: "Soothes physical cramps and calms the nervous system.",
    phases: [
      { name: "Inhale", duration: 4, scale: 1.4, color: "border-teal-300 bg-teal-500/10 text-teal-700 shadow-[0_0_20px_rgba(20,184,166,0.2)]" },
      { name: "Hold", duration: 7, scale: 1.4, color: "border-amber-300 bg-amber-500/10 text-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.2)]" },
      { name: "Exhale", duration: 8, scale: 1.0, color: "border-rose-300 bg-rose-500/10 text-rose-700 shadow-[0_0_20px_rgba(244,63,94,0.2)]" },
    ]
  },
  balanced: {
    name: "Balanced Breathing",
    description: "Sustains calmness and restores a natural rhythm.",
    phases: [
      { name: "Inhale", duration: 4, scale: 1.4, color: "border-teal-300 bg-teal-500/10 text-teal-700 shadow-[0_0_20px_rgba(20,184,166,0.2)]" },
      { name: "Exhale", duration: 4, scale: 1.0, color: "border-rose-300 bg-rose-500/10 text-rose-700 shadow-[0_0_20px_rgba(244,63,94,0.2)]" },
    ]
  }
};


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
  const [selectedPattern, setSelectedPattern] = useState("box");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BREATH_PATTERNS.box.phases[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const pattern = BREATH_PATTERNS[selectedPattern];
  const currentPhase = pattern.phases[currentPhaseIdx];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const playChime = (frequency = 440, type = "sine", duration = 0.4) => {
    if (!isAudioEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context failed: ", e);
    }
  };

  // Timer effect counting down every second
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return -1; // trigger phase transition
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Phase transition effect
  useEffect(() => {
    if (timeLeft === -1) {
      const nextIdx = (currentPhaseIdx + 1) % pattern.phases.length;
      if (nextIdx === 0) {
        setCompletedCycles((c) => c + 1);
      }
      setCurrentPhaseIdx(nextIdx);
      const nextPhase = pattern.phases[nextIdx];
      setTimeLeft(nextPhase.duration);

      // Play specific chime based on phase
      if (nextPhase.name === "Inhale") {
        playChime(523.25, "sine", 0.5); // C5
      } else if (nextPhase.name === "Exhale") {
        playChime(329.63, "sine", 0.6); // E4
      } else {
        playChime(392.00, "sine", 0.3); // G4 (Hold)
      }
    }
  }, [timeLeft, currentPhaseIdx, pattern]);

  // Reset when pattern changes
  const handlePatternChange = (key) => {
    setSelectedPattern(key);
    setIsPlaying(false);
    setCurrentPhaseIdx(0);
    setTimeLeft(BREATH_PATTERNS[key].phases[0].duration);
    setCompletedCycles(0);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhaseIdx(0);
    setTimeLeft(pattern.phases[0].duration);
    setCompletedCycles(0);
  };

  const handleTogglePlay = () => {
    if (!isPlaying && isAudioEnabled) {
      // Warm up audio context on user interaction
      playChime(440, "sine", 0.1);
    }
    setIsPlaying(!isPlaying);
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

      {/* Mindfulness & Breathing Widget */}
      <section className="mx-auto max-w-6xl px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft overflow-hidden relative"
        >
          {/* Subtle background glow decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-warm rounded-full filter blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-200/20 rounded-full filter blur-3xl opacity-30 -ml-20 -mb-20 pointer-events-none" />
          
          <div className="relative grid md:grid-cols-[1fr_1.2fr] gap-8 items-center">
            
            {/* LEFT SECTION: Visual Breathing Circle */}
            <div className="flex flex-col items-center justify-center py-6 select-none">
              <div className="relative flex items-center justify-center w-64 h-64">
                
                {/* Outer pulsing ring for aesthetic depth */}
                <div className="absolute inset-0 rounded-full border border-border/40 animate-pulse scale-[1.05]" />
                
                {/* Inner animating circle using framer-motion */}
                <motion.div
                  animate={{
                    scale: isPlaying ? currentPhase.scale : 1.0,
                  }}
                  transition={{
                    duration: isPlaying ? currentPhase.duration : 1.5,
                    ease: "easeInOut",
                  }}
                  className={`w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-colors duration-500 ${
                    isPlaying ? currentPhase.color : "border-border bg-secondary/30 text-muted-foreground"
                  }`}
                >
                  <Wind className={`h-8 w-8 mb-2 ${isPlaying ? "animate-bounce" : "opacity-40"}`} />
                  <span className="font-display text-2xl font-bold tracking-tight">
                    {isPlaying ? currentPhase.name : "Ready"}
                  </span>
                  {isPlaying && (
                    <motion.span 
                      key={timeLeft}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.0, opacity: 1 }}
                      className="text-xs font-semibold mt-1"
                    >
                      {timeLeft}s
                    </motion.span>
                  )}
                </motion.div>
                
                {/* Progress Circle Border */}
                <svg className="absolute w-56 h-56 -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r="104"
                    className="stroke-border/20 fill-none"
                    strokeWidth="3"
                  />
                  {isPlaying && (
                    <motion.circle
                      cx="112"
                      cy="112"
                      r="104"
                      className="fill-none transition-all duration-1000 ease-linear"
                      strokeWidth="3"
                      strokeDasharray="653.4"
                      strokeDashoffset={653.4 - (653.4 * timeLeft) / currentPhase.duration}
                      stroke={
                        currentPhase.name === "Inhale"
                          ? "#0d9488"
                          : currentPhase.name === "Exhale"
                          ? "#b8586c"
                          : "#d97706"
                      }
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </div>

              {/* Progress feedback */}
              <div className="mt-6 flex items-center gap-6 text-xs font-bold text-plum">
                <span className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                  Cycles Completed: {completedCycles}
                </span>
                {isPlaying && (
                  <span className="text-muted-foreground font-normal">
                    Next: {pattern.phases[(currentPhaseIdx + 1) % pattern.phases.length].name}
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT SECTION: Controls & Info */}
            <div className="flex flex-col justify-between h-full space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-100 px-3 py-1 text-2xs font-semibold text-primary shadow-soft">
                  <Sparkles className="h-3 w-3" /> Mindfulness Corner
                </span>
                
                <h2 className="mt-3 text-3xl font-bold text-plum">
                  Guided Deep Breathing
                </h2>
                
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Deep rhythmic breathing regulates heart rate variability, decreases cramps by relaxing the abdominal wall, and helps soothe premenstrual anxiety or panic.
                </p>
              </div>

              {/* Pattern Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(BREATH_PATTERNS).map(([key, data]) => {
                  const active = selectedPattern === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handlePatternChange(key)}
                      className={`text-left p-3.5 rounded-2xl border transition-all ${
                        active
                          ? "border-primary bg-rose-50/20 shadow-soft"
                          : "border-border hover:border-primary/50 bg-white"
                      }`}
                    >
                      <h4 className="text-xs font-bold text-plum">{data.name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                        {data.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Control Buttons & Sound Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePlay}
                    className="flex items-center gap-2 rounded-full bg-gradient-primary text-white px-6 py-3 text-xs font-bold shadow-soft hover:shadow-glow hover:scale-[1.02] transition-all"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-3.5 w-3.5" /> Pause Session
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" /> Start Breathing
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    title="Reset"
                    className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-muted-foreground hover:text-plum hover:bg-secondary/40 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                {/* Optional Chime Sound Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAudioEnabled}
                    onChange={(e) => setIsAudioEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-9 h-5 bg-muted rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                  <span className="text-2xs font-bold text-muted-foreground flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" /> Audio Chimes
                  </span>
                </label>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

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
