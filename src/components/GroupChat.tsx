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
  MessageCircle,
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

// Session storage key for messages persistence
const MESSAGES_STORAGE_KEY = 'groupchat_messages_cache';

// Helper to load persisted messages from sessionStorage
const loadPersistedMessages = (): Record<string, Message[]> => {
  try {
    const stored = sessionStorage.getItem(MESSAGES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      Object.keys(parsed).forEach(channelId => {
        parsed[channelId] = parsed[channelId].map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      });
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load messages from sessionStorage:', e);
  }
  return {};
};

// Helper to persist messages to sessionStorage
const persistMessages = (messagesCache: Record<string, Message[]>) => {
  try {
    sessionStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messagesCache));
  } catch (e) {
    console.warn('Failed to persist messages to sessionStorage:', e);
  }
};

// Initial sample messages for each channel
const initialSampleMessages: Record<string, Message[]> = {
  Anxiety: [
    {
      id: "anx1",
      author: "Jan Marshal",
      avatar: "JM",
      content: "Has anyone found good techniques for managing anxiety at work?",
      timestamp: new Date(2024, 9, 11, 10, 15),
      replies: 4,
    },
    {
      id: "anx2",
      author: "Nata Mar",
      avatar: "NM",
      content: "I've been trying the 5-4-3-2-1 grounding technique. It helps me during panic attacks!",
      timestamp: new Date(2024, 9, 11, 10, 23),
      replies: 2,
    },
  ],
  stress: [
    {
      id: "str1",
      author: "John Fisher",
      avatar: "JF",
      content: "Deadline stress is killing me. Anyone else?",
      timestamp: new Date(2024, 9, 11, 9, 45),
      replies: 3,
    },
    {
      id: "str2",
      author: "Jan Marshal",
      avatar: "JM",
      content: "Try breaking down tasks into smaller chunks. It helps reduce overwhelm!",
      timestamp: new Date(2024, 9, 11, 9, 52),
      replies: 1,
    },
  ],
  sleep: [
    {
      id: "slp1",
      author: "Nata Mar",
      avatar: "NM",
      content: "Any tips for falling asleep faster? I've been struggling lately 😴",
      timestamp: new Date(2024, 9, 10, 22, 30),
      replies: 5,
    },
  ],
  hello: [
    {
      id: "hl1",
      author: "Jan Marshal",
      avatar: "JM",
      content: "Welcome everyone! Feel free to introduce yourselves 👋",
      timestamp: new Date(2024, 9, 10, 9, 0),
      replies: 8,
    },
    {
      id: "hl2",
      author: "John Fisher",
      avatar: "JF",
      content: "Hi all! Happy to be here!",
      timestamp: new Date(2024, 9, 10, 9, 15),
      replies: 0,
    },
  ],
  "learning-lounge": [
    {
      id: "lrn1",
      author: "Jan Marshal",
      avatar: "JM",
      content: "Shared a new course on mindfulness. Check it out! 📚",
      timestamp: new Date(2024, 9, 9, 14, 0),
      replies: 2,
    },
  ],
  "feedback-loop": [
    {
      id: "fb1",
      author: "Nata Mar",
      avatar: "NM",
      content: "Love the new chat interface! Very clean design.",
      timestamp: new Date(2024, 9, 10, 16, 20),
      replies: 1,
    },
  ],
  "finance-corner": [
    {
      id: "fin1",
      author: "John Fisher",
      avatar: "JF",
      content: "Any recommendations for budget tracking apps? 💰",
      timestamp: new Date(2024, 9, 9, 11, 30),
      replies: 3,
    },
  ],
  fitness: [
    {
      id: "fit1",
      author: "Jan Marshal",
      avatar: "JM",
      content: "Morning workout routine sharing? 🔧💪",
      timestamp: new Date(2024, 9, 8, 8, 0),
      replies: 6,
    },
  ],
  announcements: [
    {
      id: "ann1",
      author: "System",
      avatar: "SYS",
      content: "📢 Welcome to the community! Please read the guidelines.",
      timestamp: new Date(2024, 9, 8, 0, 0),
      replies: 0,
      isPinned: true,
    },
  ],
};

export default function GroupChat() {
  const { user } = useUser();
  const { translate } = useLanguage();
  const [selectedChannel, setSelectedChannel] = useState("Anxiety");
  // Store messages per channel - this persists across channel switches
  const [channelMessages, setChannelMessages] = useState<Record<string, Message[]>>(() => {
    // Try to load from sessionStorage first
    const persisted = loadPersistedMessages();
    // Merge with initial messages (persisted overrides initial)
    const merged = { ...initialSampleMessages, ...persisted };
    // Ensure all channels from initialSampleMessages exist
    Object.keys(initialSampleMessages).forEach(channelId => {
      if (!merged[channelId]) {
        merged[channelId] = initialSampleMessages[channelId];
      }
    });
    return merged;
  });
  
  const [newMessage, setNewMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // Track if we should auto-scroll (new messages from current user)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const channels: Channel[] = [
    { id: "Anxiety", name: "Anxiety", icon: "#", unread: 0, description: "Anxiety discussions & support" },
    { id: "stress", name: "stress", icon: "⚔️", unread: 0, description: "Stress management conversations" },
    { id: "sleep", name: "sleep", icon: "⏳", unread: 0, description: "Sleep health and tips" },
    { id: "hello", name: "hello", icon: "👋", unread: 0, description: "Introductions & welcome" },
    { id: "learning-lounge", name: "learning-lounge", icon: "📚", unread: 0, description: "Learning resources & courses" },
    { id: "feedback-loop", name: "feedback-loop", icon: "🔄", unread: 0, description: "Feedback & improvements" },
    { id: "finance-corner", name: "finance-corner", icon: "💰", unread: 0, description: "Financial wellness discussions" },
    { id: "fitness", name: "fitness", icon: "🔧", unread: 0, description: "Workout and health tips" },
    { id: "announcements", name: "announcements", icon: "📢", unread: 0, description: "Important updates" },
  ];

  const members = [
    { name: "Jan Marshal", email: "info@teamflow.com", avatar: "JM", role: "admin" },
    { name: "Sarah Chen", email: "sarah@teamflow.com", avatar: "SC", role: "member" },
    { name: "John Fisher", email: "info@teamflow.com", avatar: "JF", role: "member" },
    { name: "Nata Mar", email: "info@teamflow.com", avatar: "NM", role: "member" },
    { name: "Alex Rivera", email: "alex@teamflow.com", avatar: "AR", role: "member" },
  ];

  // Persist messages to sessionStorage whenever they change
  useEffect(() => {
    persistMessages(channelMessages);
  }, [channelMessages]);

  // Scroll to bottom when messages change for current channel, but only if auto-scroll is enabled
  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [channelMessages[selectedChannel], shouldAutoScroll]);

  // Reset auto-scroll when user manually scrolls up
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      // If user is near bottom (within 100px), enable auto-scroll, otherwise disable
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isNearBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `${Date.now()}-${Math.random()}`,
      author: user?.profile?.name || "Current User",
      avatar: user?.profile?.name?.charAt(0) || "U",
      content: newMessage,
      timestamp: new Date(),
      replies: 0,
    };

    // Update messages for the selected channel
    setChannelMessages(prev => {
      const currentChannelMsgs = prev[selectedChannel] || [];
      const updated = {
        ...prev,
        [selectedChannel]: [...currentChannelMsgs, message]
      };
      return updated;
    });
    
    setNewMessage("");
    setShouldAutoScroll(true); // Enable auto-scroll after sending
    // Focus back on textarea after send
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      textarea?.focus();
    }, 0);
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

  // Get current channel messages
  const currentMessages = channelMessages[selectedChannel] || [];

  // Update unread counts (simplified - in real app would track read status)
  const getUnreadCount = (channelId: string) => {
    // For demo, just show 0 since we persist all messages as read
    // In a real app, you'd track which messages the user has seen
    return 0;
  };

  // Handle channel switch - mark as read (no-op for demo)
  const handleChannelSwitch = (channelId: string) => {
    setSelectedChannel(channelId);
    setShouldAutoScroll(true);
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
          {channels.map((channel) => {
            const unread = getUnreadCount(channel.id);
            return (
              <motion.button
                key={channel.id}
                onClick={() => handleChannelSwitch(channel.id)}
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
                {unread > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </motion.button>
            );
          })}
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
              {channels.find(c => c.id === selectedChannel)?.name || selectedChannel}
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
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          <div ref={messagesEndRef} />
          {[...currentMessages].reverse().map((message, index, reversedArray) => {
            const prevMessage = index > 0 ? reversedArray[index - 1] : null;
            const showDate =
              !prevMessage ||
              formatDate(message.timestamp) !== formatDate(prevMessage.timestamp);

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
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
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                    <p className="text-white/80 text-sm break-words whitespace-pre-wrap">
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
          
          {/* Empty state when no messages */}
          {currentMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="w-12 h-12 text-white/20 mb-3" />
              <p className="text-white/40">No messages yet</p>
              <p className="text-white/30 text-sm">Be the first to send a message!</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Message #${channels.find(c => c.id === selectedChannel)?.name || selectedChannel}...`}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              className="gradient-button p-3 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
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