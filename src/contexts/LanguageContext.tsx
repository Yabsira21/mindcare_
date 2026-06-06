import React, { createContext, useContext, useState, useEffect } from "react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface LanguageContextType {
  currentLanguage: Language;
  supportedLanguages: Language[];
  changeLanguage: (languageCode: string) => void;
  translate: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const supportedLanguages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹" },
];

// Translations object (in real app, this would be loaded from external files)
const translations: Record<string, Record<string, string>> = {
  en: {
    "app.title": "MindCare",
    "app.subtitle": "AI Mental Health Assistant",
    "dashboard.title": "Dashboard",
    "mood.title": "Mood Tracker",
    "art.title": "Art Therapy",
    "chat.title": "TicTac Chat",
    "companion.title": "AI Companion",
    "profile.title": "Profile",
    "subscription.title": "Subscription",
    "voice.listening": "Listening...",
    "voice.speak": "Speak to me",
    "mood.how_feeling": "How are you feeling today?",
    "crisis.support": "Crisis Support",
    "emergency.help": "Emergency Help Available",
    "dashboard.welcome": "Good Morning!",
    "dashbaord.greetings":
      "  How are you feeling today? Let's check in with your mental welness",
    "Quick Actions": "Quick Actions",
    "Track Mood": "Track Mood",
    "Log your current emotional state": "Log your current emotional state",
    "Art Therapy": "Art Therapy",
    "Create therapeutic art": "Create therapeutic art",
    "1 remaining": "1 remaining",
    "TicTac Chat": "TicTac Chat",
    "Connect with support": "Connect with support",
    "30 remaining": "30 remaining",
    "Weekly Mood Trends": "Weekly Mood Trends",
    Fri: "Fri",
    Sat: "Sat",
    Sun: "Sun",
    Mon: "Mon",
    "Today's Wellness Score": "Today's Wellness Score",
    "78": "78",
    Mood: "Mood",
    Good: "Good",
    "Stress Level": "Stress Level",
    Moderate: "Moderate",
    Energy: "Energy",
    High: "High",
    "AI-Powered Insights": "AI-Powered Insights",
    "Powered by Gemma 3": "Powered by Gemma 3",
    "Mood Improvement Detected": "Mood Improvement Detected",
    "Your mood has improved by 23% over the past week. Keep up the great work!":
      "Your mood has improved by 23% over the past week. Keep up the great work!",
    "Confidence: 92%": "Confidence: 92%",
    "Art Therapy Recommendation": "Art Therapy Recommendation",
    "Based on your stress patterns, watercolor painting might be particularly beneficial.":
      "Based on your stress patterns, watercolor painting might be particularly beneficial.",
    "Confidence: 87%": "Confidence: 87%",
    "Sleep Pattern Notice": "Sleep Pattern Notice",
    "Your voice analysis suggests irregular sleep. Consider establishing a bedtime routine.":
      "Your voice analysis suggests irregular sleep. Consider establishing a bedtime routine.",
    "Confidence: 78%": "Confidence: 78%",
    "Group Chat": "Group Chat",
    "How are you feeling today?": "How are you feeling today?",
    "Track your mood with AI-powered voice analysis":
      "Track your mood with AI-powered voice analysis",
    "Voice Mood Analysis": "Voice Mood Analysis",
    "Tell us about your day and let AI analyze your emotional state":
      "Tell us about your day and let AI analyze your emotional state",
    "Tap to start voice analysis": "Tap to start voice analysis",
    '💡 Try saying: "I\'m feeling great today!" or "I\'ve been really stressed lately"':
      '💡 Try saying: "I\'m feeling great today!" or "I\'ve been really stressed lately"',
    "Manual Mood Entry": "Manual Mood Entry",
    "Overall Mood": "Overall Mood",
    Okay: "Okay",
    "5/10": "5/10",
    "😢 Very Sad": "😢 Very Sad",
    "😐 Neutral": "😐 Neutral",
    "😊 Happy": "😊 Happy",
    "🌟 Euphoric": "🌟 Euphoric",
    "Anxiety Level": "Anxiety Level",
    // "Moderate": "Moderate",
    "😌 Calm": "😌 Calm",
    "😰 Very Anxious": "😰 Very Anxious",
    "Energy Level": "Energy Level",
    "😴 Exhausted": "😴 Exhausted",
    "⚡ Energetic": "⚡ Energetic",
    "Additional Notes (Optional)": "Additional Notes (Optional)",
    "Save Mood Entry": "Save Mood Entry",
  },
  am: {
    "app.title": "ምድር መረጃ",
    "app.subtitle": "የ አይ-አይ ምድር መረጃ",
    "dashboard.title": "ዳሽቦርድ",
    "mood.title": "ምድር መረጃ",
    "art.title": "እንግዳ መረጃ",
    "chat.title": "ቻት ተቀምጠው",
    "companion.title": "የ አይ-አይ ምድር መረጃ",
    "profile.title": "ፕሮፋይል",
    "subscription.title": "_subtitle",
    "voice.listening": "በመቀበል ላይ...",
    "voice.speak": "ለመ 말ስ",
    "mood.how_feeling": "እንደምን ነው?",
    "crisis.support": "የ ግዴታ መረጃ",
    "emergency.help": "የ እንዲሁም መረጃ",
    "dashboard.welcome": "እንደምን ነው!",
    "dashboard.greetings": "  እንደምን ነው? የ እንዲሁም መረጃ በመረጃ ተመልከት",
    "Quick Actions": "ፈጣን እርምጃዎች",
    "Track Mood": "ስሜትን መከታተል",
    "Log your current emotional state": "የአሁኑን የስሜት ሁኔታዎን ይመዝግቡ",
    "Art Therapy": "የስነ-ጥበብ ህክምና",
    "Create therapeutic art": "ፈውሰ-ጥበብ ይፍጠሩ",
    "1 remaining": "1 ቀርቷል",
    "TicTac Chat": "ቲክታክ ውይይት",
    "Connect with support": "ከድጋፍ ሰጪ ጋር ይገናኙ",
    "30 remaining": "30 ቀርቷል",
    "Weekly Mood Trends": "ሳምንታዊ የስሜት ሁኔታ አዝማሚያዎች",
    Fri: "አርብ",
    Sat: "ቅዳሜ",
    Sun: "እሁድ",
    Mon: "ሰኞ",
    "Today's Wellness Score": "የዛሬው የጤንነት ውጤት",
    "78": "78",
    Mood: "የስሜት ሁኔታ",
    Good: "ጥሩ",
    "Stress Level": "የጭንቀት ደረጃ",
    Moderate: "መካከለኛ",
    Energy: "ጉልበት",
    High: "ከፍተኛ",
    "AI-Powered Insights": "በአርቴፊሻል ኢንተለጀንስ የተደገፉ ግንዛቤዎች",
    "Powered by Gemma 3": "በጀማ 3 የተጎለበተ",
    "Mood Improvement Detected": "የስሜት መሻሻል ታይቷል",
    "Your mood has improved by 23% over the past week. Keep up the great work!":
      "ባለፈው ሳምንት የስሜትዎ ሁኔታ በ23% አሽቆልቁሏል። ይህንን ጥሩ ስራ ይቀጥሉበት!",
    "Confidence: 92%": "የእርግጠኝነት ደረጃ: 92%",
    "Art Therapy Recommendation": "የስነ-ጥበብ ህክምና ምክረ-ሀሳብ",
    "Based on your stress patterns, watercolor painting might be particularly beneficial.":
      "ከጭንቀት ሁኔታዎ በመነሳት፣ በውሃ ቀለሞች መሳል በተለይ ጠቃሚ ሊሆን ይችላል።",
    "Confidence: 87%": "የእርግጠኝነት ደረጃ: 87%",
    "Sleep Pattern Notice": "የእንቅልፍ ሁኔታ ማሳሰቢያ",
    "Your voice analysis suggests irregular sleep. Consider establishing a bedtime routine.":
      "የድምፅ ትንታኔዎ መደበኛ ያልሆነ እንቅልፍ እንዳለዎት ያሳያል። የመኝታ ጊዜ ልምድ ማውጣትን ያስቡበት።",
    "Confidence: 78%": "የእርግጠኝነት ደረጃ: 78%",
    "Group Chat": "ቡድን ውይይት",
    "How are you feeling today?": "ዛሬ ምን ይሰማዎታል?",
    "Track your mood with AI-powered voice analysis":
      "በአርቴፊሻል ኢንተለጀንስ በተደገፈ የድምፅ ትንተና ስሜትዎን ይከታተሉ",
    "Voice Mood Analysis": "የድምፅ ስሜት ትንተና",
    "Tell us about your day and let AI analyze your emotional state":
      "ስለ ውሎዎ ይንገሩን እና AI ስሜታዊ ሁኔታዎን እንዲተነትን ይፍቀዱ",
    "Tap to start voice analysis": "የድምፅ ትንተና ለመጀመር ይጫኑ",
    '💡 Try saying: "I\'m feeling great today!" or "I\'ve been really stressed lately"':
      '💡 እንዲህ ለማለት ይሞክሩ፡ "ዛሬ በጣም ደስ ብሎኛል!" ወይም "ሰሞኑን በጣም ተጨንቄአለሁ"',
    "Manual Mood Entry": "ስሜትን እራስዎ ማስገቢያ",
    "Overall Mood": "አጠቃላይ ስሜት",
    Okay: "ደህና",
    "5/10": "5/10",
    "😢 Very Sad": "😢 በጣም ያዘነ",
    "😐 Neutral": "😐 ገለልተኛ",
    "😊 Happy": "😊 ደስተኛ",
    "🌟 Euphoric": "🌟 በጣም የተደሰተ",
    "Anxiety Level": "የጭንቀት ደረጃ",
    // Moderate: "መካከለኛ",
    "😌 Calm": "😌 የተረጋጋ",
    "😰 Very Anxious": "😰 በጣም የተጨነቀ",
    "Energy Level": "የጉልበት ደረጃ",
    "😴 Exhausted": "😴 የደከመው",
    "⚡ Energetic": "⚡ ጉልበት ያለው",
    "Additional Notes (Optional)": "ተጨማሪ ማስታወሻዎች (አማራጭ)",
    "Save Mood Entry": "የስሜት መረጃውን አስቀምጥ",
  },
  // Add more languages as needed
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    supportedLanguages[0],
  );

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("preferred_language");
    if (savedLanguage) {
      const language = supportedLanguages.find(
        (lang) => lang.code === savedLanguage,
      );
      if (language) {
        setCurrentLanguage(language);
      }
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split("-")[0];
      const detectedLanguage = supportedLanguages.find(
        (lang) => lang.code === browserLang,
      );
      if (detectedLanguage) {
        setCurrentLanguage(detectedLanguage);
      }
    }
  }, []);

  const changeLanguage = (languageCode: string) => {
    const language = supportedLanguages.find(
      (lang) => lang.code === languageCode,
    );
    if (language) {
      setCurrentLanguage(language);
      localStorage.setItem("preferred_language", languageCode);

      // Update document direction for RTL languages
      document.documentElement.dir = language.rtl ? "rtl" : "ltr";
      document.documentElement.lang = languageCode;
    }
  };

  const translate = (key: string, fallback?: string): string => {
    const languageTranslations =
      translations[currentLanguage.code] || translations.en;
    return languageTranslations[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        supportedLanguages,
        changeLanguage,
        translate,
        isRTL: currentLanguage.rtl || false,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
