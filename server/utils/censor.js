/**
 * Filters out common profanities and offensive terms from text,
 * replacing them with asterisks matching the word length.
 * Uses dynamic leetspeak mapping and word boundaries to prevent bypasses
 * while avoiding false positives (e.g. "classic" -> "cl***ic" is avoided).
 * 
 * @param {string} text The input text to censor
 * @returns {string} The censored text
 */
export function censorText(text) {
  if (!text || typeof text !== "string") return "";
  
  let censored = text;
  
  // A comprehensive dictionary of profanities and offensive terms (enlarged)
  const bannedWords = [
    "fuck", "fucking", "fucker", "fucks",
    "shit", "shitting", "shitty", "shits",
    "bitch", "bitches", "bitching",
    "asshole", "assholes", "bastard", "bastards",
    "cunt", "cunts", "dick", "dicks",
    "pussy", "pussies", "slut", "sluts",
    "whore", "whores", "faggot", "nigger", "chink", "retard", "retards",
    "dumbass", "dumbasses", "crap", "moron", "morons", "idiot", "idiots",
    "abusive", "kill yourself", "kys", "motherfucker"
  ];
  
  bannedWords.forEach(word => {
    // Escape word to use in regex
    const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    
    // We want to match the word with common leetspeak substitutions
    const leetRegexStr = escaped
      .split("")
      .map(char => {
        if (char === "a") return "[a@4]";
        if (char === "i") return "[i!1]";
        if (char === "o") return "[o0]";
        if (char === "e") return "[e3]";
        if (char === "s") return "[s$5]";
        if (char === "u") return "[u*]";
        return char;
      })
      .join("");
      
    const regex = new RegExp(`\\b${leetRegexStr}\\b`, "gi");
    
    // Replace matching profanities in the ORIGINAL text
    censored = censored.replace(regex, (match) => "*".repeat(match.length));
  });
  
  // Catch simple asterisked words like "f*ck" or "s*it"
  const specialLeetWords = [
    { raw: "f\\.ck", replacement: "****" },
    { raw: "f\\*ck", replacement: "****" },
    { raw: "sh\\.t", replacement: "****" },
    { raw: "sh\\*t", replacement: "****" },
    { raw: "b\\.tch", replacement: "*****" },
    { raw: "b\\*tch", replacement: "*****" },
    { raw: "c\\.nt", replacement: "****" },
    { raw: "c\\*nt", replacement: "****" },
    { raw: "d\\.ck", replacement: "****" },
    { raw: "d\\*ck", replacement: "****" }
  ];
  
  specialLeetWords.forEach(({ raw, replacement }) => {
    const regex = new RegExp(`\\b${raw}\\b`, "gi");
    censored = censored.replace(regex, replacement);
  });
  
  return censored;
}
