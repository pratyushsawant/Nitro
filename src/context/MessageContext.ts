"use client";

import { createContext } from "react";

export interface Message {
  content: string;
  role: "user" | "ai";
}

interface MessageContextType {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}

export const MessageContext = createContext<MessageContextType>({
  messages: [],
  setMessages: () => {},
});

export interface Message {
  role: "user" | "ai";
  content: string;
}