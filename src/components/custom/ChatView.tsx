import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Send, Link as LinkIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Message, MessageContext } from "@/context/MessageContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import ReactMarkdown from "react-markdown";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import axios from "axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import prompt from "@/constants/prompt";

// Add Prompt constant
const CHAT_PROMPT = `You are an AI assistant helping with code generation.`;

const ChatView = ({ sessionId }: { sessionId: Id<"session"> }) => {
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useContext(MessageContext);
  const convex = useConvex();
  const UpdateMessages = useMutation(api.session.UpdateMessages);

  useEffect(() => {
    getSessionData();
  }, [sessionId]);

  const getSessionData = async () => {
    const result = await convex.query(api.session.GetSession, {
      sessionId,
    });
    setMessages(result?.message || []);
  };

  const getAiResponse = async () => {
    setLoading(true);
    setIsTyping(true);
    try {
      const result = await axios.post(
        "/api/ai-chat",
        {
          prompt: CHAT_PROMPT,
          messages: messages, // Send the entire messages array
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000,
        }
      );

      if (!result.data || !result.data.result) {
        throw new Error("Invalid response from AI service");
      }

      const aiResponse: Message = {
        role: "ai" as const,
        content: result.data.result,
      };

      setMessages((prev: Message[]) => [...prev, aiResponse]);
      await UpdateMessages({
        sessionId,
        message: [...messages, aiResponse],
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "API Error:",
        axiosError.response?.data || axiosError.message
      );
      // Show error to user
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleGenerate = async (input: string) => {
    if (!input.trim()) return;
    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
  };

  useEffect(() => {
    if (messages?.length > 0 && messages[messages.length - 1].role === "user") {
      getAiResponse();
    }
  }, [messages]);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-[30%] border-r border-white/10 bg-zinc-900/30 backdrop-blur-lg flex flex-col"
    >
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages?.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "user" ? (
                <>
                  <div className="flex-1 bg-cyan-500/10 rounded-lg p-3 text-sm text-white/80">
                    {msg.content}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="text-white/70"
                    >
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="7" r="4" strokeWidth="2" />
                    </svg>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="text-cyan-400"
                    >
                      <path
                        d="M12 8V16M8 12H16"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg p-3 text-sm text-white/80">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <div className="animate-pulse">...</div>
              </div>
              <div className="flex-1 bg-white/5 rounded-lg p-3 text-sm text-white/80">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-black/10">
        <div className="relative">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate(userInput);
              }
            }}
            placeholder="Type your message..."
            className="bg-transparent rounded-none border-none text-white text-sm py-3 min-h-[80px] resize-none focus:ring-0 focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => handleGenerate(userInput)}
            className="absolute right-2 bottom-2 text-white/70 hover:text-white/90"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatView;
