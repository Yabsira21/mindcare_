// components/GroupChat.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Hash,
  Send,
  Users,
  Pin,
  Star,
  Flag,
  MoreVertical,
  MessageCircle, // Add this import
} from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { useLanguage } from "../contexts/LanguageContext";

interface Message {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isPinned?: boolean;
  replies?: number;
}

interface Channel {
  id: string;
  name: string;
  icon: string;
  unread?: number;
  description?: string;
}

export default function GroupChat() {
  const { user } = useUser();
  const { translate } = useLanguage();
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const channels: Channel[] = [
    {
      id: "Anxiety",
      name: "Anxiety",
      icon: "#",
      unread: 3,
      description: "Anxiety discussions",
    },
    {
      id: "attacker",
      name: "attacker",
      icon: "⚔️",
      description: "Security discussions",
    },
    { id: "wait", name: "wait", icon: "⏳", description: "Waiting room" },
    { id: "hello", name: "hello", icon: "👋", description: "Introductions" },
    {
      id: "learning-lounge",
      name: "learning-lounge",
      icon: "📚",
      description: "Learning resources",
    },
    {
      id: "feedback-loop",
      name: "feedback-loop",
      icon: "🔄",
      description: "Feedback & improvements",
    },
    {
      id: "finance-corner",
      name: "finance-corner",
      icon: "💰",
      description: "Financial discussions",
    },
    {
      id: "engineering",
      name: "engineering",
      icon: "🔧",
      description: "Tech & engineering",
    },
    {
      id: "music-lounge",
      name: "music-lounge",
      icon: "🎵",
      description: "Music sharing",
    },
    {
      id: "sponsor-talks",
      name: "sponsor-talks",
      icon: "🎯",
      description: "Sponsor discussions",
    },
    {
      id: "campfire",
      name: "campfire",
      icon: "🔥",
      description: "Casual chats",
    },
    {
      id: "announcements",
      name: "announcements",
      icon: "📢",
      description: "Important updates",
    },
  ];

  const members = [
    {
      name: "Jan Marshal",
      email: "info@teamflow.com",
      avatar: "JM",
      role: "admin",
    },
    {
      name: "Jan Marshal",
      email: "info@teamflow.com",
      avatar: "JM",
      role: "member",
    },
    {
      name: "John Fisher",
      email: "info@teamflow.com",
      avatar: "JF",
      role: "member",
    },
    {
      name: "Nata Mar",
      email: "info@teamflow.com",
      avatar: "NM",
      role: "member",
    },
  ];

  // Sample messages
  const sampleMessages: Record<string, Message[]> = {
    general: [
      {
        id: "1",
        author: "Jan Marshal",
        avatar: "JM",
        content:
          "Hmm, that's not good. Did you check if the backend API is returning the expected data?",
        timestamp: new Date(2024, 9, 11, 13, 37),
        replies: 3,
      },
      {
        id: "2",
        author: "Jan Marshal",
        avatar: "JM",
        content:
          "Yeah, I tested it in Postman and the API is fine. Seems like the issue is on the frontend.",
        timestamp: new Date(2024, 9, 11, 13, 37),
        replies: 2,
      },
      {
        id: "3",
        author: "John Fisher",
        avatar: "JF",
        content:
          "Could it be caching issue? Sometimes the frontend doesn't pick up the latest data.",
        timestamp: new Date(2024, 9, 11, 13, 38),
        replies: 1,
      },
      {
        id: "4",
        author: "Jan Marshal",
        avatar: "JM",
        content:
          "Good thought — I cleared the cache, but the problem persists.",
        timestamp: new Date(2024, 9, 11, 13, 39),
        replies: 0,
      },
      {
        id: "5",
        author: "Nata Mar",
        avatar: "NM",
        content:
          "Hey there! 👋 Have you checked the network tab? Sometimes CORS issues can cause this.",
        timestamp: new Date(2024, 9, 11, 15, 1),
        replies: 2,
      },
      {
        id: "6",
        author: "Nata Mar",
        avatar: "NM",
        content:
          "Also, make sure your environment variables are set correctly for the API endpoint.",
        timestamp: new Date(2024, 9, 11, 15, 2),
        replies: 0,
      },
    ],
    engineering: [
      {
        id: "eng1",
        author: "John Fisher",
        avatar: "JF",
        content: "Has anyone tried the new React 19 features?",
        timestamp: new Date(2024, 9, 11, 14, 30),
        replies: 5,
      },
    ],
  };

  useEffect(() => {
    // Load messages for selected channel
    setMessages(sampleMessages[selectedChannel] || []);
    scrollToBottom();
  }, [selectedChannel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      author: user.profile.name || "Current User",
      avatar: user.profile.name?.charAt(0) || "U",
      content: newMessage,
      timestamp: new Date(),
      replies: 0,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    scrollToBottom();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] glass-card overflow-hidden">
      {/* Left Sidebar - Channels */}
      <div className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Groups
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {channels.map((channel) => (
            <motion.button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`w-full px-4 py-2 text-left transition-all duration-200 flex items-center justify-between group ${
                selectedChannel === channel.id
                  ? "bg-white/10 border-l-2 border-blue-400"
                  : "hover:bg-white/5"
              }`}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-lg">{channel.icon}</span>
                <span className="text-white/80 text-sm">#{channel.name}</span>
              </div>
              {channel.unread && channel.unread > 0 && (
                <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {channel.unread}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Members Section */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors w-full"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm">Members ({members.length})</span>
          </button>

          <AnimatePresence>
            {showMembers && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {members.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-white/80 text-xs">{member.name}</p>
                      <p className="text-white/40 text-xs">{member.email}</p>
                    </div>
                    {member.role === "admin" && (
                      <Star className="w-3 h-3 text-yellow-400" />
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold flex items-center gap-2">
              <span className="text-white/60">#</span>
              {selectedChannel}
            </h2>
            <p className="text-white/40 text-sm">
              {channels.find((c) => c.id === selectedChannel)?.description}
            </p>
          </div>
          <button className="text-white/60 hover:text-white/90 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Messages - Reverse Scroll (newest at bottom) */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          <div ref={messagesEndRef} />
          {[...messages].reverse().map((message, index) => {
            const prevMessage =
              index > 0 ? messages[messages.length - index] : null;
            const showDate =
              !prevMessage ||
              formatDate(message.timestamp) !==
                formatDate(prevMessage.timestamp);

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                {showDate && (
                  <div className="text-center my-4">
                    <span className="text-white/30 text-xs bg-white/5 px-3 py-1 rounded-full">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}

                <div className="flex gap-3 hover:bg-white/5 rounded-lg p-2 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {message.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm">
                        {message.author}
                      </span>
                      <span className="text-white/40 text-xs">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.isPinned && (
                        <Pin className="w-3 h-3 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-white/80 text-sm break-words">
                      {message.content}
                    </p>
                    {message.replies && message.replies > 0 && (
                      <button className="mt-2 text-white/40 text-xs hover:text-white/60 transition-colors flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {message.replies} replies
                      </button>
                    )}
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Flag className="w-4 h-4 text-white/40 hover:text-white/60" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message #${selectedChannel}...`}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height =
                    Math.min(target.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              className="gradient-button p-3 rounded-xl text-white"
              disabled={!newMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="mt-2 text-white/30 text-xs text-center">
            Press Enter to send, Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
