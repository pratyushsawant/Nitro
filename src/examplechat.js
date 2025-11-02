function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessageContext);
  const { userDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);

  useEffect(() => {
    GetWorkspaceData();
  }, [id]);

  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    setMessages(result?.message);
  };

  const GetAiResponse = async () => {
    setLoading(true);
    setIsTyping(true);
    try {
      const promptString = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const result = await axios.post("/api/ai-chat", {
        prompt: promptString,
      });
      const aiResponse = { role: "ai", content: result.data.result };
      setMessages((prev) => [...prev, aiResponse]);
      await UpdateMessages({
        workspaceId: id,
        message: [...messages, aiResponse],
      });
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleGenerate = async (input) => {
    if (input.trim()) {
      const newMessage = { role: "user", content: input };
      setMessages((prev) => [...prev, newMessage]);
      setUserInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate(userInput);
    }
  };

  useEffect(() => {
    if (messages?.length > 0 && messages[messages.length - 1].role === "user") {
      GetAiResponse();
    }
  }, [messages]);

  const markdownComponents = {
    p: ({ node, ...props }) => (
      <p className="mb-2 leading-snug text-sm" {...props} />
    ),
    h1: ({ node, ...props }) => (
      <h1 className="text-lg font-bold mb-2 mt-3" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-base font-semibold mb-2 mt-3" {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-5 mb-2 text-sm" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-5 mb-2 text-sm" {...props} />
    ),
    code: ({ node, ...props }) => (
      <code
        className="bg-[#3a2e61] rounded px-1.5 py-0.5 text-xs font-mono"
        {...props}
      />
    ),
    a: ({ node, ...props }) => (
      <a className="text-pink-400 hover:underline text-sm" {...props} />
    ),
  };

  return (
    <div className="relative h-[88vh] flex flex-col">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-800 scrollbar-track-transparent">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "user" && userDetail?.picture && (
              <Image
                src={userDetail.picture}
                alt="user"
                width={30}
                height={30}
                className="rounded-full self-start flex-shrink-0"
              />
            )}

            <div
              className={`max-w-[80%] text-sm rounded-2xl p-3 ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-[#7F00FF] to-[#E100FF] text-slate-50 rounded-br-none"
                  : "bg-[#1e1b2e] text-slate-100 rounded-bl-none"
              }`}
            >
              <ReactMarkdown components={markdownComponents}>
                {msg.content}
              </ReactMarkdown>
            </div>

            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-[#1e1b2e] flex items-center justify-center self-start flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-pink-400"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-[#1e1b2e] flex items-center justify-center self-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-pink-400"
              >
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </div>
            <div className="bg-[#1e1b2e] text-slate-100 rounded-2xl rounded-bl-none p-3 max-w-[80%] text-sm">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border rounded-xl max-w-xl w-full mt-3 bg-[#1a162e]/70 backdrop-blur-md mx-auto">
        <div className="flex gap-2">
          <textarea
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            value={userInput}
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-24 max-h-48 resize-none text-sm text-slate-100 placeholder:text-slate-400"
          />
          <Button
            onClick={() => handleGenerate(userInput)}
            className="bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white text-sm px-3 py-2"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 flex justify-end">
          <LinkIcon className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </div>
  );
}

export default ChatView;
