function CodeView() {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { messages, setMessages } = useContext(MessageContext);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFiles(Lookup.DEFAULT_FILE);
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!files) return;

    if (messages?.length > 0 && !isProcessing) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        setIsProcessing(true);
        GenerateAiCode().finally(() => {
          setIsProcessing(false);
          setActiveTab("preview");
        });
      }
    }
  }, [messages, files]);

  const GenerateAiCode = async () => {
    try {
      const promptString =
        messages[messages?.length - 1]?.content + Prompt.CODE_GEN_PROMPT;
      const result = await axios.post("/api/gen-ai-code", {
        prompt: promptString,
      });
      const aiResp = result.data;

      const mergedFiles = {
        ...Lookup.DEFAULT_FILE,
        ...aiResp?.files,
      };
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
      <div className="bg-[#181818] w-full p-2 border rounded-lg gap-4 flex-col flex h-full min-h-[85vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-purple-900 opacity-70"></div>
          <div className="text-purple-400 text-lg font-medium">
            Initializing code environment...
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="bg-[#181818] w-full p-2 border rounded-lg gap-4 flex-col flex h-full min-h-[85vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce"></div>
            <div
              className="w-3 h-3 rounded-full bg-purple-400 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-purple-400 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
          <div className="text-purple-400 text-lg font-medium">
            Generating your code...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] w-full p-2 border rounded-lg gap-4 flex-col flex">
      <div className="flex flex-wrap items-center shrink-0 bg-black p-1 justify-center w-[125px] gap-3 rounded-full cursor-pointer">
        <h2
          onClick={() => setActiveTab("code")}
          className={`text-sm cursor-pointer ${
            activeTab === "code"
              ? "text-purple-200 bg-purple-900 p-1 px-2 rounded-full"
              : "text-gray-400"
          }`}
        >
          Code
        </h2>
        <h2
          onClick={() => setActiveTab("preview")}
          className={`text-sm cursor-pointer ${
            activeTab === "preview"
              ? "text-purple-200 bg-purple-900 bg-opacity-25 p-1 px-2 rounded-full"
              : "text-gray-400"
          }`}
        >
          Preview
        </h2>
      </div>
      <SandpackProvider
        files={files}
        template="react"
        theme={"dark"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
      >
        <SandpackLayout>
          {activeTab === "code" && (
            <>
              <SandpackFileExplorer style={{ height: "81vh" }} />
              <SandpackCodeEditor style={{ height: "81vh" }} />
            </>
          )}
          {activeTab === "preview" && (
            <SandpackPreview
              style={{ height: "81vh" }}
              showRefreshButton={true}
              showOpenInCodeSandbox={false}
            />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

export default CodeView;
