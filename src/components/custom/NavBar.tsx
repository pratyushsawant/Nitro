import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const NavBar = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [showAuthButtons, setShowAuthButtons] = useState(false);
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setShowAuthButtons(true);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-14 p-48 pt-12 flex flex-row items-center justify-between px-6 md:px-12 lg:px-16 backdrop-blur-[2px] fixed top-0 z-0"
    >
      <div className="flex w-full flex-row items-center justify-between">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="font-medium flex-row flex gap-2 text-sm text-white items-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src={"/logo.png"}
            alt={"Nitro logo"}
            width={38}
            height={38}
            className="object-contain"
          />
          <span className="font-black tracking-tight text-lg text-zinc-300">
            Nitro
          </span>
        </motion.span>
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonAvatarBox: "h-8 w-8",
                  userButtonTrigger: "focus:shadow-none focus:ring-0",
                  userButtonPopoverCard:
                    "bg-black/50 border border-white/10 shadow-lg backdrop-blur-md",
                  userButtonPopoverActionButton:
                    "text-white/80 hover:bg-white/5 hover:text-white",
                  userButtonPopoverActionButtonText: "text-white/80",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />
          ) : showAuthButtons ? (
            <>
              <Button
                onClick={() => router.push("/sign-in")}
                size="sm"
                variant="ghost"
                className="text-xs h-8 hover:bg-white/5"
              >
                Sign In
              </Button>
              <motion.div whileTap={{ scale: 1.0 }}>
                <Button
                  onClick={() => router.push("/sign-up")}
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
                >
                  Sign Up
                </Button>
              </motion.div>
            </>
          ) : (
            <div className="h-8 w-16"></div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NavBar;
