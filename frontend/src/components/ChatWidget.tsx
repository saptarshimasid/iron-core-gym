"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: Date;
}

const quickPrompts = [
  "What is the weekly schedule?",
  "What are the membership plans?",
  "Who are the coaches?",
  "Tell me about the recovery facilities."
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "coach",
      text: "Welcome to the Iron Core Lab. I am your AI Strength Coach. Ask me anything about our workouts, schedules, coaches, or pricing.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMessageId,
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Connect to Express backend API
      const res = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: textToSend })
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with AI Coach");
      }

      const data = await res.json();

      const coachMsg: Message = {
        id: `coach-${Date.now()}`,
        sender: "coach",
        text: data.reply || "Sorry, I am having trouble connecting to the barbell racks right now. Please try again.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `coach-error-${Date.now()}`,
        sender: "coach",
        text: "Iron Core system offline. Please verify that the Express and Python services are running.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="w-[calc(100vw-32px)] sm:w-[350px] md:w-[400px] h-[500px] rounded-none glass-panel flex flex-col mb-4 overflow-hidden shadow-2xl border-primary-fixed/20"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Header */}
            <div className="bg-surface-container-high px-6 py-4 flex items-center justify-between border-b border-[#262626]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-primary-fixed/30 rounded-full animate-ping" />
                  <span className="material-symbols-outlined text-primary-fixed text-2xl relative z-10">smart_toy</span>
                </div>
                <div>
                  <h3 className="font-label-bold text-sm text-white uppercase tracking-wider">COACH ZEUS</h3>
                  <span className="text-[10px] text-primary-fixed uppercase font-bold tracking-widest">Active Coaching Agent</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-on-surface-variant hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4 bg-background/95">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <div
                    className={`px-4 py-3 text-sm ${
                      msg.sender === "user"
                        ? "bg-primary-fixed text-black font-body-md"
                        : "bg-surface-container border border-[#262626] text-on-surface"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-[#474746] mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 self-start bg-surface-container border border-[#262626] px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="px-6 py-3 bg-surface-container-lowest border-t border-[#262626] flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[10px] uppercase font-label-bold tracking-wider px-3 py-1.5 bg-surface-container border border-[#262626] text-on-surface-variant hover:border-primary-fixed hover:text-white transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 bg-surface-container-high border-t border-[#262626] flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
                placeholder="ASK ABOUT SCHEDULES, MEMBERSHIPS..."
                className="flex-grow bg-background border border-[#262626] text-white font-label-bold text-xs px-4 py-3 outline-none focus:border-primary-fixed transition-colors"
              />
              <button
                onClick={() => handleSendMessage(input)}
                className="bg-primary-fixed hover:bg-white text-black p-3 transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary-fixed text-black hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl flex items-center justify-center relative group"
        whileHover={{ rotate: 15 }}
      >
        <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
          {isOpen ? "close" : "sports_gymnastics"}
        </span>
        {/* Glow Element */}
        <span className="absolute -inset-1 border-2 border-primary-fixed/20 scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>
    </div>
  );
}
