import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  MessageCircle,
  Palette,
  Shield,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useUser } from "../contexts/UserContext";
import { useLanguage } from "../contexts/LanguageContext";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, checkUsageLimit } = useUser();
  const { translate } = useLanguage();

  const quickActions = [
    {
      id: "mood",
      title: translate("Track Mood", "Track Mood"),
      description: translate(
        "Log your current emotional state",
        "Log your current emotional state",
      ),
      icon: Brain,
      action: () => onNavigate("mood"),
    },
    {
      id: "art",
      title: translate("Art Therapy", "Art Therapy"),
      description: translate(
        "Create therapeutic art",
        "Create therapeutic art",
      ),
      icon: Palette,
      action: () => onNavigate("art"),
      usage: checkUsageLimit("artTherapy"),
    },
    {
      id: "chat",
      title: translate("TicTac Chat", "TicTac Chat"),
      description: translate("Connect with support", "Connect with support"),
      icon: MessageCircle,
      action: () => onNavigate("chat"),
      usage: checkUsageLimit("tictacMinutes"),
    },
  ];

  const moodChartData = user.moodHistory
    .slice(0, 7)
    .reverse()
    .map((entry) => ({
      // Translates dynamic week name codes if matched, or uses system short localized string fallback
      day: translate(
        new Date(entry.date).toLocaleDateString("en", { weekday: "short" }),
        new Date(entry.date).toLocaleDateString("en", { weekday: "short" }),
      ),
      mood: entry.mood,
      anxiety: 10 - entry.anxiety,
      energy: entry.energy,
    }));

  const aiInsights = [
    {
      type: "positive",
      title: translate(
        "Mood Improvement Detected",
        "Mood Improvement Detected",
      ),
      description: translate(
        "Your mood has improved by 23% over the past week. Keep up the great work!",
        "Your mood has improved by 23% over the past week. Keep up the great work!",
      ),
      confidence: 92,
    },
    {
      type: "suggestion",
      title: translate(
        "Art Therapy Recommendation",
        "Art Therapy Recommendation",
      ),
      description: translate(
        "Based on your stress patterns, watercolor painting might be particularly beneficial.",
        "Based on your stress patterns, watercolor painting might be particularly beneficial.",
      ),
      confidence: 87,
    },
    {
      type: "alert",
      title: translate("Sleep Pattern Notice", "Sleep Pattern Notice"),
      description: translate(
        "Your voice analysis suggests irregular sleep. Consider establishing a bedtime routine.",
        "Your voice analysis suggests irregular sleep. Consider establishing a bedtime routine.",
      ),
      confidence: 78,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 text-white font-sans antialiased animate-fade-in">
      {/* 1. Welcoming Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1.5 text-white">
            {translate("dashboard.welcome", "Good Morning!")}{" "}
            {user.profile.name}
          </h1>
          <p className="text-white/70 text-sm max-w-xl leading-relaxed">
            {/* Checked context translations fallback against 'dashboard.greetings' and 'dashbaord.greetings' configurations */}
            {translate(
              "dashboard.greetings",
              translate(
                "dashbaord.greetings",
                "How are you feeling today? Let's check in with your mental wellness.",
              ),
            )}
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/80 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Profile Active</span>
        </div>
      </header>

      {/* 2. Quick Actions Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">
            {translate("Quick Actions", "Quick Actions")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              onClick={action.action}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                </div>

                <h3 className="text-lg font-bold mb-1 tracking-tight">
                  {action.title}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed mb-6">
                  {action.description}
                </p>
              </div>

              {action.usage && (
                <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs">
                  <span className="text-white/50">
                    {action.usage.remaining === -1
                      ? "Unlimited Access"
                      : action.usage.remaining === 1
                        ? translate("1 remaining", "1 remaining")
                        : `${action.usage.remaining} ${translate("30 remaining", "remaining").replace("30 ", "")}`}
                  </span>
                  {!action.usage.allowed && (
                    <span className="text-amber-300 font-semibold tracking-wide text-[11px] uppercase">
                      Upgrade
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Analytics Grid Splitting */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Span: Weekly Trends Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {translate("Weekly Mood Trends", "Weekly Mood Trends")}
              </h3>
              <p className="text-xs text-white/50">
                Tracking emotional cycles over 7 entries
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={moodChartData}
                margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
                />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.85)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#moodGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right Span: Daily Diagnostic Metric Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {translate("Today's Wellness Score", "Today's Wellness Score")}
              </h3>
              <p className="text-xs text-white/50">Calculated matrix index</p>
            </div>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="#10b981"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${4.8 * 2 * Math.PI}`}
                  strokeDashoffset={`${4.8 * 2 * Math.PI * (1 - 0.78)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">
                  {translate("78", "78")}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  Score
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs border-t border-white/5 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60">{translate("Mood", "Mood")}</span>
              <span className="font-semibold text-blue-300">
                {translate("Good", "Good")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">
                {translate("Stress Level", "Stress Level")}
              </span>
              <span className="font-semibold text-amber-300">
                {translate("Moderate", "Moderate")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">
                {translate("Energy", "Energy")}
              </span>
              <span className="font-semibold text-emerald-300">
                {translate("High", "High")}
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. AI Insights Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">
            {translate("AI-Powered Insights", "AI-Powered Insights")}
          </h2>
          <span className="text-[11px] text-white/40 flex items-center bg-white/5 px-2 py-0.5 rounded border border-white/5">
            <Shield className="w-3 h-3 mr-1 text-sky-400" />
            {translate("Powered by Gemma 3", "Powered by Gemma 3")}
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
            >
              <div className="flex space-x-3.5 items-start">
                <span
                  className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                    insight.type === "positive"
                      ? "bg-emerald-400"
                      : insight.type === "alert"
                        ? "bg-amber-400"
                        : "bg-blue-400"
                  }`}
                />
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-white/70 max-w-3xl leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono text-white/40 block">
                  {
                    translate(
                      `Confidence: ${insight.confidence}%`,
                      "Confidence",
                    ).split(":")[0]
                  }
                </span>
                <span className="text-xs font-bold text-white/80">
                  {insight.confidence}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
