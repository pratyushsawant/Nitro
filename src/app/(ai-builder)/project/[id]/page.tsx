"use client";

import React from "react";
import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

const Builder = () => {
  const params = useParams();
  const sessionId = params.id as Id<"session">;

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-0/20 via-zinc-950/70 to-cyan-950/50">
      <ChatView sessionId={sessionId} />
      <CodeView />
    </div>
  );
};

export default Builder;
