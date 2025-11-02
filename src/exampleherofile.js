function Hero() {
  const [userInput, setUserInput] = useState("");
  const { setMessages } = useContext(MessageContext);
  const { userDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (input) => {
    if (!input.trim()) return;
    setIsGenerating(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    if (!userDetail?.name) {
      setOpenDialog(true);
      setIsGenerating(false);
      return;
    }

    try {
      const workspaceId = await CreateWorkspace({
        message: [{ role: "user", content: input }],
        user: userDetail._id,
      });

      router.push("/workspace/" + workspaceId);
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen h-[calc(103vh)] flex flex-col items-center justify-center text-white bg-gradient-to-br from-[#0d0d0d] to-[#0f0f0f] px-4 overflow-hidden  mt-[-8rem]">
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808050_1px,transparent_1px),linear-gradient(to_bottom,#80808050_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff10_0%,transparent_70%)]"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
      {/* Main content container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-8 py-20">
        {/* AI badge with pulse animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-white/10 backdrop-blur-sm flex items-center gap-2 group"
        >
          <Image src="/logo.png" alt="Flash AI" width={10} height={10} />
          <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-200">
            Flash
          </span>
        </motion.div>

        {/* Animated heading with typewriter effect */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-3xl bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-300 leading-tight mb-4"
          >
            Build Fast, Ship Fast
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-400/80 max-w-3xl mx-auto leading-relaxed"
          >
            {Lookup.HERO_DESC}
          </motion.p>
        </div>

        {/* AI input panel with floating effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative w-full max-w-2xl mt-12"
        >
          <motion.div whileHover={{ y: -5 }} className="relative group">
            {/* Glow effect */}
            <motion.div
              className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-500/30 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                opacity: [0, 0.2, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />

            {/* Main input card */}
            <div className="relative rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

              <div className="relative p-1">
                <Textarea
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate(userInput);
                    }
                  }}
                  value={userInput}
                  placeholder={Lookup.INPUT_PLACEHOLDER}
                  className="min-h-[140px] text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500/70 pr-16 resize-none"
                />

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-3 bottom-3"
                >
                  <Button
                    onClick={() => handleGenerate(userInput)}
                    disabled={isGenerating}
                    className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 shadow-lg shadow-purple-500/20 transition-all"
                  >
                    {isGenerating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/80 rounded-full border-t-transparent"
                      />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* AI helper text */}
              <div className="px-4 pb-3 pt-1 text-xs text-gray-500 flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>
                  Pro Tip: Ask for anything - code, content, analysis, or
                  creative ideas
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* AI prompt suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 w-full max-w-3xl"
        >
          <div className="text-center text-sm text-gray-500 mb-3">
            Try asking:
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {Lookup.SUGGSTIONS.map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 4px 14px rgba(139, 92, 246, 0.15)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setUserInput(suggestion);
                  handleGenerate(suggestion);
                }}
                className="cursor-pointer px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-gray-200 hover:text-white hover:border-white/30 transition-all flex items-center gap-2 text-sm"
              >
                <Wand2 className="w-4 h-4 text-purple-400" />
                <span>{suggestion}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* AI capabilities showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center"
        >
          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.01] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group">
            <div className="inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 mb-3">
              <BrainCircuit className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-medium text-lg mb-1">Context-Aware AI</h3>
            <p className="text-sm text-gray-400">
              Understands complex queries and maintains conversation context
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.01] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group">
            <div className="inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-br from-blue-600/20 to-emerald-600/20 mb-3">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-medium text-lg mb-1">Multi-Modal</h3>
            <p className="text-sm text-gray-400">
              Works with text, code, images, and data analysis
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.01] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group">
            <div className="inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-br from-pink-600/20 to-rose-600/20 mb-3">
              <Wand2 className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="font-medium text-lg mb-1">Real-Time Processing</h3>
            <p className="text-sm text-gray-400">
              Instant responses with streaming when available
            </p>
          </div>
        </motion.div>
      </div>

      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </div>
  );
}

export default Hero;
