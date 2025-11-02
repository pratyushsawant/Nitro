import { chatSession } from "@/configs/AIModel";  // Changed AiModel to AIModel
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Valid messages array is required" },
        { status: 400 }
      );
    }

    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const result = await chatSession.sendMessage(JSON.stringify(formattedMessages));
    const response = result.response.text();

    return NextResponse.json({ result: response });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error.message || "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}
