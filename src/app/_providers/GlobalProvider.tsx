"use client";

import React, { useState } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { Message, MessageContext } from "@/context/MessageContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { UserDetailContext } from "@/context/UserDetailContext";
import { ClerkProvider } from "@clerk/nextjs";

interface GlobalProviderProps {
  children: React.ReactNode;
}

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userDetail, setUserDetail] = useState<any>({});

  // Add this check to ensure consistent client-side rendering
  const clientId =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY
      : "";

  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessageContext.Provider value={{ messages, setMessages }}>
            <NextThemeProvider
              attribute="class"
              enableSystem
              defaultTheme="dark"
              disableTransitionOnChange
            >
              {children}
            </NextThemeProvider>
          </MessageContext.Provider>
        </UserDetailContext.Provider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
};

export default GlobalProvider;
