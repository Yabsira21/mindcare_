import { motion, AnimatePresence } from "framer-motion";
import { Globe, Heart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useUser } from "../contexts/UserContext";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onCrisisAlert: () => void;
  onVoiceToggle: () => void;
}

export default function Header({
  currentView,
  onNavigate,
  onCrisisAlert,
  onVoiceToggle,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();
  const { currentLanguage, supportedLanguages, changeLanguage, translate } =
    useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    {
      id: "dashboard",
      label: translate("dashboard.title", "Dashboard"),
      icon: "🏠",
    },
    { id: "mood", label: translate("mood.title", "Mood Tracker"), icon: "😊" },
    { id: "art", label: translate("art.title", "Art Therapy"), icon: "🎨" },
    { id: "chat", label: translate("chat.title", "TicTac Chat"), icon: "💬" },
    {
      id: "groupchat",
      label: translate("Group Chat", "Group Chat"),
      icon: "👥",
    },
    {
      id: "companion",
      label: translate("companion.title", "AI Companion"),
      icon: "🤖",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "glass-header backdrop-blur-30 shadow-lg py-2"
          : "glass-header backdrop-blur-20 py-4"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Always Visible */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="gradient-button p-2 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                {translate("app.title", "MindCare")}
              </h1>
              <p className="text-xs text-white/70">
                {translate("app.subtitle", "AI Mental Health Assistant")}
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? "glass-button text-white shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Desktop Controls (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <motion.button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-2 glass-button p-2 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Globe className="w-5 h-5" />
                <span className="text-lg">{currentLanguage.flag}</span>
                <span className="text-sm">
                  {currentLanguage.code.toUpperCase()}
                </span>
              </motion.button>

              {showLanguageMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-64 glass-card max-h-96 overflow-y-auto z-50"
                >
                  <div className="p-2">
                    {supportedLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          changeLanguage(language.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-white/10 transition-colors ${
                          currentLanguage.code === language.code
                            ? "bg-white/20 text-white"
                            : "text-white/80"
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <div className="flex-1">
                          <div className="font-medium">{language.name}</div>
                          <div className="text-sm opacity-70">
                            {language.nativeName}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Subscription Tier */}
            <button
              onClick={() => onNavigate("subscription")}
              className={`px-3 py-1 rounded-full text-xs font-semibold glass-button ${
                user.profile.tier === "premium"
                  ? "text-orange-300"
                  : user.profile.tier === "professional"
                    ? "text-blue-300"
                    : "text-white/80"
              }`}
            >
              {user.profile.tier.toUpperCase()}
            </button>

            {/* User Avatar */}
            <motion.button
              onClick={() => onNavigate("profile")}
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={user.profile.avatar}
                alt={user.profile.name}
                className="w-8 h-8 rounded-full border-2 border-white/30"
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-white">
                  {user.profile.name}
                </p>
                <p className="text-xs text-white/60">
                  ID: {user.profile.id.slice(-6)}
                </p>
              </div>
            </motion.button>
          </div>

          {/* Mobile Menu Toggle Button (Only visible on mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="glass-button p-2 text-white rounded-lg"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/20 py-4"
            >
              <nav className="flex flex-col space-y-2 mb-4">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                      currentView === item.id
                        ? "glass-button text-white"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              <hr className="border-white/10 my-4" />

              {/* Mobile User Profile & Subscription Section */}
              <div className="px-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    onNavigate("profile");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 text-left"
                >
                  <img
                    src={user.profile.avatar}
                    alt={user.profile.name}
                    className="w-10 h-10 rounded-full border-2 border-white/30"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {user.profile.name}
                    </p>
                    <p className="text-xs text-white/60">
                      ID: {user.profile.id.slice(-6)}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate("subscription");
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold glass-button ${
                    user.profile.tier === "premium"
                      ? "text-orange-300"
                      : user.profile.tier === "professional"
                        ? "text-blue-300"
                        : "text-white/80"
                  }`}
                >
                  {user.profile.tier.toUpperCase()}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
