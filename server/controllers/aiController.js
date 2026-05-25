// Node 18+ has global fetch!

// Local empathetic knowledge fallback
const KNOWLEDGE_BASE = [
  {
    keywords: ["cramp", "pain", "dysmenorrhea", "hurt", "ache"],
    response: "I hear you, cramps can be incredibly draining. 💗 Physically, they occur due to prostaglandins causing the uterus to contract. To ease them naturally:\n1. **Gentle Heat:** Place a warm heating pad or hot water bottle on your lower abdomen to relax uterine muscles.\n2. **Magnesium & Hydration:** Sip warm herbal teas (like chamomile or ginger) and consider magnesium-rich foods to help soothe muscle spasms.\n3. **Light Movement:** Soft stretching or yoga poses (like Child's Pose or Cat-Cow) can boost blood flow and release natural pain-relieving endorphins.\nIf the pain is severe and persistent, it's always wise to discuss it with a trusted doctor to rule out conditions like endometriosis."
  },
  {
    keywords: ["iron", "food", "nutrition", "eat", "diet", "spinach"],
    response: "During your period, your body loses iron through blood flow, which can leave you feeling fatigued or lightheaded. 🌸 Replenishing your stores is highly empowering:\n1. **Heme Iron (Easily Absorbed):** If you eat meat, lean poultry or fish are excellent choices.\n2. **Non-Heme Iron (Plant-Based):** Load up on dark leafy greens (spinach, kale), lentils, chickpeas, tofu, and pumpkin seeds.\n3. **Vitamin C Pairing:** Pair plant-based iron with Vitamin C (like squeezing lemon on spinach or eating bell peppers and oranges) to dramatically boost absorption!\n4. **Avoid Tannins:** Try not to drink black tea or coffee right after meals, as they can block iron absorption."
  },
  {
    keywords: ["anxious", "mood", "low", "sad", "pms", "pmdd", "cry", "hormone"],
    response: "Please be gentle with yourself right now. 🧘‍♀️ What you're feeling is valid and very common. During the luteal phase (the days leading up to your period), progesterone and estrogen drop sharply. This shift can impact serotonin, the chemical that regulates mood.\n- **Acknowledge & Release:** Allow yourself to rest without guilt. You don't have to be productive 100% of the time.\n- **Grounding Rituals:** Try the 5-4-3-2-1 sensory technique, or sit quietly with a warm cup of tea.\n- **Hydration & Rest:** Dehydration and lack of sleep amplify hormonal mood swings.\nIf these waves feel completely overwhelming every single month, it's worth logging them in your HealthHer dashboard and discussing PMDD (Premenstrual Dysphoric Disorder) with a empathetic healthcare provider."
  },
  {
    keywords: ["hygiene", "clean", "wash", "soap", "odor", "smell", "product"],
    response: "Intimate care is all about gentle simplicity. 💗 Here are the core guidelines to maintain a healthy, balanced microbiome:\n1. **Water is Best:** The vagina is self-cleaning. Wash only the outer vulva using warm water. Avoid douching or using scented body washes inside, as they strip healthy lactobacilli and cause infections like BV or yeast.\n2. **Breathable Fabrics:** Choose loose-fitting cotton underwear to allow airflow and reduce moisture build-up.\n3. **Product Rotation:** Change tampons or pads every 4-6 hours, and clean menstrual cups thoroughly with unscented soap.\n4. **Wipe Front-to-Back:** Always wipe front-to-back to prevent transferring unwanted bacteria.\nIntimate areas have a natural, unique scent. However, if you notice a strong fishy odor, itching, or thick discharge, it's a sign to consult a gynecologist."
  },
  {
    keywords: ["sleep", "insomnia", "tired", "rest", "night"],
    response: "Hormonal shifts can definitely disrupt your sleep cycle! 🌙 Right before your period, the drop in progesterone (which usually promotes sleep) can make it harder to settle down. Additionally, slight increases in core body temperature can cause restlessness.\n- **Cool Down:** Keep your bedroom slightly cooler than usual.\n- **Calming Rituals:** Try reading a physical book, taking a warm bath, or practicing deep diaphragmatic breathing.\n- **Magnesium:** Consuming pumpkin seeds, almonds, or taking a doctor-approved magnesium supplement can soothe the nervous system.\nTry to avoid heavy meals or screens at least an hour before bedtime to help protect your circadian rhythm."
  }
];

// Local response matcher helper
function getLocalFallbackResponse(message) {
  const msgLower = message.toLowerCase();
  
  // Find match
  const matched = KNOWLEDGE_BASE.find(k => 
    k.keywords.some(keyword => msgLower.includes(keyword))
  );

  if (matched) {
    return matched.response;
  }

  return "I appreciate you sharing that with me. 💗 Every wellness journey is unique. While I might not have a specific guide for that, remember that listening to your body and prioritizing rest, gentle nutrition, and healthy boundaries is always a great start. If you are experiencing physical discomfort or severe concerns, I highly encourage speaking to a kind healthcare provider who can give you personalized care.";
}

export async function generateCompanionResponse(req, res) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = apiKey && apiKey.trim() !== "" && apiKey !== "undefined";

  if (isKeyValid) {
    try {
      // Prompt engineering to guide the AI model to be highly empathetic and educational
      const systemInstruction = 
        "You are an empathetic, compassionate, and highly professional women's health and wellness assistant named HealthHer Companion. " +
        "You provide educational information about menstrual health, emotional wellbeing, sleep, intimate care, and hygiene in a judgment-free, warm, and supportive tone. " +
        "Always remind the user gently if they discuss severe symptoms that you are an educational companion, not a replacement for a medical doctor. " +
        "Keep responses structured, gentle, and warm. Use formatting like bullet points or emojis to make it pleasant to read.";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemInstruction}\n\nUser: ${message}` }] }]
          })
        }
      );

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return res.json({ response: data.candidates[0].content.parts[0].text });
      } else {
        throw new Error(data.error?.message || "Invalid response format from Gemini");
      }
    } catch (error) {
      console.error("Gemini API Error, falling back to local database:", error.message);
      const fallbackResponse = getLocalFallbackResponse(message);
      return res.json({ response: fallbackResponse });
    }
  }

  // Fallback to local empathetic matcher
  const fallbackResponse = getLocalFallbackResponse(message);
  return res.json({ response: fallbackResponse });
}
