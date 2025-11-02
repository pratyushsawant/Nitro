import React, { useState, useContext, useEffect } from "react";
import { MessageContext } from "@/context/MessageContext";
import { motion } from "framer-motion";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { Code, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import data from "@/constants/data";
import axios from "axios";
import prompt from "@/constants/prompt";

// Add interface for file structure
interface FileType {
  code: string;
  hidden?: boolean;
}

interface Files {
  [key: string]: FileType;
}

const CodeView = () => {
  const [activeTab, setActiveTab] = useState("code");
  const { messages, setMessages } = useContext(MessageContext);
  const [files, setFiles] = useState<Files | null>(null); // Add proper typing
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize files
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiles(data.DEFAULT_FILE); // Changed from DEFAULT_FILE to data.DEFAULT_FILE
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Watch for messages changes
  useEffect(() => {
    if (!files) return;

    if (messages?.length > 0 && !isProcessing) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        setIsProcessing(true);
        generateCode().finally(() => {
          setIsProcessing(false);
          setActiveTab("preview");
        });
      }
    }
  }, [messages, files]);

  type FileEntry = {
    filename: string;
    content: string;
  };

  type MergedFileFormat = {
    [path: string]: {
      code: string;
    };
  };

  function convertToMergedFormat(filesArray: FileEntry[]): MergedFileFormat {
    const formattedFiles: MergedFileFormat = {};

    filesArray.forEach(({ filename, content }) => {
      formattedFiles[`/${filename}`] = {
        code: content,
      };
    });

    return formattedFiles;
  }

  const generateCode = async () => {
    try {
      const lastMessage = messages[messages?.length - 1]?.content;
      const promptString = `${lastMessage} ` + prompt.CODE_GEN_PROMPT;

      const result = await axios.post("/api/gen-ai-code", {
        prompt: promptString,
      });

      const aiResp = result.data;

      console.log("AI response: ", aiResp);

      const mergedFiles = {
        ...data.DEFAULT_FILE,
        ...aiResp?.files,
      };

      console.log("here it is ", mergedFiles);

      setFiles(mergedFiles);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Code generated successfully" },
      ]);
      return aiResp;
    } catch (error) {
      console.error("Error generating code:", error);
      throw error;
    }
  };

  if (isInitializing || !files) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-zinc-900/30">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20"></div>
          <div className="text-cyan-400 text-lg">
            Initializing code environment...
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-zinc-900/30">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce"></div>
            <div
              className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
          <div className="text-cyan-400 text-lg">Generating your code...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex-1 h-full"
    >
      <Tabs defaultValue="code" className="h-full">
        <div className="border-b border-white/10 bg-black/20 p-2">
          <TabsList className="bg-zinc-900/50 border border-white/10">
            <TabsTrigger
              value="code"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              onClick={() => setActiveTab("code")}
            >
              <Code className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              onClick={() => setActiveTab("preview")}
            >
              <Play className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="p-1">
          <SandpackProvider
            files={files}
            template="react"
            theme={"dark"}
            customSetup={{
              dependencies: {
                ...data.DEPENDANCY,
              },
            }}
            options={{
              externalResources: ["https://cdn.tailwindcss.com"],
            }}
          >
            <div className="flex h-[calc(100vh-4rem)]">
              <div
                className={`h-full ${activeTab === "code" ? "block" : "hidden"}`}
              >
                <SandpackFileExplorer className="!w-40 !bg-zinc-900/30 h-full !text-xs" />
              </div>

              <div className="flex-1 h-full">
                <TabsContent value="code" className="h-full mt-0">
                  <SandpackLayout className="!rounded-none h-full !bg-transparent">
                    <SandpackCodeEditor
                      showTabs
                      showLineNumbers
                      showInlineErrors
                      wrapContent
                      closableTabs
                      className="h-full !bg-transparent"
                      style={{ fontSize: "12px", height: "100%" }}
                    />
                  </SandpackLayout>
                </TabsContent>

                <TabsContent value="preview" className="h-full mt-0">
                  <SandpackLayout className="h-full">
                    <SandpackPreview
                      className="h-full !bg-transparent"
                      style={{ height: "100%" }}
                    />
                  </SandpackLayout>
                </TabsContent>
              </div>
            </div>
          </SandpackProvider>
        </div>
      </Tabs>
    </motion.div>
  );
};

export default CodeView;
